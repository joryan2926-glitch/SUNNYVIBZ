import type { Metadata } from "next";
import { AccountModuleShell } from "@/components/AccountModuleShell";

export const metadata: Metadata = {
  title: "Mes réservations",
  description: "Réservations SUNNYVIBZ : ateliers, espaces, événements et historique membre.",
};

const items = [
  "Les réservations d’ateliers sont déjà reliées au tableau de bord.",
  "Le système contrôle les capacités pour éviter les réservations lorsque l’atelier est complet.",
  "Les réservations d’espaces seront ajoutées après stabilisation du module ateliers.",
  "Prochaine étape : filtres, annulation encadrée et confirmations automatiques par email.",
] as const;

export default function AccountReservationsPage() {
  return (
    <AccountModuleShell
      eyebrow="Réservations"
      items={items}
      text="Ce module centralise les participations du membre : ateliers, événements, espaces et futures inscriptions Sunny Friday."
      title="Suivre vos réservations et prochaines participations."
    />
  );
}
