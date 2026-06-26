import type { Metadata } from "next";
import { ArtistCard } from "@/components/ArtistCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArtists } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Artistes",
  description:
    "Découvrez les artistes SUNNYVIBZ : profils, spécialités, portfolios, réseaux sociaux et collaborations.",
};

export const revalidate = 60;

export default async function ArtistsPage() {
  const artists = await getArtists(36);

  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Artistes"
        title="Une page dédiée aux talents et aux créateurs."
        text="Les profils sont lus depuis Supabase via la table artists."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((artist) => (
          <ArtistCard artist={artist} key={artist.id} />
        ))}
      </div>
    </main>
  );
}
