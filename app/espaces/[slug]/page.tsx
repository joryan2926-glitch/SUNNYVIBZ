import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SpaceBookingForm } from "@/components/SpaceBookingForm";
import { getSpaceBySlug, getSpaces } from "@/lib/supabase/queries";

type SpaceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const usageCards = [
  {
    title: "Créer",
    text: "Ateliers, résidences courtes, sessions de pratique, répétitions légères et rencontres créatives.",
  },
  {
    title: "Transmettre",
    text: "Formations, masterclass, présentations de projets, temps associatifs ou actions culturelles.",
  },
  {
    title: "Exposer",
    text: "Accrochages, showcases, conférences, Sunny Friday, rendez-vous partenaires et formats premium.",
  },
] as const;

function formatCents(cents: number | null) {
  if (cents === null) {
    return "Sur devis";
  }

  if (cents === 0) {
    return "Inclus";
  }

  return `${new Intl.NumberFormat("fr-FR").format(cents / 100)} €`;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const spaces = await getSpaces(24);

  return spaces.map((space) => ({
    slug: space.slug,
  }));
}

export async function generateMetadata({ params }: SpaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const space = await getSpaceBySlug(slug);

  return {
    title: space ? `${space.title} | Espace SUNNYVIBZ` : "Espace introuvable",
    description:
      space?.description ??
      "Réservez un espace SUNNYVIBZ pour atelier, exposition, réunion, projet culturel ou événement.",
  };
}

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { slug } = await params;
  const space = await getSpaceBySlug(slug);

  if (!space) {
    notFound();
  }

  const isFull = space.status !== "available" || space.slots_remaining <= 0;

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <div className="premium-card relative min-h-[28rem] overflow-hidden rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] shadow-2xl shadow-black/35">
            {space.image_url ? (
              <Image
                src={space.image_url}
                alt={space.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/84 via-black/12 to-transparent" />
            <span
              className={`absolute left-6 top-6 rounded-full border px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] ${
                isFull
                  ? "border-red-300/35 bg-red-500/15 text-red-100"
                  : "border-[#18f2a6]/35 bg-[#18f2a6]/12 text-[#18f2a6]"
              }`}
            >
              {isFull ? "Complet" : "Réservable"}
            </span>
            <div className="absolute bottom-7 left-7 right-7">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#ffd978]">
                {space.location}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#fbf3df] sm:text-5xl">
                {space.title}
              </h1>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">
              Espace réservable
            </p>
            <p className="mt-4 text-sm leading-8 text-[#fbf3df]/72">{space.description}</p>
            <div className="mt-6 grid gap-3 text-sm text-[#fbf3df]/72 sm:grid-cols-2">
              <p>Lieu : {space.location}</p>
              <p>Surface : {space.area_label}</p>
              <p>Capacité : {space.capacity} personnes</p>
              <p>Tarif : {space.price_label}</p>
              <p>Heure : {formatCents(space.hourly_price_cents)}</p>
              <p>Demi-journée : {formatCents(space.half_day_price_cents)}</p>
              <p>Journée : {formatCents(space.full_day_price_cents)}</p>
              <p>Créneaux restants : {space.slots_remaining}</p>
            </div>
            <p className="mt-5 rounded-2xl border border-[#ffd978]/16 bg-[#ffd978]/10 p-4 text-xs leading-6 text-[#fbf3df]/68">
              {space.access_notes ??
                "Demande obligatoire, contrôle des capacités et validation de l’usage par SUNNYVIBZ."}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {usageCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-[#ffd978]/14 bg-white/[0.045] p-5"
              >
                <h2 className="text-lg font-semibold tracking-[-0.035em] text-[#fbf3df]">
                  {card.title}
                </h2>
                <p className="mt-3 text-xs leading-6 text-[#fbf3df]/62">{card.text}</p>
              </article>
            ))}
          </div>
        </div>

        <SpaceBookingForm space={space} />
      </section>
    </main>
  );
}
