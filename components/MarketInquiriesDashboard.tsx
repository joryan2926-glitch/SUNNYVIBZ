"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Inquiry = { id: string; offer_id: string | null; name: string; message: string; status: "new" | "contacted" | "quoted" | "converted" | "closed"; created_at: string };
type InquiryClient = { from: (table: "market_inquiries") => { select: (columns: string) => { eq: (column: string, value: string) => { order: (column: string, options: { ascending: boolean }) => Promise<{ data: Inquiry[] | null; error: { message: string } | null }> } } } };

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
const statusLabels: Record<Inquiry["status"], string> = { new: "Nouvelle", contacted: "Prise en charge", quoted: "Devis en préparation", converted: "Projet confirmé", closed: "Clôturée" };
const statusClasses: Record<Inquiry["status"], string> = { new: "border-[#18f2a6]/30 bg-[#18f2a6]/10 text-[#18f2a6]", contacted: "border-[#ffd978]/30 bg-[#ffd978]/10 text-[#ffd978]", quoted: "border-[#ffd978]/30 bg-[#ffd978]/10 text-[#ffd978]", converted: "border-[#18f2a6]/30 bg-[#18f2a6]/10 text-[#18f2a6]", closed: "border-white/15 bg-white/[0.06] text-white/55" };

export function MarketInquiriesDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(sessionData.session);
      const userId = sessionData.session?.user.id;
      if (!userId) { setLoading(false); return; }
      const client = supabase as unknown as InquiryClient;
      const { data, error } = await client.from("market_inquiries").select("id,offer_id,name,message,status,created_at").eq("user_id", userId).order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) setMessage("Le suivi Market sera disponible après l’exécution du SQL du module 04.");
      setInquiries(data ?? []);
      setLoading(false);
    }
    void load();
    return () => { mounted = false; };
  }, [supabase]);

  if (loading) return <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-sm text-[#fbf3df]/65">Chargement de vos demandes Market...</div>;
  if (!session) return <div className="rounded-[2rem] border border-[#ffd978]/18 bg-white/[0.055] p-7"><h2 className="text-2xl font-semibold text-[#fbf3df]">Connectez-vous pour suivre vos demandes.</h2><Link href="/connexion" className="mt-6 inline-flex rounded-full bg-[#18f2a6] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#032017]">Se connecter</Link></div>;

  return <div className="grid gap-6">
    <section className="rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6"><p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">SUNNY Market</p><h2 className="mt-3 text-2xl font-semibold text-[#fbf3df]">Vos demandes de collaboration</h2><p className="mt-2 text-sm leading-7 text-[#fbf3df]/65">Chaque demande est suivie par l’équipe avant la mise en relation avec le talent.</p></section>
    {message ? <p role="status" className="rounded-2xl border border-[#ffd978]/20 bg-[#ffd978]/10 px-4 py-3 text-sm text-[#ffd978]">{message}</p> : null}
    {inquiries.length === 0 ? <section className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 text-center"><h2 className="text-2xl font-semibold text-[#fbf3df]">Aucune demande Market.</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#fbf3df]/62">Explorez les offres des artistes et envoyez une demande pour démarrer un projet.</p><Link href="/marketplace" className="mt-6 inline-flex rounded-full bg-[#18f2a6] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#032017]">Explorer le Market</Link></section> : <section className="grid gap-4">{inquiries.map((inquiry) => <article key={inquiry.id} className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><span className={`inline-flex rounded-full border px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] ${statusClasses[inquiry.status]}`}>{statusLabels[inquiry.status]}</span><p className="mt-3 text-xs text-[#fbf3df]/45">Demande du {dateFormatter.format(new Date(inquiry.created_at))}</p></div><span className="text-xs text-[#fbf3df]/40">Référence {inquiry.id.slice(0, 8)}</span></div><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#fbf3df]/76">{inquiry.message}</p></article>)}</section>}
  </div>;
}
