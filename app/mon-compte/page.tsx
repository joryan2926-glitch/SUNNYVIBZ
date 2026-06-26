import type { Metadata } from "next";
import { AccountDashboard } from "@/components/AccountDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mon compte",
  description:
    "Espace membre SUNNYVIBZ : réservations, profil talent, upload média, abonnement et futurs avantages.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espace membre"
        title="Votre tableau de bord SunnyVibz."
        text="L’espace membre centralise les réservations et prépare la suite : profil talent, médias, abonnements, wallet, crédits, messages et accès premium."
      />
      <AccountDashboard />
    </main>
  );
}
