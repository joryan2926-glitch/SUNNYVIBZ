import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Découvrez SUNNYVIBZ, association Art & Culture dédiée aux talents, aux partenaires, aux ateliers, aux expositions et aux événements culturels.",
};

const values = [
  "Créer des passerelles entre talents, publics et partenaires.",
  "Rendre la culture accessible, vivante et visible.",
  "Accompagner les talents avec une plateforme moderne et évolutive.",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="À propos"
        title="SUNNYVIBZ, une vibz artistique au service de la communauté."
        text="L’association rassemble création, transmission, exposition et événements pour faire émerger des talents et créer des moments culturels mémorables."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-8 leading-8 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p>
            SUNNYVIBZ est pensée comme un lieu et une plateforme : un espace où l’on peut découvrir
            des talents, participer à des ateliers, venir à des événements, exposer, échanger et
            rejoindre une communauté créative.
          </p>
          <p className="mt-5">
            Le site construit ici pose les fondations numériques : pages publiques, agenda,
            galerie, profils talents, partenaires, contact et connexion Supabase pour gérer les contenus.
          </p>
        </article>

        <aside className="grid gap-4">
          {values.map((value, index) => (
            <div
              key={value}
              className="rounded-3xl border border-[#18f2a6]/18 bg-[#18f2a6]/8 p-6"
            >
              <span className="text-sm font-black uppercase tracking-[0.2em] text-[#ffd978]">
                0{index + 1}
              </span>
              <p className="mt-3 leading-7 text-[#fbf3df]/76">{value}</p>
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
