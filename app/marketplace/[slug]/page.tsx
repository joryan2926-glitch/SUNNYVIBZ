import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/SectionHeading";
import { getMarketOfferBySlug, getMarketOffers } from "@/lib/supabase/queries";

type MarketOfferPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const conversionSteps = [
  "Découvrir l’offre",
  "Contacter ou demander un devis",
  "Validation SUNNYVIBZ",
  "Paiement et suivi depuis l’espace membre",
] as const;

export const revalidate = 60;

export async function generateStaticParams() {
  const offers = await getMarketOffers(36);

  return offers.map((offer) => ({
    slug: offer.slug,
  }));
}

export async function generateMetadata({ params }: MarketOfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await getMarketOfferBySlug(slug);

  if (!offer) {
    return {
      title: "Offre introuvable",
    };
  }

  return {
    title: `${offer.title} | SUNNY Market`,
    description: offer.short_description,
  };
}

export default async function MarketOfferPage({ params }: MarketOfferPageProps) {
  const { slug } = await params;
  const offer = await getMarketOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(255,217,120,0.18),transparent_32rem),radial-gradient(circle_at_84%_12%,rgba(24,242,166,0.18),transparent_30rem)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="premium-card relative min-h-[28rem] overflow-hidden rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] shadow-2xl shadow-black/35">
            {offer.image_url ? (
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                SUNNY Market
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-[#fbf3df] sm:text-5xl">
                {offer.title}
              </h1>
            </div>
          </div>

          <div>
            <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
              {offer.category ?? "Offre créative"}
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-5xl">
              {offer.price_label}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#fbf3df]/72 sm:text-base">
              {offer.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-[#18f2a6]/16 bg-[#18f2a6]/8 p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#18f2a6]">
                  Talent
                </p>
                <p className="mt-2 text-sm font-semibold text-[#fbf3df]/74">{offer.seller_name}</p>
              </div>
              <div className="rounded-3xl border border-[#ffd978]/16 bg-[#ffd978]/8 p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#ffd978]">
                  Format
                </p>
                <p className="mt-2 text-sm font-semibold text-[#fbf3df]/74">{offer.delivery_mode}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#fbf3df]/44">
                  Statut
                </p>
                <p className="mt-2 text-sm font-semibold text-[#fbf3df]/74">
                  {offer.status === "available" ? "Disponible" : "Sur demande"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:bg-[#18f2a6]/18"
              >
                Demander cette offre
              </Link>
              <Link
                href="/communaute"
                className="rounded-full border border-[#ffd978]/28 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978] transition hover:bg-[#ffd978]/10"
              >
                Voir la communauté
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Parcours commande"
          title="Une offre Market doit être simple à comprendre, réserver et suivre."
          text="Cette première version prépare les futures commandes, paiements, devis, prestations et suivis depuis l’espace membre."
        />
        <div className="grid gap-4 md:grid-cols-4">
          {conversionSteps.map((step, index) => (
            <div
              key={step}
              className="rounded-3xl border border-[#ffd978]/16 bg-white/[0.045] p-5 text-sm font-semibold leading-7 text-[#fbf3df]/74"
            >
              <span className="mb-4 grid h-9 w-9 place-items-center rounded-full border border-[#18f2a6]/28 bg-[#18f2a6]/10 text-xs font-black text-[#18f2a6]">
                {index + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
