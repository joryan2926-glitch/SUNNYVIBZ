import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkshopCard } from "@/components/WorkshopCard";
import { getWorkshops } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Ateliers",
  description:
    "Réservez un atelier SUNNYVIBZ : apprendre, pratiquer, rencontrer, expérimenter et repartir avec une création ou une compétence concrète.",
};

export const revalidate = 60;

const workshopBenefits = [
  "Réservation obligatoire pour garantir un cadre confortable.",
  "Places restantes visibles et statut disponible ou complet.",
  "Tarifs préférentiels selon la formule SunnyVibz.",
  "Priorité pour les membres Créative et Premium.",
] as const;

export default async function WorkshopsPage() {
  const workshops = await getWorkshops(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Ateliers"
        title="Réservez un moment pour apprendre, pratiquer et rencontrer."
        text="Chaque atelier doit donner envie et rassurer : ce qu’on va faire, où ça se passe, combien ça coûte, combien de places restent et quels avantages existent selon l’abonnement."
      />

      <section className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {workshopBenefits.map((benefit) => (
          <div
            key={benefit}
            className="rounded-3xl border border-[#ffd978]/16 bg-white/[0.045] p-5 text-sm font-semibold leading-7 text-[#fbf3df]/74"
          >
            {benefit}
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <WorkshopCard workshop={workshop} key={workshop.id} />
        ))}
      </div>
    </main>
  );
}
