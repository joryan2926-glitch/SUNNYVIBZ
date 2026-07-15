"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type WalletRow = { sunny_credits: number | null; balance_cents: number; currency: string };
type TransactionRow = { id: string; label: string; amount_cents: number; kind: string; status: string; created_at: string };
type WalletTableClient = {
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{ data: WalletRow | null; error: { message: string } | null }>;
      order: (column: string, options: { ascending: boolean }) => {
        limit: (count: number) => Promise<{ data: TransactionRow[] | null; error: { message: string } | null }>;
      };
    };
  };
};
type PaymentsClient = { insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }> };
type WalletQueryClient = { from: (table: "wallets" | "wallet_transactions" | "payment_requests") => WalletTableClient & PaymentsClient };
const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

export function WalletDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadWallet() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData.session;
      if (!mounted) return;
      setSession(currentSession);
      if (!currentSession) { setLoading(false); return; }

      const client = supabase as unknown as WalletQueryClient;
      const walletResult = await client.from("wallets").select("sunny_credits,balance_cents,currency").eq("user_id", currentSession.user.id).maybeSingle();
      const transactionResult = await client.from("wallet_transactions").select("id,label,amount_cents,kind,status,created_at").eq("user_id", currentSession.user.id).order("created_at", { ascending: false }).limit(8);
      if (!mounted) return;
      if (walletResult.error) setNotice("Le wallet n’est pas encore disponible. Vérifiez le SQL du module wallet.");
      setCredits(walletResult.data?.sunny_credits ?? 0);
      setTransactions(transactionResult.data ?? []);
      setLoading(false);
    }
    loadWallet();
    return () => { mounted = false; };
  }, [supabase]);

  async function requestTopUp(amount: number) {
    if (!session) { setNotice("Connectez-vous pour demander une recharge."); return; }
    setPendingAmount(amount);
    setNotice("");
    const client = supabase as unknown as WalletQueryClient;
    const { error } = await client.from("payment_requests").insert({ user_id: session.user.id, amount_cents: amount * 100, purpose: `Recharge de ${amount} Sunny Credits`, provider: "manual", status: "pending" });
    setPendingAmount(null);
    setNotice(error ? "La demande de recharge n’a pas pu être enregistrée." : "Demande de recharge enregistrée. Le paiement Stripe sera activé après configuration.");
  }

  if (loading) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-sm text-white/60 sm:px-8">Chargement de votre wallet...</main>;
  if (!session) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-white sm:px-8"><div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Sunny Pass</p><h1 className="mt-3 text-3xl font-semibold">Connectez-vous pour accéder à votre wallet.</h1><Link href="/connexion" className="mt-7 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017]">Se connecter</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Sunny Pass</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Mon portefeuille</h1><p className="mt-2 max-w-2xl text-sm text-white/60">Gérez vos Sunny Credits, vos recharges et vos paiements depuis un espace unique.</p></div><Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link></div>
      <section className="grid gap-5 md:grid-cols-[1.3fr_1fr]"><article className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-400/20 via-[#0a241d] to-[#07130f] p-7 shadow-[0_0_60px_rgba(16,185,129,0.12)]"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" /><p className="relative text-sm text-white/60">Solde disponible</p><p className="relative mt-4 text-5xl font-semibold tracking-tight">{credits ?? 0} <span className="text-xl text-emerald-200">crédits</span></p><p className="relative mt-3 text-sm text-white/55">Utilisables pour les ateliers, espaces et événements SunnyVibz.</p><div className="relative mt-7 flex flex-wrap gap-3">{[25, 50, 100].map((amount) => <button key={amount} type="button" disabled={pendingAmount !== null} onClick={() => requestTopUp(amount)} className="rounded-full bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200 disabled:opacity-60">{pendingAmount === amount ? "Envoi..." : `Recharger ${amount}`}</button>)}</div></article><article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"><p className="text-sm text-white/60">Paiements</p><h2 className="mt-2 text-xl font-semibold">Une recharge, zéro friction.</h2><p className="mt-3 text-sm leading-6 text-white/55">Vos demandes sont enregistrées dans Supabase. Stripe sera branché lorsque les clés de paiement seront configurées.</p><div className="mt-6 rounded-2xl border border-dashed border-emerald-300/30 bg-emerald-300/5 p-4 text-sm text-emerald-100">Paiement sécurisé en préparation</div></article></section>
      <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Historique</p><h2 className="mt-2 text-2xl font-semibold">Dernières opérations</h2></div><span className="text-xs text-white/40">Synchronisé Supabase</span></div><div className="mt-6 divide-y divide-white/10">{transactions.length > 0 ? transactions.map((transaction) => <div key={transaction.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{transaction.label}</p><p className="mt-1 text-xs text-white/45">{dateFormatter.format(new Date(transaction.created_at))} · {transaction.status}</p></div><p className={`text-sm font-semibold ${transaction.amount_cents >= 0 ? "text-emerald-300" : "text-amber-200"}`}>{transaction.amount_cents >= 0 ? "+" : "−"} {Math.abs(transaction.amount_cents / 100)} crédits</p></div>) : <p className="py-4 text-sm text-white/50">Aucune opération enregistrée pour le moment.</p>}</div></section>
      {notice ? <p role="status" aria-live="polite" className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{notice}</p> : null}
    </div></main>
  );
}
