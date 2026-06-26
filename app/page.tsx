import Link from "next/link";
import { ArtistCard } from "@/components/ArtistCard";
import { EventCard } from "@/components/EventCard";
import { GalleryCard } from "@/components/GalleryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SunnyLogo } from "@/components/SunnyLogo";
import { getArtists, getEvents, getGalleryItems } from "@/lib/supabase/queries";

export const revalidate = 60;

const stats = [
  ["Agenda", "Événements, ateliers, Sunny Friday"],
  ["Galerie", "Créations, expositions, ambiances"],
  ["Artistes", "Talents, portfolios, collaborations"],
] as const;

export default async function Home() {
  const [events, gallery, artists] = await Promise.all([
    getEvents(3),
    getGalleryItems(4),
    getArtists(3),
  ]);

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('/sunnyvibz-hero.svg')] bg-cover bg-center opacity-[0.42]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/35" />
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-[#ffd978]">
              Association culturelle • Création • Partage
            </p>
            <h1 className="text-balance text-6xl font-light leading-[0.86] tracking-[-0.08em] text-[#18f2a6] drop-shadow-[0_0_28px_rgba(24,242,166,0.45)] sm:text-8xl lg:text-9xl">
              SUNNYVIBZ
              <span className="mt-5 block text-2xl font-medium uppercase tracking-[0.18em] text-[#ffd978] sm:text-4xl">
                Pôle Art & Culture
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-[#fbf3df]/76 sm:text-xl">
              Un site vivant pour découvrir l’association, suivre l’agenda, explorer la galerie,
              rencontrer les artistes et rejoindre une communauté créative.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/a-propos"
                className="rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/16 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.28)] transition hover:-translate-y-1"
              >
                Découvrir
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-[#ffd978]/40 bg-[#ffd978]/10 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffd978] transition hover:-translate-y-1"
              >
                Nous contacter
              </Link>
            </div>
          </div>

          <aside className="rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="mx-auto grid size-52 place-items-center rounded-full border border-[#18f2a6]/30 bg-[#18f2a6]/10 shadow-[0_0_46px_rgba(24,242,166,0.28)]">
              <SunnyLogo className="size-36" />
            </div>
            <div className="mt-8 grid gap-4">
              {stats.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-black/24 p-5"
                >
                  <strong className="text-[#ffd978]">{title}</strong>
                  <p className="mt-1 text-sm text-[#fbf3df]/64">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Présentation"
            title="Une association artistique chaleureuse, moderne et ouverte."
            text="SUNNYVIBZ connecte artistes, adhérents, bénévoles et partenaires autour de projets créatifs, d’événements, d’ateliers et de rencontres culturelles."
          />
          <div className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-7 leading-8 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <p>
              Le site est pensé comme une vitrine claire aujourd’hui et comme la base d’un futur
              écosystème : inscriptions, réservations, galerie, marketplace, artistes, agenda et
              communauté.
            </p>
            <p className="mt-5">
              Chaque section est prête à être connectée à Supabase pour permettre à l’association de
              publier facilement ses contenus.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Agenda"
            title="Les prochains rendez-vous."
            text="Les événements sont lus depuis Supabase, avec un fallback visible tant que la base est vide."
          />
          <Link href="/agenda" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Tout l’agenda →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Galerie"
            title="Images, œuvres et moments SUNNYVIBZ."
            text="La galerie dynamique lit les éléments publiés dans la table Supabase gallery."
          />
          <Link href="/galerie" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Voir la galerie →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {gallery.map((item, index) => (
            <GalleryCard item={item} index={index} key={item.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Artistes"
            title="Des profils pour valoriser les talents."
            text="La page Artistes est prête à afficher les créateurs publiés depuis Supabase."
          />
          <Link href="/artistes" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Découvrir les artistes →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard artist={artist} key={artist.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="rounded-[2.5rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-8 text-center shadow-[0_0_50px_rgba(24,242,166,0.16)] sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd978]">Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-0.055em] text-[#fbf3df] sm:text-6xl">
            Rejoindre, exposer, soutenir ou organiser un projet ?
          </h2>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full border border-[#ffd978]/45 bg-[#ffd978]/10 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffd978] transition hover:-translate-y-1"
          >
            Envoyer un message
          </Link>
        </div>
      </section>
    </main>
  );
}
