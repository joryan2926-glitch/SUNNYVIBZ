import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SpaceCard } from "@/components/SpaceCard";
import { getSpaces } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Espaces",
  description:
    "Réservez un espace SUNNYVIBZ : Creative Lab, Sunilounge, Maison Créative et espaces culturels pour ateliers, événements et projets.",
};

export const revalidate = 60;

const spaceBenefits = [
  "Espaces adaptés aux ateliers, réunions, répétitions, expositions et projets.",
  "Demande obligatoire pour contrôler les créneaux, capacités et usages.",
  "Priorité possible pour les membres Créative, Premium et projets accompagnés.",
  "Confirmation après validation par l’équipe SUNNYVIBZ.",
] as const;

export default async function SpacesPage() {
  const spaces = await getSpaces(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espaces"
        title="Réservez le bon espace pour créer, réunir, exposer ou transmettre."
        text="Les espaces SUNNYVIBZ structurent la vie du lieu : Creative Lab, Sunilounge, Maison Créative et formats modulables pour faire avancer les projets culturels."
      />

      <section className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {spaceBenefits.map((benefit) => (
          <div
            key={benefit}
            className="rounded-3xl border border-[#ffd978]/16 bg-white/[0.045] p-5 text-sm font-semibold leading-7 text-[#fbf3df]/74"
          >
            {benefit}
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </div>
    </main>
  );
}
