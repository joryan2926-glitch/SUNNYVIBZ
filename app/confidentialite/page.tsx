import type { Metadata } from "next";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité SunnyVibz : données, formulaires, compte et réservations.",
};

const privacySections = [
  {
    title: "Données collectées",
    text: "SunnyVibz peut collecter les informations transmises via les formulaires : nom, email, téléphone, message, demande de contact, candidature Sunny Friday, réservation d’atelier et informations liées au compte membre.",
  },
  {
    title: "Utilisation des données",
    text: "Les données servent à répondre aux demandes, gérer les réservations, organiser les ateliers, suivre les candidatures, administrer les comptes et améliorer l’expérience de la plateforme.",
  },
  {
    title: "Compte utilisateur",
    text: "L’inscription et la connexion reposent sur Supabase Auth. L’utilisateur peut accéder à son espace membre pour consulter ses réservations et préparer son profil.",
  },
  {
    title: "Médias et uploads",
    text: "Les médias envoyés par les talents peuvent être stockés dans Supabase Storage. Une modération doit être prévue avant affichage public systématique.",
  },
  {
    title: "Durée et droits",
    text: "Les données sont conservées le temps nécessaire au traitement des demandes et à la gestion du service. Chaque personne peut demander l’accès, la correction ou la suppression de ses données via la page Contact.",
  },
] as const;

const privacyActions = [
  "Valider la durée de conservation des données",
  "Ajouter l’email officiel pour les demandes RGPD",
  "Définir la modération des médias talents",
  "Ajouter le prestataire email quand il sera choisi",
] as const;

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Données personnelles"
        title="Politique de confidentialité."
        text="Cette page explique comment SunnyVibz utilise les données transmises sur le site. Elle devra être validée juridiquement avant lancement commercial complet."
      />

      <section className="grid gap-5">
        {privacySections.map((section) => (
          <article
            key={section.title}
            className="rounded-[2rem] border border-[#18f2a6]/16 bg-white/[0.055] p-6"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">{section.text}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-[2rem] border border-[#ffd978]/18 bg-[#ffd978]/10 p-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          À verrouiller avant ouverture complète
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {privacyActions.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df]/70">
              {item}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
