import type { Metadata } from "next";
import { GalleryCard } from "@/components/GalleryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getGalleryItems } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Galerie",
  description:
    "Galerie SUNNYVIBZ : œuvres, ateliers, portraits, expositions, Sunny Friday et moments de communauté.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const items = await getGalleryItems(36);

  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Galerie"
        title="Une vitrine visuelle pour ressentir le lieu avant d’y venir."
        text="La galerie montre ce que SunnyVibz sublime : photos, peintures, sculptures, scènes, ateliers, coulisses, événements, portraits et énergie collective."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <GalleryCard item={item} index={index} key={item.id} />
        ))}
      </div>
    </main>
  );
}
