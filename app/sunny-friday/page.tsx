import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { SunnyFridayApplicationForm } from "@/components/SunnyFridayApplicationForm";

export const metadata: Metadata = {
  title: "Sunny Friday",
  description:
    "Sunny Friday SUNNYVIBZ : rendez-vous des créateurs, exposants, curieux, partenaires, stands, performances et marché culturel.",
};

const exhibitorSteps = [
  ["Candidater", "Présenter son univers, ses créations, ses prestations ou son projet."],
  ["Réserver un stand", "Choisir une formule exposant et préparer sa présence Sunny Friday."],
  ["Être visible", "Relier son stand au profil talent, au Market, aux réseaux et au QR exposant."],
  ["Rencontrer", "Vendre, tester, échanger, créer des contacts et rejoindre la communauté."],
] as const;

const standOffers = [
  {
    title: "Stand découverte",
    price: "À partir de 15 €",
    text: "Idéal pour tester une première présence, présenter quelques créations et rencontrer le public.",
  },
  {
    title: "Stand créateur",
    price: "À partir de 35 €",
    text: "Pour exposer, vendre, capter des contacts et connecter son espace au Market SUNNYVIBZ.",
  },
  {
    title: "Stand premium",
    price: "Sur sélection",
    text: "Mise en avant renforcée, emplacement prioritaire, interview courte et visibilité social media.",
  },
] as const;

export default function SunnyFridayPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,217,120,0.18),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(24,242,166,0.18),transparent_34rem)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Sunny Friday"
            title="Le rendez-vous où les créateurs rencontrent leur public."
            text="Sunny Friday, c’est le marché culturel SUNNYVIBZ : stands, ventes, performances, musique, rencontres, QR exposant et passerelle directe vers le Market."
          />

          <div className="premium-card rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] p-7 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-9">
            <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#18f2a6]">
              Exposants
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl">
              Un parcours simple : candidater, exposer, vendre, se connecter.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70">
              Chaque exposant doit pouvoir être visible avant, pendant et après l’événement :
              candidature, stand, profil talent, QR exposant, offre Market et contact public.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
              >
                Candidater exposant
              </Link>
              <Link
                href="/marketplace"
                className="rounded-full border border-[#ffd978]/36 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]"
              >
                Voir le Market
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {exhibitorSteps.map(([title, text], index) => (
            <article
              key={title}
              className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">
                0{index + 1}
              </span>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Stands"
          title="Des formules exposants prêtes à connecter."
          text="Ces offres structurent le modèle économique Sunny Friday : tester, vendre, être visible et créer des contacts."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {standOffers.map((offer) => (
            <article
              key={offer.title}
              className="rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6 shadow-2xl shadow-black/30"
            >
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {offer.title}
              </h2>
              <p className="mt-2 text-xl font-semibold text-[#ffd978]">{offer.price}</p>
              <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">{offer.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <SectionHeading
          eyebrow="Candidature"
          title="Préparer l’espace exposant."
          text="Le formulaire capte les candidatures. L’étape suivante sera la sélection, le paiement du stand, le QR exposant et le plan interactif."
        />
        <SunnyFridayApplicationForm />
      </section>
    </main>
  );
}
