"use client";

import Link from "next/link";
import { useState } from "react";

const rewards = [
  { title: "Accès Sunilounge", detail: "Une invitation découverte", cost: 60, icon: "✦" },
  { title: "−10 % sur un atelier", detail: "Valable sur une réservation", cost: 120, icon: "◌" },
  { title: "Pass événement", detail: "Une place pour Sunny Friday", cost: 250, icon: "◇" },
];

const history = [
  { label: "Participation à Creative Lab", date: "Aujourd’hui", points: "+ 40" },
  { label: "Réservation d’un espace", date: "12 juin 2026", points: "+ 25" },
  { label: "Bonus de bienvenue", date: "08 juin 2026", points: "+ 50" },
];

export function RewardsDashboard() {
  const [notice, setNotice] = useState("");

  function handleRedeem(title: string, cost: number) {
    setNotice(`${title} sera disponible après validation de votre solde (${cost} points requis).`);
  }

  return (
    <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Rewards</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Chaque geste compte.</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">Participez, créez, partagez : vos engagements font grandir votre statut et débloquent de nouveaux avantages.</p>
          </div>
          <Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link>
        </div>

        <section className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <article className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-400/20 via-[#0a241d] to-[#07130f] p-7 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div><p className="text-sm text-white/60">Votre solde</p><p className="mt-3 text-5xl font-semibold tracking-tight">145 <span className="text-xl text-emerald-200">points</span></p></div>
              <span className="rounded-full border border-amber-200/40 bg-amber-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">Membre actif</span>
            </div>
            <div className="relative mt-7"><div className="flex items-center justify-between text-xs text-white/55"><span>Progression ambassadeur</span><span>145 / 300</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[48%] rounded-full bg-gradient-to-r from-emerald-300 to-amber-200" /></div></div>
            <p className="relative mt-3 text-sm text-white/55">Encore 155 points pour débloquer les avantages ambassadeur.</p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
            <p className="text-sm text-white/60">Votre parcours</p>
            <h2 className="mt-2 text-xl font-semibold">Adhérent → Ambassadeur</h2>
            <div className="mt-6 space-y-4"><div className="flex items-center gap-3 text-sm"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-300 text-[#032017]">✓</span><span>Adhérent</span></div><div className="ml-3 h-4 border-l border-dashed border-emerald-300/40" /><div className="flex items-center gap-3 text-sm text-white/45"><span className="grid h-7 w-7 place-items-center rounded-full border border-white/20">3</span><span>Participant</span></div><div className="ml-3 h-4 border-l border-dashed border-white/20" /><div className="flex items-center gap-3 text-sm text-white/45"><span className="grid h-7 w-7 place-items-center rounded-full border border-white/20">6</span><span>Ambassadeur</span></div></div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Catalogue</p><h2 className="mt-2 text-2xl font-semibold">Échanger vos points</h2></div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">{rewards.map((reward) => (<article key={reward.title} className="rounded-2xl border border-white/10 bg-black/10 p-5 transition hover:-translate-y-1 hover:border-emerald-300/40"><span className="text-2xl text-amber-200">{reward.icon}</span><h3 className="mt-4 font-semibold">{reward.title}</h3><p className="mt-1 text-sm text-white/50">{reward.detail}</p><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-emerald-200">{reward.cost} pts</span><button type="button" onClick={() => handleRedeem(reward.title, reward.cost)} className="rounded-full border border-emerald-300/35 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-300/10">Utiliser</button></div></article>))}</div>
          {notice ? <p className="mt-5 rounded-xl border border-amber-200/25 bg-amber-200/5 px-4 py-3 text-sm text-amber-100">{notice}</p> : null}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Historique</p><h2 className="mt-2 text-2xl font-semibold">Derniers points gagnés</h2></div><Link href="/mon-compte" className="text-sm text-white/55 transition hover:text-white">Mon compte</Link></div><div className="mt-6 divide-y divide-white/10">{history.map((entry) => (<div key={`${entry.label}-${entry.date}`} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{entry.label}</p><p className="mt-1 text-xs text-white/45">{entry.date}</p></div><p className="text-sm font-semibold text-emerald-300">{entry.points} pts</p></div>))}</div></section>
      </div>
    </main>
  );
}
