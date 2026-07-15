"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type WorkshopBooking = { id: string; workshop_title: string; workshop_date: string; status: "pending" | "confirmed" | "cancelled"; created_at: string; subscription_plan_slug: string | null; priority_access: boolean };
type SpaceBooking = { id: string; space_title: string; requested_date: string; requested_time_slot: string; status: "pending" | "confirmed" | "cancelled"; created_at: string; subscription_plan_slug: string | null; priority_access: boolean };
type QueryResult = { data: unknown[] | null; error: { message: string } | null };
type ReservationsClient = { from: (table: "workshop_bookings" | "space_bookings") => { select: (columns: string) => { eq: (column: string, value: string) => { order: (column: string, options: { ascending: boolean }) => Promise<QueryResult> } } } };
type ReservationItem = { id: string; title: string; date: string; kind: "Atelier" | "Espace"; status: WorkshopBooking["status"]; createdAt: string; plan: string | null; priority: boolean; timeSlot?: string };

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const dayFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" });
const statusLabels: Record<ReservationItem["status"], string> = { pending: "En attente", confirmed: "Confirmée", cancelled: "Annulée" };
const statusClasses: Record<ReservationItem["status"], string> = { pending: "border-[#ffd978]/30 bg-[#ffd978]/10 text-[#ffd978]", confirmed: "border-[#18f2a6]/30 bg-[#18f2a6]/10 text-[#18f2a6]", cancelled: "border-red-300/30 bg-red-500/10 text-red-100" };

function safeDate(value: string, fallback = "Date à confirmer") { const date = new Date(value); return Number.isNaN(date.getTime()) ? fallback : dateFormatter.format(date); }
function safeDay(value: string) { const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? "Date à confirmer" : dayFormatter.format(date); }
function getPlanLabel(slug: string | null) { if (!slug) return "Tarif public à confirmer"; return `Formule ${slug.charAt(0).toUpperCase()}${slug.slice(1)}`; }

export function AccountReservationsDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadReservations() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      const currentSession = sessionData.session;
      setSession(currentSession);
      if (!currentSession?.user.email) { setLoading(false); return; }
      const client = supabase as unknown as ReservationsClient;
      const email = currentSession.user.email.toLowerCase();
      const [workshopsResult, spacesResult] = await Promise.all([
        client.from("workshop_bookings").select("id,workshop_title,workshop_date,status,created_at,subscription_plan_slug,priority_access").eq("email", email).order("created_at", { ascending: false }),
        client.from("space_bookings").select("id,space_title,requested_date,requested_time_slot,status,created_at,subscription_plan_slug,priority_access").eq("email", email).order("created_at", { ascending: false }),
      ]);
      if (!mounted) return;
      const nextItems: ReservationItem[] = [];
      for (const row of (workshopsResult.data ?? []) as WorkshopBooking[]) nextItems.push({ id: `workshop-${row.id}`, title: row.workshop_title, date: row.workshop_date, kind: "Atelier", status: row.status, createdAt: row.created_at, plan: row.subscription_plan_slug, priority: row.priority_access });
      for (const row of (spacesResult.data ?? []) as SpaceBooking[]) nextItems.push({ id: `space-${row.id}`, title: row.space_title, date: row.requested_date, kind: "Espace", status: row.status, createdAt: row.created_at, plan: row.subscription_plan_slug, priority: row.priority_access, timeSlot: row.requested_time_slot });
      nextItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(nextItems);
      if (workshopsResult.error || spacesResult.error) setMessage("Certaines réservations ne sont pas encore accessibles. Vérifiez que les modules SQL sont bien exécutés dans Supabase.");
      setLoading(false);
    }
    void loadReservations();
    return () => { mounted = false; };
  }, [supabase]);

  const activeCount = items.filter((item) => item.status !== "cancelled").length;
  if (loading) return <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-sm text-[#fbf3df]/65">Chargement de vos réservations...</div>;
  if (!session) return <div className="rounded-[2rem] border border-[#ffd978]/18 bg-white/[0.055] p-7"><h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">Connexion requise</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#fbf3df]/68">Connectez-vous pour retrouver vos demandes d’ateliers et d’espaces au même endroit.</p><Link href="/connexion" className="mt-6 inline-flex rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]">Se connecter</Link></div>;

  return <div className="grid gap-6">
    <section className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-[1.7rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-5"><p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">Total</p><p className="mt-2 text-3xl font-semibold text-[#fbf3df]">{items.length}</p><p className="mt-1 text-xs text-[#fbf3df]/55">demande(s) enregistrée(s)</p></div>
      <div className="rounded-[1.7rem] border border-[#ffd978]/20 bg-[#ffd978]/10 p-5"><p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">À suivre</p><p className="mt-2 text-3xl font-semibold text-[#fbf3df]">{activeCount}</p><p className="mt-1 text-xs text-[#fbf3df]/55">réservation(s) active(s)</p></div>
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-5"><p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#fbf3df]/55">Compte</p><p className="mt-2 truncate text-sm font-semibold text-[#fbf3df]">{session.user.email}</p><p className="mt-1 text-xs text-[#fbf3df]/55">lecture sécurisée par RLS</p></div>
    </section>
    {message ? <p role="status" className="rounded-2xl border border-[#ffd978]/20 bg-[#ffd978]/10 px-4 py-3 text-sm text-[#ffd978]">{message}</p> : null}
    {items.length === 0 ? <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center"><p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-[#18f2a6]">Votre agenda SunnyVibz</p><h2 className="mt-3 text-2xl font-semibold text-[#fbf3df]">Aucune réservation pour le moment.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#fbf3df]/62">Explorez les ateliers ou demandez un espace pour créer votre prochaine expérience artistique.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/ateliers" className="rounded-full bg-[#18f2a6] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#032017]">Voir les ateliers</Link><Link href="/espaces" className="rounded-full border border-[#ffd978]/35 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]">Découvrir les espaces</Link></div></section> : <section className="grid gap-4">{items.map((item) => <article key={item.id} className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 sm:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-[#18f2a6]/25 bg-[#18f2a6]/10 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#18f2a6]">{item.kind}</span><span className={`rounded-full border px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] ${statusClasses[item.status]}`}>{statusLabels[item.status]}</span>{item.priority ? <span className="rounded-full border border-[#ffd978]/30 bg-[#ffd978]/10 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#ffd978]">Prioritaire</span> : null}</div><h2 className="mt-3 text-xl font-semibold text-[#fbf3df]">{item.title}</h2><p className="mt-2 text-sm text-[#fbf3df]/68">{item.kind === "Espace" ? `${safeDay(item.date)} · ${item.timeSlot || "Créneau à confirmer"}` : safeDate(item.date)}</p></div><p className="text-xs text-[#fbf3df]/45">Demandée le {safeDate(item.createdAt)}</p></div><div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 text-xs text-[#fbf3df]/55 sm:flex-row sm:items-center sm:justify-between"><span>{getPlanLabel(item.plan)}</span>{item.kind === "Atelier" ? <Link href="/ateliers" className="font-black uppercase tracking-[0.12em] text-[#18f2a6] transition hover:text-[#fbf3df]">Voir les ateliers →</Link> : <Link href="/espaces" className="font-black uppercase tracking-[0.12em] text-[#18f2a6] transition hover:text-[#fbf3df]">Voir les espaces →</Link>}</div></article>)}</section>}
  </div>;
}
