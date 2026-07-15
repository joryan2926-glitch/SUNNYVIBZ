import type { Metadata } from "next";
import { AccountModuleShell } from "@/components/AccountModuleShell";

export const metadata: Metadata = {
  title: "Messages",
  description: "Messagerie SUNNYVIBZ : échanges membres, artistes, partenaires et administration.",
};

const items = [
  "Centraliser les échanges entre membre, équipe SunnyVibz, talents et partenaires.",
  "Préparer les conversations liées aux réservations, services Market et projets.",
  "Conserver une structure simple avant la messagerie temps réel.",
  "Prochaine étape : table messages, notifications et conversations par contexte.",
] as const;

export default function MessagesPage() {
  return (
    <AccountModuleShell
      eyebrow="Messages"
      items={items}
      text="La messagerie doit devenir le fil de discussion utile de l’écosystème : réservation, projet, partenariat, service et suivi administratif."
      title="Préparer la messagerie SunnyVibz."
    />
  );
}
