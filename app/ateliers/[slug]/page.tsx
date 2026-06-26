import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WorkshopBookingForm } from "@/components/WorkshopBookingForm";
import { getWorkshopBySlug, getWorkshops } from "@/lib/supabase/queries";

type WorkshopDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const experienceCards = [
  {
    title: "Un cadre guidé",
    text: "L’atelier est pensé pour apprendre sans pression : consignes claires, ambiance chaleureuse et vraie place pour l’expression personnelle.",
  },
  {
    title: "Une création à vivre",
    text: "On ne vient pas seulement consommer un cours. On expérimente, on échange, on repart avec une matière, une idée ou une réalisation.",
  },
  {
    title: "Une porte d’entrée",
    text: "Chaque atelier peut devenir un lien vers la communauté, les talents, Sunny Friday, le Market ou un futur projet culturel.",
  },
] as const;

function formatCents(cents: number | null) {
  if (cents === null) {
    return "Selon formule";
  }

  if (cents === 0) {
    return "Inclus";
  }

  return `${new Intl.NumberFormat("fr-FR").format(cents / 100)} €`;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const workshops = await getWorkshops(24);

  return workshops.map((workshop) => ({
    slug: workshop.slug,
  }));
}

export async function generateMetadata({ params }: WorkshopDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);

  return {
    title: workshop ? `${workshop.title} | Atelier SUNNYVIBZ` : "Atelier introuvable",
    description:
      workshop?.description ??
      "Réservez un atelier SUNNYVIBZ : expérience créative, rencontre culturelle et nombre de places limité.",
  };
}

export default async function WorkshopDetailPage({ params }: WorkshopDetailPageProps) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const isFull = workshop.status !== "available" || workshop.seats_remaining <= 0;

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <div className="premium-card relative min-h-[28rem] overflow-hidden rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] shadow-2xl shadow-black/35">
            {workshop.image_url ? (
              <Image
                src={workshop.image_url}
                alt={workshop.title}
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
              {isFull ? "Complet" : "Disponible"}
            </span>
            <div className="absolute bottom-7 left-7 right-7">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#ffd978]">
                {dateFormatter.format(new Date(workshop.start_date))}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] text-[#fbf3df] sm:text-5xl">
                {workshop.title}
              </h1>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7">
            <p className="text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">
              Expérience créative
            </p>
            <p className="mt-4 text-sm leading-8 text-[#fbf3df]/72">{workshop.description}</p>
            <div className="mt-6 grid gap-3 text-sm text-[#fbf3df]/72 sm:grid-cols-2">
              <p>Lieu : {workshop.location}</p>
              <p>Tarif public : {workshop.price_label}</p>
              <p>Essentielle : {formatCents(workshop.subscriber_price_cents)}</p>
              <p>Créative : {formatCents(workshop.creative_price_cents)}</p>
              <p>Premium : {formatCents(workshop.premium_price_cents)}</p>
              <p>Capacité : {workshop.capacity} places</p>
              <p>Places restantes : {workshop.seats_remaining}</p>
            </div>
            <p className="mt-5 rounded-2xl border border-[#ffd978]/16 bg-[#ffd978]/10 p-4 text-xs leading-6 text-[#fbf3df]/68">
              {workshop.access_notes ??
                "Réservation obligatoire, contrôle des capacités et accès prioritaire pour les formules Créative et Premium."}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {experienceCards.map((card) => (
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

        <WorkshopBookingForm workshop={workshop} />
      </section>
    </main>
  );
}
