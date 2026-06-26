import type { Metadata } from "next";
import { ArtistCard } from "@/components/ArtistCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArtists } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Talents",
  description:
    "Découvrez les talents SUNNYVIBZ : photographes, peintres, sculpteurs, musiciens, créateurs, portfolios et profils média.",
};

export const revalidate = 60;

const disciplines = [
  "Photo",
  "Peinture",
  "Sculpture",
  "Musique",
  "Danse",
  "Vidéo",
  "Mode",
  "Ateliers",
] as const;

export default async function TalentsPage() {
  const talents = await getArtists(36);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Talents"
        title="Les profils créatifs que SUNNYVIBZ sublime."
        text="Une rubrique pensée comme un réseau social culturel : chaque talent pourra présenter son univers, ses photos, ses vidéos, ses événements, ses services et ses collaborations."
      />

      <div className="mb-10 flex flex-wrap gap-2">
        {disciplines.map((discipline) => (
          <span
            key={discipline}
            className="rounded-full border border-[#ffd978]/18 bg-[#ffd978]/8 px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#ffd978]"
          >
            {discipline}
          </span>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {talents.map((artist) => (
          <ArtistCard artist={artist} key={artist.id} />
        ))}
      </div>
    </main>
  );
}
