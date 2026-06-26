import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion et inscription SUNNYVIBZ avec Supabase Auth.",
};

export default function ConnexionPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <SectionHeading
        eyebrow="Connexion"
        title="Votre accès SUNNYVIBZ."
        text="Inscrivez-vous ou connectez-vous pour retrouver vos réservations et préparer les futurs accès membre, artiste, partenaire et premium."
      />
      <AuthPanel />
    </main>
  );
}
