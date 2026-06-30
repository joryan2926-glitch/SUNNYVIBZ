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
      "SunnyVibz est un écosystème Art & Culture : un lieu, une communauté et une plateforme pour apprendre, créer, exposer, vendre, rencontrer et soutenir les talents locaux.",
  },
  {
    question: "Qui peut rejoindre SunnyVibz ?",
    answer:
      "Les curieux, artistes, photographes, peintres, sculpteurs, musiciens, vidéastes, associations, partenaires, entreprises, exposants, bénévoles et toutes les personnes qui veulent faire vivre la culture.",
  },
  {
    question: "Comment réserver un atelier ?",
    answer:
      "La page Ateliers affiche la date, le lieu, le prix, la capacité, les places restantes et le statut disponible ou complet. Il suffit d’ouvrir une fiche atelier et d’envoyer la réservation.",
  },
  {
    question: "Comment exposer au Sunny Friday ?",
    answer:
      "La page Sunny Friday explique le parcours exposant. Le créateur peut candidater, présenter son univers, préparer son stand, être relié à un profil talent et, à terme, connecter son offre au Market.",
  },
  {
    question: "À quoi sert le Market ?",
    answer:
      "Le Market doit permettre d’acheter des créations, réserver des prestations, commander des services artistiques, soutenir des projets et donner une dimension économique aux talents mis en avant.",
  },
  {
    question: "À quoi servent les abonnements ?",
    answer:
      "Les abonnements structurent l’accès au lieu et aux avantages : Essentielle à 39 €/mois, Créative à 65 €/mois, Premium à 85 €/mois et Annuelle à 720 €/an. Créative reste l’offre principale pour pratiquer régulièrement.",
  },
  {
    question: "Les ateliers sont-ils inclus dans l’abonnement ?",
    answer:
      "Chaque atelier reste soumis à réservation et capacité. Selon la formule, le membre peut bénéficier de tarifs préférentiels, d’un accès prioritaire ou d’avantages exclusifs. Les places restantes restent visibles.",
  },
  {
    question: "Un talent peut-il publier des photos et vidéos ?",
    answer:
      "Oui, c’est la logique prévue : chaque profil talent doit devenir une vitrine vivante avec portfolio, photos, vidéos, événements, services, liens sociaux et futures offres Market.",
  },
] as const;

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Les réponses simples pour entrer dans l’écosystème."
        text="Cette page doit aider un visiteur à comprendre vite où il se situe : curieux, membre, talent, exposant, partenaire ou futur soutien."
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
