import Image from "next/image";
import Link from "next/link";
import type { MarketOffer } from "@/lib/supabase/types";

const statusLabels: Record<MarketOffer["status"], string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
  draft: "Brouillon",
};

const offerTypeLabels: Record<MarketOffer["offer_type"], string> = {
  artwork: "Création",
  service: "Service",
  workshop: "Atelier",
  stand: "Stand",
  digital: "Digital",
};

export function MarketOfferCard({ offer }: { offer: MarketOffer }) {
  const isAvailable = offer.status === "available";

  return (
    <article className="premium-card group overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/42">
      <div className="relative h-64 overflow-hidden bg-[radial-gradient(circle_at_35%_20%,rgba(255,217,120,0.22),transparent_34%),linear-gradient(135deg,rgba(24,242,166,0.14),rgba(3,4,3,0.94))]">
        {offer.image_url ? (
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/82 to-transparent" />
        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#18f2a6]/35 bg-[#03100c]/70 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#18f2a6] backdrop-blur">
            {offerTypeLabels[offer.offer_type]}
          </span>
          <span
            className={`rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] backdrop-blur ${
              isAvailable
                ? "border-[#ffd978]/34 bg-[#ffd978]/10 text-[#ffd978]"
                : "border-white/14 bg-white/10 text-[#fbf3df]/58"
            }`}
          >
            {statusLabels[offer.status]}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
          {offer.category ?? "SUNNY Market"}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {offer.title}
        </h3>
        <p className="mt-2 text-sm font-semibold text-[#ffd978]">{offer.price_label}</p>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#fbf3df]/66">
          {offer.short_description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#fbf3df]/62">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            {offer.seller_name}
          </span>
          {offer.delivery_mode ? (
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              {offer.delivery_mode}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href={`/marketplace/${offer.slug}`}
            className="rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/10 px-4 py-2 font-semibold text-[#18f2a6] transition hover:bg-[#18f2a6]/18"
          >
            Voir l’offre
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#ffd978]/24 px-4 py-2 font-semibold text-[#ffd978] transition hover:bg-[#ffd978]/10"
          >
            Demander
          </Link>
        </div>
      </div>
    </article>
  );
}
