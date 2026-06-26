import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Partenaires",
  description:
    "Partenaires SUNNYVIBZ : associations, entreprises, sponsors, lieux culturels et structures qui soutiennent les talents.",
};

const partnerTypes = [
  {
    title: "Associations",
    text: "Créer des passerelles, organiser des actions communes et toucher de nouveaux publics.",
  },
  {
    title: "Entreprises",
    text: "Soutenir la création locale, accueillir des événements et développer des projets culturels.",
  },
  {
    title: "Sponsors",
    text: "Financer des ateliers, mettre en avant des talents et renforcer l’impact culturel.",
  },
  {
    title: "Lieux & institutions",
    text: "Ouvrir des espaces, programmer des talents et faire vivre les rencontres SUNNYVIBZ.",
  },
] as const;

const benefits = [
  "Visibilité sur le site",
  "Mise en avant événementielle",
  "Accès aux projets créatifs",
  "Collaboration avec les talents",
  "Présence Sunny Friday",
  "Actions culturelles sur mesure",
] as const;

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Partenaires"
        title="Les structures qui font rayonner les talents avec SUNNYVIBZ."
        text="Cette rubrique présente les partenaires, sponsors, associations, entreprises et lieux qui soutiennent l’écosystème SUNNYVIBZ."
      />

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {partnerTypes.map((partner) => (
          <article
            key={partner.title}
            className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/38"
          >
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
              Partenaire
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {partner.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{partner.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2.2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-8 shadow-[0_0_50px_rgba(24,242,166,0.14)]">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
            Programme partenaire
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl">
            Devenir partenaire SUNNYVIBZ.
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70">
            Les partenaires pourront être reliés aux événements, aux talents, aux ateliers et aux
            projets mis en avant sur la plateforme. L’objectif : donner de la visibilité, créer des
            connexions et soutenir les disciplines artistiques.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex rounded-full border border-[#ffd978]/38 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978] transition hover:-translate-y-0.5"
          >
            Proposer un partenariat
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 text-sm font-semibold text-[#fbf3df]/76"
            >
              {benefit}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
