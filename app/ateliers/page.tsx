import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { WorkshopCard } from "@/components/WorkshopCard";
import { getWorkshops } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Ateliers",
  description:
    "Ateliers SUNNYVIBZ : peinture, photo, scène ouverte, création, places disponibles et réservation en ligne.",
};

export const revalidate = 60;

export default async function WorkshopsPage() {
  const workshops = await getWorkshops(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Ateliers"
        title="Créer, apprendre et réserver sa place."
        text="Chaque atelier affiche sa date, son lieu, son prix, son nombre de places et son statut disponible ou complet."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <WorkshopCard workshop={workshop} key={workshop.id} />
        ))}
      </div>
    </main>
  );
}
