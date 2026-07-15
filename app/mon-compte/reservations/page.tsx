import type { Metadata } from "next";
import { AccountReservationsDashboard } from "@/components/AccountReservationsDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mes réservations",
  description: "Réservations SUNNYVIBZ : ateliers, espaces, événements et historique membre.",
};

export default function AccountReservationsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Réservations"
        title="Suivre vos demandes et prochaines participations."
        text="Retrouvez au même endroit vos ateliers et vos demandes d’espaces, avec leur statut, leur date et les avantages liés à votre formule SunnyVibz."
      />
      <AccountReservationsDashboard />
    </main>
  );
}