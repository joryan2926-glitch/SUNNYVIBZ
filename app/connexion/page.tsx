import type { Metadata } from "next";
import { AuthPanel } from "@/components/AuthPanel";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connexion et inscription SUNNYVIBZ : espace membre, réservations, profil talent, médias et futurs avantages.",
};

export default function ConnexionPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <SectionHeading
        eyebrow="Connexion"
        title="Votre accès à l’écosystème SunnyVibz."
        text="Connectez-vous pour retrouver vos réservations, préparer votre profil talent, ajouter des médias et accéder progressivement aux futurs modules : abonnements, wallet, messages, crédits et avantages."
      />
      <AuthPanel />
    </main>
  );
}
