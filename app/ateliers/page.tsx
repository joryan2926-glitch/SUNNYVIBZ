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
  "Aucun niveau requis : venez avec votre curiosité.",
  "Une ambiance bienveillante, créative et premium.",
  "Des formats pour apprendre, tester, rencontrer et repartir avec du concret.",
  "Des ateliers reliés aux talents, au Market et aux événements SUNNYVIBZ.",
] as const;

export default async function WorkshopsPage() {
  const workshops = await getWorkshops(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Ateliers"
        title="Réservez une expérience créative, pas juste une place."
        text="Les ateliers SUNNYVIBZ sont pensés pour apprendre, rencontrer et créer dans une ambiance chaleureuse. Chaque session indique la date, le lieu, le prix, les places restantes et le statut disponible ou complet."
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
