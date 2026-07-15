import type { Metadata } from "next";
import { MarketInquiriesDashboard } from "@/components/MarketInquiriesDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Mes demandes Market",
  description: "Suivez vos demandes de collaboration et de services sur SUNNY Market.",
};

export default function AccountMarketPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading eyebrow="SUNNY Market" title="Suivre vos demandes de collaboration." text="Retrouvez le statut de vos demandes envoyées aux artistes, associations et partenaires présents sur le Market." />
      <MarketInquiriesDashboard />
    </main>
  );
}
