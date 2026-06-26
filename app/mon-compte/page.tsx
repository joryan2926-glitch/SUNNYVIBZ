import type { Metadata } from "next";
import { AccountDashboard } from "@/components/AccountDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mon compte",
  description: "Espace membre SUNNYVIBZ : réservations, profil, abonnement et avantages.",
};

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Espace membre"
        title="Votre dashboard SUNNYVIBZ."
        text="Une personne connectée peut consulter ses réservations. Les prochains modules pourront accueillir abonnements, wallet, crédits et messages."
      />
      <AccountDashboard />
    </main>
  );
}
