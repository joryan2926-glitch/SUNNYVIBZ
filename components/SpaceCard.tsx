import Image from "next/image";
import Link from "next/link";
import type { Space } from "@/lib/supabase/types";

function formatCents(cents: number | null) {
  if (cents === null) {
    return "Sur devis";
  }

  if (cents === 0) {
    return "Inclus";
  }

  return `${new Intl.NumberFormat("fr-FR").format(cents / 100)} €`;
}

export function SpaceCard({ space }: { space: Space }) {
  const isFull = space.status !== "available" || space.slots_remaining <= 0;

  return (
    <article className="premium-card group overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/40">
      <div className="relative h-56 overflow-hidden">
        {space.image_url ? (
          <Image
            src={space.image_url}
            alt={space.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-transparent" />
        <span
          className={`absolute left-5 top-5 rounded-full border px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] ${
            isFull
              ? "border-red-300/35 bg-red-500/15 text-red-100"
              : "border-[#18f2a6]/35 bg-[#18f2a6]/12 text-[#18f2a6]"
          }`}
        >
          {isFull ? "Complet" : "Réservable"}
        </span>
      </div>
      <div className="p-6">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
          {space.location}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {space.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{space.description}</p>

        <div className="mt-5 grid gap-2 text-sm text-[#fbf3df]/70">
          <p>Surface : {space.area_label}</p>
          <p>Capacité : {space.capacity} personnes</p>
          <p>Tarif : {space.price_label}</p>
          <p>Demi-journée : {formatCents(space.half_day_price_cents)}</p>
          <p>Journée : {formatCents(space.full_day_price_cents)}</p>
          <p>
            Créneaux : {space.slots_remaining}/{space.slots_capacity} disponibles
          </p>
          <p className="text-[#ffd978]">
            {space.requires_booking ? "Réservation obligatoire" : "Accès libre"} ·{" "}
            {space.subscriber_priority ? "priorité abonnés" : "priorité standard"}
          </p>
        </div>

        <Link
          href={`/espaces/${space.slug}`}
          className="mt-6 inline-flex rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
        >
          Voir l’espace
        </Link>
      </div>
    </article>
  );
}
