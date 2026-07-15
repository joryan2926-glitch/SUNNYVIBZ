import { createClient } from "@supabase/supabase-js";
import { sendBookingNotification } from "@/lib/notifications";

type Source = "workshop" | "space";
type Status = "confirmed" | "cancelled";
type RpcClient = { rpc: (name: "cancel_workshop_booking" | "cancel_space_booking", args: { p_booking_id: string }) => Promise<{ data: boolean | null; error: { message: string } | null }> };

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authorization = request.headers.get("authorization");
  if (!url || !anonKey) return Response.json({ message: "Supabase n’est pas configuré." }, { status: 500 });
  if (!authorization?.startsWith("Bearer ")) return Response.json({ message: "Authentification requise." }, { status: 401 });

  let body: { booking_id?: string; source?: Source; status?: Status };
  try {
    body = await request.json() as { booking_id?: string; source?: Source; status?: Status };
  } catch {
    return Response.json({ message: "Requête invalide." }, { status: 400 });
  }
  if (!body.booking_id || (body.source !== "workshop" && body.source !== "space") || (body.status !== "confirmed" && body.status !== "cancelled")) {
    return Response.json({ message: "Paramètres de réservation invalides." }, { status: 400 });
  }

  const token = authorization.slice("Bearer ".length);
  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: authorization } } });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return Response.json({ message: "Session invalide." }, { status: 401 });
  const { data: profile, error: profileError } = await supabase.from("profiles").select("is_admin").eq("id", userData.user.id).maybeSingle();
  if (profileError || !profile?.is_admin) return Response.json({ message: "Accès administrateur requis." }, { status: 403 });

  let title = "";
  let date = "";
  let email = "";
  let name = "";
  let timeSlot: string | undefined;
  if (body.source === "workshop") {
    const { data, error } = await supabase.from("workshop_bookings").select("title:workshop_title,workshop_date,email,name").eq("id", body.booking_id).maybeSingle();
    if (error || !data) return Response.json({ message: "Réservation atelier introuvable." }, { status: 404 });
    title = data.title;
    date = data.workshop_date;
    email = data.email;
    name = data.name;
  } else {
    const { data, error } = await supabase.from("space_bookings").select("title:space_title,requested_date,requested_time_slot,email,name").eq("id", body.booking_id).maybeSingle();
    if (error || !data) return Response.json({ message: "Demande espace introuvable." }, { status: 404 });
    title = data.title;
    date = data.requested_date;
    timeSlot = data.requested_time_slot;
    email = data.email;
    name = data.name;
  }

  if (body.status === "cancelled") {
    const rpcName = body.source === "workshop" ? "cancel_workshop_booking" : "cancel_space_booking";
    const { data, error } = await (supabase as unknown as RpcClient).rpc(rpcName, { p_booking_id: body.booking_id });
    if (error || data !== true) return Response.json({ message: "L’annulation n’a pas abouti." }, { status: 409 });
  } else {
    const table = body.source === "workshop" ? "workshop_bookings" : "space_bookings";
    const { error } = await supabase.from(table).update({ status: body.status }).eq("id", body.booking_id);
    if (error) return Response.json({ message: "La confirmation n’a pas abouti." }, { status: 409 });
  }

  const notification = await sendBookingNotification({ to: email, name, title, date, timeSlot, kind: body.source === "workshop" ? "atelier" : "espace", status: body.status });
  return Response.json({ ok: true, emailSent: notification.sent });
}
