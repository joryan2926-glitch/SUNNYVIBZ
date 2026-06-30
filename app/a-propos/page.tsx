import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez SUNNYVIBZ : un lieu, une communauté et une plateforme pour créer, exposer, apprendre, vendre et connecter les talents culturels.",
};

const missionPillars = [
  {
    title: "Révéler",
    text: "Donner aux talents une présence claire : profil, médias, événements, prestations, market et rencontres.",
  },
  {
    title: "Transmettre",
    text: "Créer des ateliers accessibles où l’on apprend, expérimente, partage et repart avec quelque chose de concret.",
  },
  {
    title: "Connecter",
    text: "Faire se rencontrer talents, publics, associations, entreprises, bénévoles, sponsors et lieux culturels.",
  },
  {
    title: "Faire vivre",
    text: "Transformer la culture en moments réguliers : Sunny Friday, expositions, scènes ouvertes, ateliers et projets.",
  },
] as const;

const toneRules = [
  "Parler simplement, avec chaleur, précision et ambition.",
  "Raconter les bénéfices avant de détailler les fonctionnalités.",
  "Mettre les personnes, les disciplines et les parcours avant les modules.",
  "Assumer une image premium sans perdre l’accessibilité du terrain.",
] as const;

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="À propos"
        title="SunnyVibz est un écosystème Art & Culture pour faire émerger les talents."
        text="Le projet réunit un lieu, une communauté et une plateforme : on y vient pour apprendre, montrer son travail, rencontrer un public, vendre une création ou construire un projet culturel."
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-8 leading-8 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p>
            SUNNYVIBZ, c’est l’art, la culture et la vibz réunis dans un même mouvement. Le projet
            veut créer un cadre où les créateurs ne restent pas invisibles : ils peuvent pratiquer,
            exposer, documenter leur univers, proposer des services et rencontrer les bonnes personnes.
          </p>
          <p className="mt-5">
            La plateforme numérique prolonge le lieu : ateliers, Sunny Friday, profils talents,
            market, abonnements, partenaires et articles. Chaque page doit aider quelqu’un à passer
            à l’action : réserver, rejoindre, exposer, acheter, soutenir ou proposer une idée.
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
          title="Premium dans l’image, humain dans le ton, concret dans les actions."
          text="La marque doit donner envie, mais surtout faire comprendre. La promesse est simple : créer plus de visibilité, plus de rencontres et plus d’opportunités pour la culture locale."
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
