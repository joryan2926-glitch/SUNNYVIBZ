import type { Metadata } from "next";
import { AccountModuleShell } from "@/components/AccountModuleShell";

export const metadata: Metadata = {
  title: "Wallet",
  description: "Wallet SUNNYVIBZ : portefeuille, paiements, crédits, transactions et solde membre.",
};

const items = [
  "Structure MVP prévue pour afficher un solde membre et un historique.",
  "Préparation des SUNNY Credits, paiements ateliers, stands et commandes Market.",
  "Intégration Stripe à brancher lorsque les clés et les règles commerciales seront validées.",
  "Prochaine étape : table wallet, transactions et reçus de paiement.",
] as const;

export default function WalletPage() {
  return (
    <AccountModuleShell
      eyebrow="Wallet"
      items={items}
      text="Le wallet prépare la partie économique de SunnyVibz : paiements, crédits, remboursements, bonus, commandes et historique financier."
      title="Préparer le portefeuille SunnyVibz."
    />
  );
}
