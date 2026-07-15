import Link from "next/link";

const transactions = [
  { label: "Bonus de bienvenue", date: "Aujourd’hui", amount: "+ 25 crédits", tone: "text-emerald-300" },
  { label: "Réservation Creative Lab", date: "12 juin 2026", amount: "− 18 crédits", tone: "text-amber-200" },
  { label: "Recharge Sunny Credits", date: "08 juin 2026", amount: "+ 50 crédits", tone: "text-emerald-300" },
];

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Sunny Pass</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Mon portefeuille</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">Gérez vos Sunny Credits, vos recharges et vos paiements depuis un espace unique.</p>
          </div>
          <Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link>
        </div>

        <section className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
          <article className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-gradient-to-br from-emerald-400/20 via-[#0a241d] to-[#07130f] p-7 shadow-[0_0_60px_rgba(16,185,129,0.12)]">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/15 blur-3xl" />
            <p className="text-sm text-white/60">Solde disponible</p>
            <p className="mt-4 text-5xl font-semibold tracking-tight">57 <span className="text-xl text-emerald-200">crédits</span></p>
            <p className="mt-3 text-sm text-white/55">Utilisables pour les ateliers, espaces et événements SunnyVibz.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200">Recharger</button>
              <button type="button" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-emerald-300/60">Voir les tarifs</button>
            </div>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
            <p className="text-sm text-white/60">Paiements</p>
            <h2 className="mt-2 text-xl font-semibold">Une recharge, zéro friction.</h2>
            <p className="mt-3 text-sm leading-6 text-white/55">Le paiement en ligne sera activé avec Stripe. En attendant, votre historique et vos demandes restent centralisés ici.</p>
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-300/30 bg-emerald-300/5 p-4 text-sm text-emerald-100">Paiement sécurisé bientôt disponible</div>
          </article>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Historique</p><h2 className="mt-2 text-2xl font-semibold">Dernières opérations</h2></div>
            <button type="button" className="text-sm text-white/55 transition hover:text-white">Tout voir</button>
          </div>
          <div className="mt-6 divide-y divide-white/10">
            {transactions.map((transaction) => (
              <div key={`${transaction.label}-${transaction.date}`} className="flex items-center justify-between gap-4 py-4">
                <div><p className="font-medium">{transaction.label}</p><p className="mt-1 text-xs text-white/45">{transaction.date}</p></div>
                <p className={`text-sm font-semibold ${transaction.tone}`}>{transaction.amount}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
