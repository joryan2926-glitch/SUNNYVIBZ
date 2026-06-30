import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez SUNNYVIBZ pour exposer, réserver un atelier, devenir partenaire, rejoindre la communauté ou proposer un projet culturel.",
};

const contactReasons = [
  "Je veux exposer",
  "Je veux réserver un atelier",
  "Je veux devenir partenaire",
  "Je veux rejoindre SunnyVibz",
  "Je veux proposer un projet",
  "Je veux candidater Sunny Friday",
  "Je veux mettre en avant un talent",
  "Je veux organiser une action culturelle",
] as const;

export default function ContactPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Parlez-nous de ce que vous voulez créer, montrer ou soutenir."
          text="Exposer, réserver, rejoindre, soutenir, proposer, vendre, collaborer : SunnyVibz sert à transformer une intention culturelle en parcours concret."
        />

        <div className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-7 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-lg leading-8">
            Choisissez votre porte d’entrée. L’équipe pourra vous orienter vers le bon parcours :
            atelier, Sunny Friday, profil talent, partenariat, abonnement, market, action culturelle
            ou projet sur mesure.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {contactReasons.map((reason) => (
              <span
                key={reason}
                className="rounded-full border border-[#18f2a6]/24 bg-[#18f2a6]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#18f2a6]"
              >
                {reason}
              </span>
            ))}
          </div>
          <a
            href="mailto:contact@sunnyvibz.fr"
            className="mt-7 inline-block text-xl font-semibold text-[#18f2a6]"
          >
            contact@sunnyvibz.fr
          </a>
        </div>
      </div>

      <ContactForm />
    </main>
  );
}
