import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Administration",
  description: "Administration SUNNYVIBZ protégée pour ateliers, réservations, articles, talents et abonnements.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Admin"
        title="Structure d’administration SUNNYVIBZ."
        text="Cette zone est préparée pour gérer ateliers, réservations, articles, talents et abonnements. L’accès dépend du profil Supabase is_admin."
      />
      <AdminDashboard />
    </main>
  );
}
