import Image from "next/image";
import type { GalleryItem } from "@/lib/supabase/types";

export function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  return (
    <article className="premium-card group overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={item.image_url}
          alt={item.alt ?? item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#18f2a6] to-transparent opacity-70" />
        <span className="absolute left-5 top-5 rounded-full border border-[#18f2a6]/30 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#18f2a6] backdrop-blur">
          0{index + 1}
        </span>
      </div>
      <div className="p-6">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
          {item.category ?? "Galerie"}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
          {item.title}
        </h3>
        {item.artist_name ? (
          <p className="mt-3 text-sm text-[#fbf3df]/62">Par {item.artist_name}</p>
        ) : null}
      </div>
    </article>
  );
}
