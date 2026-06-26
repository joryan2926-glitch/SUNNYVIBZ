import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkshopCard } from "@/components/WorkshopCard";
import { getWorkshops } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Ateliers",
  description:
    "Réservez un atelier SUNNYVIBZ : apprendre, expérimenter, créer et repartir avec une expérience artistique concrète.",
};

export const revalidate = 60;

const workshopBenefits = [
  "Réservation obligatoire pour garantir une bonne expérience.",
  "Places restantes visibles et statut disponible/complet.",
  "Tarifs préférentiels selon la formule SunnyVibz.",
  "Accès prioritaire pour les formules Créative et Premium.",
] as const;

export default async function WorkshopsPage() {
  const workshops = await getWorkshops(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Ateliers"
        title="Réservez une expérience créative, pas juste une place."
        text="Chaque atelier indique la date, le lieu, la capacité, les places restantes, le statut disponible/complet et les tarifs selon abonnement. La réservation permet de réguler les flux et de préserver la qualité du moment."
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
