import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Comprendre la logique SunnyVibz : découvrir, réserver, adhérer, participer, exposer, vendre et faire vivre la communauté Art & Culture.",
};

const steps = [
  {
    title: "Découvrir",
    text: "Le visiteur comprend l’univers SunnyVibz : ateliers, talents, Sunny Friday, market, abonnements et communauté.",
    href: "/a-propos",
  },
  {
    title: "Réserver",
    text: "Les ateliers affichent la date, le lieu, la capacité, les places restantes, le statut et les tarifs selon abonnement.",
    href: "/ateliers",
  },
  {
    title: "Adhérer",
    text: "Les formules Essentielle, Créative, Premium et Annuelle structurent l’accès aux espaces et aux avantages.",
    href: "/abonnements",
  },
  {
    title: "Participer",
    text: "Le membre rejoint des ateliers, événements, scènes ouvertes, rencontres et temps forts de la communauté.",
    href: "/agenda",
  },
  {
    title: "Être visible",
    text: "Les talents disposent d’une vitrine vivante : profil, médias, discipline, liens, événements et futures offres.",
    href: "/talents",
  },
  {
    title: "Vendre et soutenir",
    text: "Le Market prépare la vente de créations, prestations, services, stands et commandes liées aux talents.",
    href: "/marketplace",
  },
] as const;

const priorities = [
  {
    title: "Fondation",
    text: "Supabase, pages, formulaires, réservations, abonnements, compte membre et contenu fiable.",
  },
  {
    title: "Économie",
    text: "Paiements, abonnements actifs, ateliers payants, stands Sunny Friday et premières offres Market.",
  },
  {
    title: "Communauté",
    text: "Profils talents enrichis, médias, modération, interactions, groupes, messages et projets collaboratifs.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Logique SunnyVibz"
        title="Un parcours simple pour transformer une visite en engagement culturel."
        text="SunnyVibz doit avancer comme une plateforme complète : attirer, expliquer, réserver, faire adhérer, rendre visible, vendre et fidéliser."
      />

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Link
            key={step.title}
            href={step.href}
            className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/38"
          >
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">
              Étape {index + 1}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {step.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{step.text}</p>
          </Link>
        ))}
      </section>

      <section className="mt-16 rounded-[2.4rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-7 shadow-[0_0_50px_rgba(24,242,166,0.14)] sm:p-10">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Construction progressive
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-5xl">
          Solide d’abord, spectaculaire ensuite.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#fbf3df]/70">
          La bonne logique n’est pas d’ajouter tous les modules en même temps. Il faut d’abord
          fiabiliser les réservations, les données, les abonnements et les contenus, puis connecter
          l’économie, puis ouvrir les fonctions communautaires.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {priorities.map((priority) => (
            <article
              key={priority.title}
              className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5"
            >
              <h3 className="text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
                {priority.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#fbf3df]/62">{priority.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
