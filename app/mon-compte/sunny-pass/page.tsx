import type { Metadata } from "next";
import { AccountModuleShell } from "@/components/AccountModuleShell";

export const metadata: Metadata = {
  title: "SUNNY PASS",
  description: "SUNNY PASS numérique : carte membre, QR Code, statut, rôles et accès SunnyVibz.",
};

const items = [
  "Carte membre numérique visible depuis le tableau de bord.",
  "QR Code MVP associé au numéro membre et à l’email du compte.",
  "Affichage des rôles, de la formule active et du statut talent.",
  "Prochaine étape : écran de vérification staff et vrai historique d’accès.",
] as const;

export default function SunnyPassPage() {
  return (
    <AccountModuleShell
      eyebrow="SUNNY PASS"
      items={items}
      text="Le SUNNY PASS est la base de l’adhésion numérique : il doit permettre de reconnaître un membre, vérifier son statut et fluidifier l’accès aux ateliers, événements et espaces."
      title="Votre carte membre numérique SunnyVibz."
    />
  );
}
