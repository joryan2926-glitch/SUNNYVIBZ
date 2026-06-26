import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez la mission SUNNYVIBZ : révéler les talents, créer des rencontres culturelles et transformer l’énergie locale en expériences.",
};

const missionPillars = [
  {
    title: "Révéler",
    text: "Donner une vraie visibilité aux talents : portfolio, événements, market, contenus et rencontres.",
  },
  {
    title: "Transmettre",
    text: "Créer des ateliers accessibles où l’on apprend, expérimente et repart avec une expérience concrète.",
  },
  {
    title: "Connecter",
    text: "Faire se rencontrer talents, publics, partenaires, associations, entreprises et lieux culturels.",
  },
  {
    title: "Faire vivre",
    text: "Transformer la culture en moments : Sunny Friday, expositions, scènes ouvertes, marchés et projets.",
  },
] as const;

const toneRules = [
  "Parler simplement, avec chaleur et précision.",
  "Montrer les bénéfices avant les fonctionnalités.",
  "Valoriser les personnes avant les modules.",
  "Garder une esthétique premium, mais une énergie accessible.",
] as const;

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="À propos"
        title="SunnyVibz révèle les talents et crée des rencontres culturelles."
        text="SunnyVibz est né d’une envie simple : offrir aux créateurs un lieu, une visibilité et une communauté pour créer, exposer, transmettre et vivre leur passion."
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-8 leading-8 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p>
            SUNNYVIBZ, c’est l’art, la culture et la vibz réunis dans un même mouvement. Un espace
            pour apprendre, vendre, exposer, rencontrer, réserver, collaborer et faire grandir des
            projets artistiques avec une vraie énergie collective.
          </p>
          <p className="mt-5">
            La plateforme numérique prolonge cette vision : ateliers, Sunny Friday, talents, market,
            abonnements, partenaires et contenus. Chaque page doit aider quelqu’un à passer à
            l’action : réserver, rejoindre, exposer, soutenir ou proposer un projet.
          </p>
          <Link
            href="/abonnements"
            className="mt-7 inline-flex rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
          >
            Rejoindre le mouvement
          </Link>
        </article>

        <aside className="grid gap-4">
          {missionPillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-[#18f2a6]/18 bg-[#18f2a6]/8 p-6"
            >
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[#ffd978]">
                0{index + 1}
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#fbf3df]/70">{pillar.text}</p>
            </div>
          ))}
        </aside>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <SectionHeading
          eyebrow="Voix de marque"
          title="Premium dans l’image, humain dans le ton."
          text="SunnyVibz doit donner envie sans perdre les gens. La promesse est claire : créer plus de visibilité, plus de rencontres et plus d’opportunités pour la culture locale."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {toneRules.map((rule) => (
            <div
              key={rule}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-sm font-semibold leading-7 text-[#fbf3df]/76"
            >
              {rule}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
