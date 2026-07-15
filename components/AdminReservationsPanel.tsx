"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Status = "pending" | "confirmed" | "cancelled";
type BookingRow = { id: string; title: string; date: string; email: string; name: string; status: Status; created_at: string; priority_access: boolean; kind: "Atelier" | "Espace"; source: "workshop" | "space" };
type QueryResult<T> = { data: T[] | null; error: { message: string } | null };
type AdminClient = { from: (table: "workshop_bookings" | "space_bookings") => { select: (columns: string) => { order: (column: string, options: { ascending: boolean }) => Promise<QueryResult<unknown>> }; update: (payload: Record<string, unknown>) => { eq: (column: string, value: string) => Promise<{ error: { message: string } | null }> } }; rpc: (name: "cancel_workshop_booking" | "cancel_space_booking", args: { p_booking_id: string }) => Promise<{ data: boolean | null; error: { message: string } | null }> };

const formatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const statusLabels: Record<Status, string> = { pending: "En attente", confirmed: "Confirmée", cancelled: "Annulée" };

export function AdminReservationsPanel() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("pending");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadBookings = useCallback(async () => {
    const client = supabase as unknown as AdminClient;
    const [workshops, spaces] = await Promise.all([
      client.from("workshop_bookings").select("id,workshop_title,workshop_date,email,name,status,created_at,priority_access").order("created_at", { ascending: false }),
      client.from("space_bookings").select("id,space_title,requested_date,email,name,status,created_at,priority_access").order("created_at", { ascending: false }),
    ]);
    const next: BookingRow[] = [];
    for (const row of (workshops.data ?? []) as Array<Record<string, unknown>>) next.push({ id: String(row.id), title: String(row.workshop_title), date: String(row.workshop_date), email: String(row.email), name: String(row.name), status: row.status as Status, created_at: String(row.created_at), priority_access: Boolean(row.priority_access), kind: "Atelier", source: "workshop" });
    for (const row of (spaces.data ?? []) as Array<Record<string, unknown>>) next.push({ id: String(row.id), title: String(row.space_title), date: String(row.requested_date), email: String(row.email), name: String(row.name), status: row.status as Status, created_at: String(row.created_at), priority_access: Boolean(row.priority_access), kind: "Espace", source: "space" });
    next.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setBookings(next);
    if (workshops.error || spaces.error) setMessage("Les réservations ne sont pas accessibles. Vérifiez le SQL et les droits admin.");
    setLoading(false);
  }, [supabase]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void loadBookings(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadBookings]);

  async function changeStatus(booking: BookingRow, status: Status) {
    setWorking(booking.id);
    setMessage("");
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setMessage("Session admin expiree. Reconnectez-vous.");
      setWorking(null);
      return;
    }
    const response = await fetch("/api/admin/booking-status", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: booking.id, source: booking.source, status }),
    });
    const result = await response.json() as { message?: string; emailSent?: boolean };
    if (!response.ok) {
      setMessage(result.message ?? "La mise a jour de la reservation a echoue.");
      setWorking(null);
      return;
    }
    setBookings((current) => current.map((item) => item.id === booking.id && item.source === booking.source ? { ...item, status } : item));
    setMessage(status === "confirmed" ? result.emailSent ? "Reservation confirmee et notification envoyee." : "Reservation confirmee. Ajoutez RESEND_API_KEY pour envoyer l email." : "Reservation annulee et capacite restauree.");
    setWorking(null);
  }
  const visible = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);
  const pendingCount = bookings.filter((booking) => booking.status === "pending").length;
  if (loading) return <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 text-sm text-[#fbf3df]/60">Chargement des réservations admin...</section>;

  return <section className="rounded-[2.2rem] border border-[#ffd978]/18 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 sm:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">Inbox réservations</p><h2 className="mt-3 text-2xl font-semibold text-[#fbf3df]">Traiter les demandes entrantes.</h2><p className="mt-2 text-sm text-[#fbf3df]/62">{pendingCount} demande(s) attendent une validation.</p></div><div className="flex flex-wrap gap-2">{(["pending", "confirmed", "cancelled", "all"] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full border px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] transition ${filter === value ? "border-[#18f2a6]/45 bg-[#18f2a6]/12 text-[#18f2a6]" : "border-white/10 text-[#fbf3df]/55 hover:border-[#18f2a6]/25"}`}>{value === "all" ? "Toutes" : statusLabels[value]}</button>)}</div></div>
    {message ? <p role="status" className="mt-5 rounded-2xl border border-[#ffd978]/20 bg-[#ffd978]/10 px-4 py-3 text-sm text-[#ffd978]">{message}</p> : null}
    {visible.length === 0 ? <p className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm text-[#fbf3df]/55">Aucune réservation dans ce filtre.</p> : <div className="mt-6 grid gap-3">{visible.map((booking) => <article key={`${booking.source}-${booking.id}`} className="rounded-2xl border border-white/10 bg-black/18 p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#18f2a6]/25 bg-[#18f2a6]/10 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-[0.12em] text-[#18f2a6]">{booking.kind}</span><span className="text-xs text-[#fbf3df]/55">{statusLabels[booking.status]}</span>{booking.priority_access ? <span className="text-[0.62rem] font-black uppercase tracking-[0.1em] text-[#ffd978]">Prioritaire</span> : null}</div><h3 className="mt-2 font-semibold text-[#fbf3df]">{booking.title}</h3><p className="mt-1 text-xs text-[#fbf3df]/55">{booking.name} · {booking.email}</p><p className="mt-1 text-xs text-[#fbf3df]/42">{formatter.format(new Date(booking.date))} · Demande {formatter.format(new Date(booking.created_at))}</p></div><div className="flex flex-wrap gap-2">{booking.status === "pending" ? <button type="button" disabled={working === booking.id} onClick={() => void changeStatus(booking, "confirmed")} className="rounded-full bg-[#18f2a6] px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-[#032017] disabled:opacity-50">{working === booking.id ? "..." : "Confirmer"}</button> : null}{booking.status !== "cancelled" ? <button type="button" disabled={working === booking.id} onClick={() => void changeStatus(booking, "cancelled")} className="rounded-full border border-red-300/30 px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.12em] text-red-100 disabled:opacity-50">Annuler</button> : null}</div></div></article>)}</div>}
  </section>;
}
