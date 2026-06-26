import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryCard } from "@/components/GalleryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArtistBySlug, getArtists, getGalleryItems } from "@/lib/supabase/queries";

type TalentProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const artists = await getArtists(36);

  return artists.map((artist) => ({
    slug: artist.slug,
  }));
}

export async function generateMetadata({ params }: TalentProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    return {
      title: "Talent introuvable",
    };
  }

  return {
    title: `${artist.name} | Talent SUNNYVIBZ`,
    description:
      artist.bio ??
      "Profil talent SUNNYVIBZ avec photos, vidéos, événements, disciplines et liens sociaux.",
  };
}

export default async function TalentProfilePage({ params }: TalentProfilePageProps) {
  const { slug } = await params;
  const [artist, gallery] = await Promise.all([getArtistBySlug(slug), getGalleryItems(6)]);

  if (!artist) {
    notFound();
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(24,242,166,0.18),transparent_32rem),radial-gradient(circle_at_80%_12%,rgba(255,217,120,0.16),transparent_30rem)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div className="premium-card relative min-h-[26rem] overflow-hidden rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] shadow-2xl shadow-black/35">
            {artist.image_url ? (
              <Image
                src={artist.image_url}
                alt={artist.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                Profil média
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-[#fbf3df] sm:text-5xl">
                {artist.name}
              </h1>
            </div>
          </div>

          <div>
            <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
              Talent SUNNYVIBZ
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-5xl">
              {artist.specialty ?? "Création, scène et culture"}
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#fbf3df]/70 sm:text-base">
              {artist.bio}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {["Photos", "Vidéos", "Événements"].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-center"
                >
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#ffd978]">
                    {item}
                  </p>
                  <p className="mt-2 text-xs text-[#fbf3df]/58">Espace profil prêt</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
              >
                Demander un accès profil
              </Link>
              {artist.instagram_url ? (
                <a
                  href={artist.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#ffd978]/28 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]"
                >
                  Instagram
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Mur créatif"
          title="Photos, vidéos et moments à mettre en avant."
          text="Cette zone prépare le futur flux social SUNNYVIBZ : publications, médias, coulisses, œuvres, prestations et événements liés au profil."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item, index) => (
            <GalleryCard item={item} index={index} key={item.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
