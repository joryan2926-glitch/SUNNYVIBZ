"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type RewardAccount = { id: string; points: number; level: string; updated_at: string };
type RewardTransaction = { id: string; points: number; kind: "earned" | "redeemed" | "bonus" | "expired"; label: string; created_at: string };
type Reward = { id: string; title: string; description: string | null; points_cost: number; active: boolean };
type Result<T> = { data: T | null; error: { message: string } | null };
type ListResult<T> = { data: T[] | null; error: { message: string } | null };
type RewardsClient = {
  from: (table: "reward_accounts" | "reward_transactions" | "reward_catalog") => {
    select: (columns: string) => { eq: (column: string, value: string) => { order: (column: string, options: { ascending: boolean }) => Promise<ListResult<RewardAccount | RewardTransaction | Reward>>; maybeSingle: () => Promise<Result<RewardAccount>> } };
    insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
  rpc: (name: "redeem_reward", args: { p_reward_id: string }) => Promise<{ data: boolean | null; error: { message: string } | null }>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const levelLabels: Record<string, string> = { membre_actif: "Membre actif", participant: "Participant", createur: "Créateur", ambassadeur: "Ambassadeur" };
const icons = ["✦", "◌", "◇", "✧"];

export function RewardsDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<RewardAccount | null>(null);
  const [transactions, setTransactions] = useState<RewardTransaction[]>([]);
  const [catalog, setCatalog] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const loadRewards = useCallback(async (userId: string) => {
    const client = supabase as unknown as RewardsClient;
    const accountResult = await client.from("reward_accounts").select("id,points,level,updated_at").eq("user_id", userId).maybeSingle();
    let currentAccount = accountResult.data;
    if (!currentAccount) {
      const { error } = await client.from("reward_accounts").insert({ user_id: userId, points: 0, level: "membre_actif" });
      if (!error) { const refreshed = await client.from("reward_accounts").select("id,points,level,updated_at").eq("user_id", userId).maybeSingle(); currentAccount = refreshed.data; }
    }
    const transactionsResult = await client.from("reward_transactions").select("id,points,kind,label,created_at").eq("user_id", userId).order("created_at", { ascending: false });
    const catalogResult = await client.from("reward_catalog").select("id,title,description,points_cost,active").eq("active", "true").order("created_at", { ascending: true });
    setAccount(currentAccount);
    setTransactions((transactionsResult.data ?? []) as RewardTransaction[]);
    setCatalog((catalogResult.data ?? []) as Reward[]);
    if (accountResult.error || transactionsResult.error || catalogResult.error) setNotice("Les données Rewards ne sont pas encore disponibles. Vérifiez le SQL du module 07.");
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await loadRewards(data.session.user.id); else setLoading(false);
    }
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => { mounted = false; window.clearTimeout(timer); };
  }, [loadRewards, supabase]);

  async function redeem(reward: Reward) {
    if (!session || !account || account.points < reward.points_cost) { setNotice("Votre solde est insuffisant pour cet avantage."); return; }
    setPending(reward.id);
    setNotice("");
    const client = supabase as unknown as RewardsClient;
    const { data, error } = await client.rpc("redeem_reward", { p_reward_id: reward.id });
    if (error || data !== true) { setNotice("La dépense n’a pas abouti. Vérifiez que le SQL Rewards est exécuté."); setPending(null); return; }
    await loadRewards(session.user.id);
    setNotice(`${reward.title} est réservé. L’équipe SUNNYVIBZ reviendra vers vous.`);
    setPending(null);
  }

  if (loading) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-sm text-white/60 sm:px-8">Chargement de vos Rewards...</main>;
  if (!session) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-white sm:px-8"><div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Rewards</p><h1 className="mt-3 text-3xl font-semibold">Connectez-vous pour retrouver vos points.</h1><Link href="/connexion" className="mt-7 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017]">Se connecter</Link></div></main>;

  const points = account?.points ?? 0;
  const progress = Math.min(100, Math.round((points / 300) * 100));
  const level = levelLabels[account?.level ?? "membre_actif"] ?? "Membre actif";
  return <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl space-y-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Rewards</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Chaque geste compte.</h1><p className="mt-2 max-w-2xl text-sm text-white/60">Participez, créez, partagez : vos engagements font grandir votre statut.</p></div><Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link></div>
    <section className="grid gap-5 md:grid-cols-[1.3fr_1fr]"><article className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-400/20 via-[#0a241d] to-[#07130f] p-7 shadow-[0_0_60px_rgba(16,185,129,0.12)]"><div className="relative flex items-start justify-between gap-4"><div><p className="text-sm text-white/60">Votre solde</p><p className="mt-3 text-5xl font-semibold tracking-tight">{points} <span className="text-xl text-emerald-200">points</span></p></div><span className="rounded-full border border-amber-200/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">{level}</span></div><div className="relative mt-7"><div className="flex items-center justify-between text-xs text-white/55"><span>Progression ambassadeur</span><span>{points} / 300</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-200 transition-all" style={{ width: `${progress}%` }} /></div></div><p className="relative mt-3 text-sm text-white/55">{points >= 300 ? "Palier ambassadeur débloqué." : `Encore ${300 - points} points pour débloquer les avantages ambassadeur.`}</p></article><article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl"><p className="text-sm text-white/60">Votre parcours</p><h2 className="mt-2 text-xl font-semibold">Adhérent → Ambassadeur</h2><div className="mt-6 space-y-4"><div className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-300 text-[#032017]">✓</span><span>Adhérent</span></div><div className="ml-3 h-4 border-l border-dashed border-emerald-300/40" /><div className="flex items-center gap-3 text-sm text-white/45"><span className="grid h-7 w-7 place-items-center rounded-full border border-white/20">3</span><span>Participant</span></div><div className="ml-3 h-4 border-l border-dashed border-white/20" /><div className="flex items-center gap-3 text-sm text-white/45"><span className="grid h-7 w-7 place-items-center rounded-full border border-white/20">6</span><span>Ambassadeur</span></div></div></article></section>
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Catalogue</p><h2 className="mt-2 text-2xl font-semibold">Échanger vos points</h2></div>{notice ? <p role="status" className="mt-5 rounded-xl border border-amber-200/25 bg-amber-200/5 px-4 py-3 text-sm text-amber-100">{notice}</p> : null}<div className="mt-6 grid gap-4 md:grid-cols-3">{catalog.map((reward, index) => <article key={reward.id} className="rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:-translate-y-1 hover:border-emerald-300/40"><span className="text-2xl text-amber-200">{icons[index % icons.length]}</span><h3 className="mt-4 font-semibold">{reward.title}</h3><p className="mt-1 text-sm text-white/50">{reward.description}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-emerald-200">{reward.points_cost} pts</span><button type="button" disabled={pending === reward.id || points < reward.points_cost} onClick={() => void redeem(reward)} className="rounded-full border border-emerald-300/35 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10 disabled:cursor-not-allowed disabled:opacity-40">{pending === reward.id ? "..." : points < reward.points_cost ? "Solde insuffisant" : "Utiliser"}</button></div></article>)}</div>{catalog.length === 0 ? <p className="mt-6 rounded-2xl border border-white/10 bg-black/15 p-5 text-sm text-white/55">Le catalogue sera disponible après l’exécution du SQL Rewards.</p> : null}</section>
    <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Historique</p><h2 className="mt-2 text-2xl font-semibold">Derniers mouvements</h2></div></div><div className="mt-6 divide-y divide-white/10">{transactions.length === 0 ? <p className="py-4 text-sm text-white/50">Aucun mouvement pour le moment.</p> : transactions.map((entry) => <div key={entry.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{entry.label}</p><p className="mt-1 text-xs text-white/45">{dateFormatter.format(new Date(entry.created_at))}</p></div><p className={`text-sm font-semibold ${entry.points < 0 ? "text-amber-200" : "text-emerald-300"}`}>{entry.points > 0 ? "+" : ""}{entry.points} pts</p></div>)}</div></section>
  </div></main>;
}