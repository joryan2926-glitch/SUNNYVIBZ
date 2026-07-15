import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Administration",
  description:
    "Cockpit d’administration SUNNYVIBZ pour piloter ateliers, espaces, événements, Community, Market, contenus et priorités opérationnelles.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Admin"
        title="Cockpit d’administration SUNNYVIBZ."
        text="Une première base admin pour piloter les modules MVP : création rapide, priorités opérationnelles, liens de contrôle et préparation des futures règles Supabase/RLS."
      />
      <AdminDashboard />
    </main>
  );
}