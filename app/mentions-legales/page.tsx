import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site SunnyVibz.",
};

const sections = [
  {
    title: "Éditeur du site",
    text: "Le site sunnyvibz.fr est édité par SUNNYVIBZ, association ou structure porteuse du projet Art & Culture. Les informations administratives définitives doivent être complétées : adresse, représentant légal, numéro RNA/SIRET si applicable et email officiel.",
  },
  {
    title: "Responsable de publication",
    text: "Le responsable de publication est le représentant légal de SUNNYVIBZ. Cette information doit être confirmée avant lancement public complet.",
  },
  {
    title: "Hébergement",
    text: "Le site est hébergé par Vercel. Les données applicatives peuvent être stockées via Supabase selon les modules activés.",
  },
  {
    title: "Propriété intellectuelle",
    text: "Les textes, visuels, logos, créations, photographies et éléments graphiques présentés sur le site restent la propriété de SUNNYVIBZ ou de leurs auteurs respectifs. Toute reproduction doit être autorisée.",
  },
  {
    title: "Contact",
    text: "Pour toute demande liée au site, aux contenus ou aux droits, utiliser la page Contact. Une adresse email officielle devra être ajoutée ici.",
  },
] as const;

const officialInfo = [
  "Nom juridique exact de la structure",
  "Adresse officielle",
  "Représentant légal",
  "Email officiel de contact",
  "Numéro RNA, SIRET ou équivalent si applicable",
] as const;

export default function LegalNoticePage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Cadre légal"
        title="Mentions légales."
        text="Cette page pose la base légale du site. Les informations administratives exactes devront être complétées avant une communication publique massive."
      />

      <section className="grid gap-5">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">{section.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          Informations officielles à fournir
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {officialInfo.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df]/70">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
