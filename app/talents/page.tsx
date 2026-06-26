import type { Metadata } from "next";
import { ArtistCard } from "@/components/ArtistCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArtists } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Talents",
  description:
    "Découvrez les talents SUNNYVIBZ : portfolios, photos, vidéos, services, événements et profils média.",
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

const talentPromise = [
  "Un portfolio public pour montrer son univers.",
  "Un futur mur média pour photos, vidéos et coulisses.",
  "Une passerelle vers les ateliers, événements et prestations.",
  "Une visibilité possible dans le Market et Sunny Friday.",
] as const;

export default async function TalentsPage() {
  const talents = await getArtists(36);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Talents"
        title="Plus qu’un annuaire : une vitrine vivante pour les créateurs."
        text="SunnyVibz met en avant les photographes, peintres, musiciens, sculpteurs, vidéastes, animateurs, performeurs et créateurs que la plateforme accompagne et sublime."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {disciplines.map((discipline) => (
          <span
            key={discipline}
            className="rounded-full border border-[#ffd978]/18 bg-[#ffd978]/8 px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#ffd978]"
          >
            {discipline}
          </span>
        ))}
      </div>

      <section className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {talentPromise.map((promise) => (
          <div
            key={promise}
            className="rounded-3xl border border-[#18f2a6]/18 bg-[#18f2a6]/8 p-5 text-sm font-semibold leading-7 text-[#fbf3df]/74"
          >
            {promise}
          </div>
        ))}
      </section>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {talents.map((artist) => (
          <ArtistCard artist={artist} key={artist.id} />
        ))}
      </div>
    </main>
  );
}
