import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { getSubscriptions } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Abonnements",
  description:
    "Abonnements SUNNYVIBZ : Essentielle, Créative, Premium et Annuelle pour accéder au lieu, réserver, pratiquer et profiter d’avantages culturels.",
};

const subscriptionRules = [
  "Réservation obligatoire pour réguler les créneaux et préserver la qualité de chaque expérience.",
  "Contrôle des capacités en temps réel : ateliers disponibles, complets et places restantes visibles.",
  "Tarifs préférentiels sur les ateliers selon la formule.",
  "Accès prioritaire pour Créative et Premium quand la demande est forte.",
] as const;

const comparisonRows = [
  ["Essentielle", "39 € / mois", "3 mois", "Heures creuses", "Découverte du lieu"],
  ["Créative", "65 € / mois", "3 mois", "Accès régulier", "Offre principale"],
  ["Premium", "85 € / mois", "3 mois", "Accès élargi", "Priorité forte"],
  ["Annuelle", "720 € / an", "12 mois", "Accès global", "Réduction tarifaire"],
] as const;

export const revalidate = 60;

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions(4);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Pass SunnyVibz"
        title="Des formules pour passer de la curiosité à une vraie pratique culturelle."
        text="L’abonnement n’est pas seulement un accès. C’est une manière d’installer une présence régulière : venir créer, profiter du Sunilounge, réserver plus facilement, participer aux ateliers et rester connecté à la communauté."
      />

      <div className="grid gap-5 lg:grid-cols-4">
        {subscriptions.map((subscription) => (
          <SubscriptionCard subscription={subscription} key={subscription.id} />
        ))}
      </div>

      <section className="mt-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className="rounded-[2rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-7 shadow-[0_0_48px_rgba(24,242,166,0.14)]">
          <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
            Fonctionnement
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
            Un pass créatif global, mais toujours maîtrisé.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">
            L’abonnement doit rester simple à comprendre : plus on s’implique, plus on gagne en
            accès, en priorité et en avantages. Pour garder une expérience confortable, chaque
            atelier reste soumis à réservation, capacité maximum et priorité selon la formule choisie.
          </p>
          <ul className="mt-6 grid gap-3">
            {subscriptionRules.map((rule) => (
              <li
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df]/74"
              >
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-x-auto rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-5 border-b border-white/10 bg-black/25 px-4 py-3 text-[0.62rem] font-black uppercase tracking-[0.13em] text-[#ffd978]">
              <span>Formule</span>
              <span>Prix</span>
              <span>Engagement</span>
              <span>Accès</span>
              <span>Objectif</span>
            </div>
            {comparisonRows.map((row) => (
              <div
                key={row[0]}
                className="grid grid-cols-5 gap-2 border-b border-white/8 px-4 py-4 text-sm text-[#fbf3df]/72 last:border-b-0"
              >
                {row.map((cell) => (
                  <span key={cell} className={cell === "Offre principale" ? "text-[#18f2a6]" : ""}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
