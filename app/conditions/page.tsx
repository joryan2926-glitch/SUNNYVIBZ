import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  description: "Conditions d’utilisation de la plateforme SunnyVibz.",
};

const terms = [
  {
    title: "Objet",
    text: "SunnyVibz permet de découvrir le projet, consulter l’agenda, réserver des ateliers, créer un compte, contacter l’équipe et préparer l’accès aux abonnements, talents, événements et market.",
  },
  {
    title: "Réservations",
    text: "Les ateliers sont soumis à réservation obligatoire, capacité limitée et disponibilité. Une réservation peut nécessiter confirmation de l’équipe SunnyVibz avant validation définitive.",
  },
  {
    title: "Abonnements",
    text: "Les formules Essentielle, Créative, Premium et Annuelle donnent accès à des avantages selon les conditions affichées. Le paiement réel devra être encadré par des conditions commerciales complètes avant activation.",
  },
  {
    title: "Comportement utilisateur",
    text: "Chaque membre s’engage à respecter les autres utilisateurs, les talents, les partenaires, les lieux, les œuvres et les règles de la communauté SunnyVibz.",
  },
  {
    title: "Contenus et médias",
    text: "Les contenus envoyés sur la plateforme doivent respecter les droits d’auteur, la vie privée et les règles de modération. SunnyVibz peut retirer un contenu inadapté.",
  },
] as const;

const commercialActions = [
  "Définir les conditions de paiement",
  "Définir les conditions de remboursement",
  "Définir les règles d’annulation atelier",
  "Définir les règles pour stands Sunny Friday",
  "Définir les commissions ou frais Market",
] as const;

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Utilisation"
        title="Conditions d’utilisation."
        text="Cette page cadre l’usage de la plateforme. Elle sert de base et devra être complétée avant paiement réel, vente ou ouverture communautaire large."
      />

      <section className="grid gap-5">
        {terms.map((term) => (
          <article
            key={term.title}
            className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {term.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">{term.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          Conditions commerciales à décider
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {commercialActions.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df]/70">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
