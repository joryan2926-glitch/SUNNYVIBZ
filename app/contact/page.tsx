import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez SUNNYVIBZ pour une adhésion, une exposition, un atelier, un partenariat ou une collaboration culturelle.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Écrivons la suite de SUNNYVIBZ ensemble."
          text="Le formulaire enregistre les demandes dans Supabase via la table contact_messages."
        />

        <div className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-7 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-lg leading-8">
            Pour une adhésion, une exposition, un stand Sunny Friday, un partenariat ou un projet
            culturel, envoyez un message à l’équipe.
          </p>
          <a
            href="mailto:contact@sunnyvibz.fr"
            className="mt-6 inline-block text-xl font-semibold text-[#18f2a6]"
          >
            contact@sunnyvibz.fr
          </a>
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
