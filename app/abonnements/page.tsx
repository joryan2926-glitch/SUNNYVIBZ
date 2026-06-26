import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { getSubscriptions } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Abonnements",
  description:
    "Formules SUNNYVIBZ Découverte, Artiste et Premium avec avantages, profils talents et accès communauté.",
};

export const revalidate = 60;

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions(3);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Abonnements"
        title="Trois formules pour rejoindre l’écosystème."
        text="La structure Supabase est prête pour gérer les formules et les abonnements utilisateurs. Le paiement réel pourra être connecté ensuite."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {subscriptions.map((subscription) => (
          <SubscriptionCard subscription={subscription} key={subscription.id} />
        ))}
      </div>
    </main>
  );
}
