import Image from "next/image";
import type { Artist } from "@/lib/supabase/types";

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <article className="premium-card overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/45">
      <div className="relative grid h-72 place-items-center overflow-hidden bg-[radial-gradient(circle_at_40%_20%,rgba(255,217,120,0.24),transparent_34%),linear-gradient(135deg,rgba(24,242,166,0.16),rgba(3,4,3,0.92))]">
        {artist.image_url ? (
          <Image
            src={artist.image_url}
            alt={artist.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 hover:scale-105"
          />
        ) : (
          <span className="text-7xl font-light text-[#ffd978] drop-shadow-[0_0_24px_rgba(255,217,120,0.42)]">
            {artist.name.slice(0, 1)}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <div className="p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#18f2a6]">
          {artist.specialty ?? "Artiste SUNNYVIBZ"}
        </p>
        <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#fbf3df]">
          {artist.name}
        </h3>
        <p className="mt-4 leading-7 text-[#fbf3df]/66">{artist.bio}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          {artist.instagram_url ? (
            <a
              href={artist.instagram_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#ffd978]/22 px-4 py-2 text-[#ffd978]"
            >
              Instagram
            </a>
          ) : null}
          {artist.website_url ? (
            <a
              href={artist.website_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#18f2a6]/25 px-4 py-2 text-[#18f2a6]"
            >
              Site
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
