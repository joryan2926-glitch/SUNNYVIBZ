import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Market créatif",
  description:
    "Market créatif SUNNYVIBZ : acheter des créations, réserver des prestations, commander des services, soutenir les talents et valoriser l’économie culturelle locale.",
};

const categories = [
  {
    title: "Œuvres & objets",
    text: "Peinture, photo, sculpture, illustration, artisanat, mode, éditions limitées et créations uniques.",
  },
  {
    title: "Services créatifs",
    text: "Shooting photo, animation d’atelier, performance, scénographie, musique, vidéo, médiation et accompagnement.",
  },
  {
    title: "Stands exposants",
    text: "Préparer la réservation de stands Sunny Friday avec QR exposant, paiement et visibilité.",
  },
  {
    title: "Offres partenaires",
    text: "Mettre en avant les structures qui soutiennent les talents : lieux, sponsors, associations, entreprises et mécènes.",
  },
] as const;

const futureModules = [
  "Boutiques talents",
  "Commandes",
  "Paiements",
  "Réservations de stands",
  "SUNNY Credits",
  "Avis & recommandations",
  "Produits numériques",
  "Prestations sur devis",
] as const;

const featuredOffers = [
  {
    title: "Portrait photo artistique",
    category: "Prestation",
    price: "À partir de 80 €",
    text: "Shooting créatif relié à un profil talent et livrable pour réseaux sociaux, portfolio ou exposition.",
  },
  {
    title: "Œuvre originale",
    category: "Création",
    price: "Sur devis",
    text: "Peinture, illustration, sculpture, photo ou pièce unique proposée par les talents SUNNYVIBZ.",
  },
  {
    title: "Animation atelier",
    category: "Service",
    price: "À partir de 120 €",
    text: "Intervention créative pour associations, entreprises, centres de loisirs, écoles ou événements.",
  },
] as const;

const marketWorkflow = [
  "Le talent publie une offre",
  "SUNNYVIBZ valide la mise en avant",
  "Le public réserve ou demande un devis",
  "La commande est suivie depuis l’espace membre",
] as const;

export default function MarketplacePage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_8%,rgba(255,217,120,0.18),transparent_30rem),radial-gradient(circle_at_80%_18%,rgba(24,242,166,0.18),transparent_32rem)]" />
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <SectionHeading
              eyebrow="Market créatif"
              title="Acheter une création, réserver une prestation, faire circuler la valeur."
              text="Le Market SUNNYVIBZ est le prolongement économique des profils talents : une vitrine pour vendre, réserver, commander, financer et rendre la création locale plus durable."
            />

            <div className="premium-card rounded-[2.4rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-7 shadow-[0_0_54px_rgba(24,242,166,0.15)] sm:p-9">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#ffd978]">
                Pré-lancement
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl">
                Une vitrine prête à devenir un moteur économique culturel.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70">
                Le public pourra découvrir une offre, contacter le talent, réserver une prestation
                ou acheter une création. L’étape suivante sera de connecter les commandes, les
                paiements, les stocks, les devis et les boutiques talents.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/talents"
                  className="rounded-full border border-[#18f2a6]/38 bg-black/20 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
                >
                  Voir les talents
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-[#ffd978]/36 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]"
                >
                  Proposer une offre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.title}
              className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/40"
            >
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Market
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {category.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{category.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Offres exemples"
          title="Des offres concrètes, lisibles et prêtes à vendre."
          text="Le Market doit aider le visiteur à comprendre rapidement ce qu’il peut acheter, réserver ou demander : une œuvre, un service, une animation, une prestation, un devis ou un stand."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredOffers.map((offer) => (
            <article
              key={offer.title}
              className="premium-card rounded-[2rem] border border-[#18f2a6]/18 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/42"
            >
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                {offer.category}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {offer.title}
              </h2>
              <p className="mt-2 text-lg font-semibold text-[#ffd978]">{offer.price}</p>
              <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{offer.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#ffd978]">
                Modules possibles
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl">
                Le Market peut devenir le moteur économique visible de l’association.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70">
                L’objectif est de valoriser tout ce que SUNNYVIBZ sublime : photographes, peintres,
                sculpteurs, musiciens, vidéastes, ateliers, événements, partenaires, projets et services créatifs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[...futureModules, ...marketWorkflow].map((module) => (
                <div
                  key={module}
                  className="rounded-3xl border border-white/10 bg-black/24 p-4 text-sm font-semibold text-[#fbf3df]/76"
                >
                  {module}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
