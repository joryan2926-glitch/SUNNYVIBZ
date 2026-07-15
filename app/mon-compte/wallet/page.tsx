import type { Metadata } from "next";
import { WalletDashboard } from "@/components/WalletDashboard";

export const metadata: Metadata = {
  title: "Mon portefeuille",
  description: "Gérez vos Sunny Credits et vos demandes de recharge SunnyVibz.",
};

export default function WalletPage() {
  return <WalletDashboard />;
}