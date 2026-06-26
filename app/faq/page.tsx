import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions fréquentes SUNNYVIBZ : ateliers, talents, Sunny Friday, market, abonnements, partenaires et réservations.",
};

const faqs = [
  {
    question: "C’est quoi SunnyVibz ?",
    answer:
      "SunnyVibz est une plateforme Art & Culture qui révèle les talents, organise des ateliers, crée des événements et prépare un market pour soutenir la création locale.",
  },
  {
    question: "Qui peut rejoindre SunnyVibz ?",
    answer:
      "Les curieux, talents, artistes, photographes, musiciens, associations, partenaires, entreprises, exposants, bénévoles et toutes les personnes qui veulent faire vivre un projet culturel.",
  },
  {
    question: "Comment réserver un atelier ?",
    answer:
      "La page Ateliers affiche les dates, lieux, prix, places restantes et statuts. Il suffit d’ouvrir une fiche atelier et d’utiliser le formulaire de réservation.",
  },
  {
    question: "Comment exposer au Sunny Friday ?",
    answer:
      "La page Sunny Friday propose un formulaire de candidature exposant. L’équipe pourra ensuite valider le stand, préparer le QR exposant et connecter l’offre au Market.",
  },
  {
    question: "À quoi sert le Market ?",
    answer:
      "Le Market permettra d’acheter des créations, réserver des prestations, commander des services artistiques et soutenir directement les talents de la communauté.",
  },
  {
    question: "À quoi servent les abonnements ?",
    answer:
      "Les abonnements SunnyVibz structurent l’accès aux espaces créatifs : Essentielle à 39 €/mois, Créative à 65 €/mois, Premium à 85 €/mois et Annuelle à 720 €/an. Créative est l’offre principale avec Creative Lab, Sunilounge, -20% ateliers et réservation prioritaire.",
  },
  {
    question: "Les ateliers sont-ils inclus dans l’abonnement ?",
    answer:
      "Les ateliers restent soumis à réservation et capacité. Selon la formule, l’abonné bénéficie de tarifs préférentiels, d’un accès prioritaire ou d’avantages exclusifs. Les places restantes sont affichées sur chaque fiche atelier.",
  },
] as const;

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Les questions qui reviennent naturellement."
        text="Une réponse claire vaut mieux qu’un long discours. Cette page aide les visiteurs à comprendre rapidement comment entrer dans l’écosystème SUNNYVIBZ."
      />

      <section className="grid gap-5 md:grid-cols-2">
        {faqs.map((faq) => (
          <article
            key={faq.question}
            className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {faq.question}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">{faq.answer}</p>
          </article>
        ))}
      </section>

      <div className="mt-12 rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-7 text-center">
        <h2 className="text-3xl font-medium tracking-[-0.045em] text-[#fbf3df]">
          Vous avez une autre question ?
        </h2>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full border border-[#ffd978]/38 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]"
        >
          Contacter SunnyVibz
        </Link>
      </div>
    </main>
  );
}
