import type { Metadata } from "next";
import { AccountDashboard } from "@/components/AccountDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mon compte",
  description:
    "Espace membre SUNNYVIBZ : abonnement actuel, réservations d’ateliers, statut utilisateur et profil artiste.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espace membre"
        title="Votre tableau de bord SunnyVibz."
        text="Retrouvez votre abonnement actuel, vos réservations d’ateliers, votre statut utilisateur et l’état de votre profil artiste si vous êtes concerné."
      />
      <AccountDashboard />
    </main>
  );
}
