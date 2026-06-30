import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Comprendre le parcours SunnyVibz : découvrir, réserver, adhérer, participer, être visible, vendre et construire des projets culturels.",
};

const steps = [
  {
    title: "Découvrir",
    text: "Le visiteur comprend rapidement l’univers : lieu culturel, ateliers, talents, Sunny Friday, market, abonnements et communauté.",
    href: "/a-propos",
  },
  {
    title: "Réserver",
    text: "Les ateliers affichent ce qu’on apprend, la date, le lieu, les places restantes, le statut et les tarifs selon abonnement.",
    href: "/ateliers",
  },
  {
    title: "Adhérer",
    text: "Les formules Essentielle, Créative, Premium et Annuelle donnent un cadre clair pour accéder au lieu et aux avantages.",
    href: "/abonnements",
  },
  {
    title: "Participer",
    text: "Le membre rejoint des ateliers, événements, scènes ouvertes, expositions, temps forts et rencontres de la communauté.",
    href: "/agenda",
  },
  {
    title: "Être visible",
    text: "Les talents disposent d’une vitrine vivante : profil, discipline, photos, vidéos, liens, événements, services et projets.",
    href: "/talents",
  },
  {
    title: "Vendre et soutenir",
    text: "Le Market prépare la vente de créations, prestations, services, stands exposants, commandes et soutiens liés aux talents.",
    href: "/marketplace",
  },
] as const;

const priorities = [
  {
    title: "Fondation",
    text: "Pages claires, données Supabase, formulaires, réservations, abonnements, compte membre et contenus fiables.",
  },
  {
    title: "Économie",
    text: "Paiements, abonnements actifs, ateliers payants, stands Sunny Friday, premières offres Market et suivi des commandes.",
  },
  {
    title: "Communauté",
    text: "Profils talents enrichis, médias, modération, interactions, groupes, messages, projets et collaborations.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Logique SunnyVibz"
        title="Un parcours simple pour transformer une visite en engagement culturel."
        text="La logique SunnyVibz est progressive : donner envie, expliquer clairement, permettre de réserver, faire adhérer, rendre visible, vendre puis fidéliser."
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
          Solide d’abord, immersif ensuite.
        </h2>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-[#fbf3df]/70">
          La bonne logique n’est pas d’empiler des modules. Il faut d’abord fiabiliser les parcours
          essentiels, puis connecter l’économie du projet, puis ouvrir les fonctions communautaires
          qui donneront au site son effet réseau.
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
