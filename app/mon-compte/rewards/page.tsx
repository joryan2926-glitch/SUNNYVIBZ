import type { Metadata } from "next";
import { AccountModuleShell } from "@/components/AccountModuleShell";

export const metadata: Metadata = {
  title: "SUNNY Rewards",
  description: "SUNNY Rewards : points, avantages, statuts, participation et fidélité SunnyVibz.",
};

const items = [
  "Récompenser les réservations, participations, achats Market et actions bénévoles.",
  "Prévoir des statuts progressifs : membre actif, créateur, ambassadeur.",
  "Relier les avantages aux abonnements, ateliers et événements.",
  "Prochaine étape : règles de points, historique et badges visibles.",
] as const;

export default function RewardsPage() {
  return (
    <AccountModuleShell
      eyebrow="SUNNY Rewards"
      items={items}
      text="SUNNY Rewards donne une logique de fidélisation : plus un membre participe, crée, soutient ou partage, plus son parcours devient visible."
      title="Valoriser l’engagement des membres."
    />
  );
}
