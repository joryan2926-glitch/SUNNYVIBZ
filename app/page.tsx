import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { ArtistCard } from "@/components/ArtistCard";
import { EventCard } from "@/components/EventCard";
import { GalleryCard } from "@/components/GalleryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { SunnyLogo } from "@/components/SunnyLogo";
import { WorkshopCard } from "@/components/WorkshopCard";
import { getArticles, getArtists, getEvents, getGalleryItems, getWorkshops } from "@/lib/supabase/queries";

export const revalidate = 60;

const stats = [
  ["Agenda", "Les rendez-vous qui font vivre la communauté"],
  ["Ateliers", "Apprendre, pratiquer, repartir avec du concret"],
  ["Sunny Friday", "Le marché vivant des créateurs et exposants"],
  ["Galerie", "Images, coulisses, expositions et ambiances"],
  ["Market", "Œuvres, prestations, services et stands"],
  ["Articles", "Récits, coulisses et culture de terrain"],
  ["Talents", "Profils média, photos, vidéos et collaborations"],
  ["Partenaires", "Associations, entreprises, sponsors et lieux"],
] as const;

const marketHighlights = [
  ["Œuvres & créations", "Peinture, photo, sculpture, illustration, mode, artisanat et pièces uniques."],
  ["Services & prestations", "Shooting, animation d’atelier, performance, musique, vidéo, scénographie et médiation."],
  ["Sunny Friday", "Stands exposants, QR, mise en avant, ventes et rencontre directe avec le public."],
  ["Profils talents", "Chaque offre peut vivre sur un profil avec photos, vidéos, événements et liens sociaux."],
] as const;

const primaryPathways = [
  {
    title: "Comprendre le parcours",
    text: "Comprendre comment une simple visite devient une expérience : découvrir, réserver, adhérer, exposer, vendre ou collaborer.",
    href: "/comment-ca-marche",
  },
  {
    title: "Réserver un atelier",
    text: "Choisir un créneau, voir les places restantes et vivre un moment créatif guidé, accessible et bien organisé.",
    href: "/ateliers",
  },
  {
    title: "Découvrir les talents",
    text: "Explorer des profils vivants : discipline, univers, photos, vidéos, prestations, événements et projets.",
    href: "/talents",
  },
  {
    title: "Rejoindre SunnyVibz",
    text: "Choisir une formule, accéder aux espaces, profiter d’avantages et entrer dans une communauté culturelle active.",
    href: "/abonnements",
  },
] as const;

const proofPoints = [
  {
    quote:
      "On vient pour créer, mais on repart surtout avec des idées, des contacts et l’envie de recommencer.",
    name: "Membre atelier",
  },
  {
    quote:
      "SunnyVibz donne un cadre pour montrer son travail, tester une offre et rencontrer un vrai public.",
    name: "Talent créatif",
  },
  {
    quote:
      "Le projet parle aux artistes comme aux partenaires : il crée du lien, du passage et une énergie locale visible.",
    name: "Partenaire culturel",
  },
] as const;

export default async function Home() {
  const [events, gallery, artists, workshops, articles] = await Promise.all([
    getEvents(3),
    getGalleryItems(4),
    getArtists(3),
    getWorkshops(3),
    getArticles(3),
  ]);

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[url('/sunnyvibz-hero.svg')] bg-cover bg-center opacity-[0.42]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/70 to-black/35" />
        <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="hero-rise">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-[#ffd978]">
              Lieu vivant • Plateforme culturelle • Communauté créative
            </p>
            <h1 className="text-balance text-5xl font-light leading-[0.9] tracking-[-0.07em] text-[#18f2a6] drop-shadow-[0_0_28px_rgba(24,242,166,0.45)] sm:text-7xl lg:text-8xl">
              L’ART.
              <span className="block">LA CULTURE.</span>
              <span className="block">LA VIBZ.</span>
              <span className="mt-5 block text-xl font-medium uppercase tracking-[0.16em] text-[#ffd978] sm:text-3xl">
                SUNNYVIBZ
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#fbf3df]/76 sm:text-lg">
              SUNNYVIBZ est un écosystème Art & Culture pour créer, apprendre, exposer,
              vendre, rencontrer et faire grandir les talents. Un lieu physique, une
              communauté, et une plateforme pour transformer la créativité locale en
              opportunités concrètes.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/ateliers"
                className="rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/16 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.28)] transition hover:-translate-y-1"
              >
                Réserver un atelier
              </Link>
              <Link
                href="/talents"
                className="rounded-full border border-[#ffd978]/40 bg-[#ffd978]/10 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffd978] transition hover:-translate-y-1"
              >
                Découvrir les talents
              </Link>
              <Link
                href="/abonnements"
                className="rounded-full border border-white/15 bg-white/[0.06] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] transition hover:-translate-y-1 hover:border-[#18f2a6]/35"
              >
                Rejoindre
              </Link>
              <Link
                href="/comment-ca-marche"
                className="rounded-full border border-white/15 bg-black/20 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df]/82 transition hover:-translate-y-1 hover:border-[#ffd978]/35 hover:text-[#ffd978]"
              >
                Comment ça marche
              </Link>
            </div>
          </div>

          <aside className="premium-card float-panel rounded-[2.4rem] border border-[#ffd978]/18 bg-white/[0.055] p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <div className="soft-pulse mx-auto grid size-52 place-items-center rounded-full border border-[#18f2a6]/30 bg-[#18f2a6]/10 shadow-[0_0_46px_rgba(24,242,166,0.28)]">
              <SunnyLogo className="size-36" />
            </div>
            <div className="mt-8 grid gap-4">
              {stats.map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl border border-white/10 bg-black/24 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#18f2a6]/25"
                >
                  <strong className="text-[#ffd978]">{title}</strong>
                  <p className="mt-1 text-sm text-[#fbf3df]/64">{text}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {primaryPathways.map((pathway) => (
            <Link
              key={pathway.href}
              href={pathway.href}
              className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/42"
            >
              <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#18f2a6]">
                Parcours
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                {pathway.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{pathway.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Présentation"
            title="Un lieu pour créer, une scène pour être vu, une communauté pour avancer."
            text="SunnyVibz ne se limite pas à programmer des activités. Le projet organise un parcours complet : accueillir les publics, révéler les talents, structurer les ateliers, soutenir les ventes et créer des rencontres utiles."
          />
          <div className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-7 leading-8 text-[#fbf3df]/72 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <p>
              Ici, on ne vient pas seulement assister à un événement. On vient tester une idée,
              apprendre une technique, présenter une création, rencontrer un public ou trouver
              une collaboration.
            </p>
            <p className="mt-5">
              Les ateliers donnent un cadre pour pratiquer. Sunny Friday donne une scène pour
              exposer. Le Market donne un chemin pour vendre. Les profils talents donnent une
              présence durable à celles et ceux que SunnyVibz sublime.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="premium-card overflow-hidden rounded-[2.6rem] border border-[#ffd978]/18 bg-[radial-gradient(circle_at_top_left,rgba(255,217,120,0.18),transparent_26rem),rgba(255,255,255,0.055)] p-7 shadow-2xl shadow-black/35 backdrop-blur-xl sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#ffd978]">
                Market créatif
              </p>
              <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-5xl">
                Une vitrine économique pour soutenir ce qui se crée ici.
              </h2>
              <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70 sm:text-base">
                Le Market prolonge naturellement les profils talents : acheter une œuvre,
                réserver une prestation, commander une intervention, soutenir un exposant
                Sunny Friday ou financer une idée artistique.
              </p>
              <Link
                href="/marketplace"
                className="mt-7 inline-flex rounded-full border border-[#18f2a6]/42 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
              >
                Explorer le Market
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {marketHighlights.map(([title, text]) => (
                <article
                  key={title}
                  className="rounded-[1.6rem] border border-white/10 bg-black/24 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#ffd978]/30"
                >
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#fbf3df]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#fbf3df]/62">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Agenda"
            title="Des rendez-vous pour vivre la culture, pas seulement la regarder."
            text="Ateliers, expositions, Sunny Friday, scènes ouvertes : l’agenda donne du rythme à la communauté et transforme le lieu en point de rencontre."
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
            eyebrow="Ateliers"
            title="Des ateliers pour apprendre, oser, transmettre et repartir avec du concret."
            text="Chaque atelier doit être lisible : ce qu’on pratique, le lieu, la date, le prix, les places restantes, les avantages abonnés et le niveau d’accès."
          />
          <Link href="/ateliers" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Voir les ateliers →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {workshops.map((workshop) => (
            <WorkshopCard workshop={workshop} key={workshop.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Galerie"
            title="Des images pour sentir l’ambiance."
            text="Ateliers, créations, scènes ouvertes, marchés et coulisses : la galerie donne un aperçu sensible de la vibz SUNNYVIBZ."
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
            eyebrow="Articles"
            title="Des coulisses, des idées et des récits."
            text="Les articles racontent la vie du projet : talents, ateliers, Sunny Friday, market, partenaires et ambitions culturelles."
          />
          <Link href="/articles" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Lire les articles →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard article={article} key={article.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Talents"
            title="Des profils vivants pour rendre les créateurs visibles."
            text="Photographes, peintres, sculpteurs, musiciens, vidéastes, animateurs ou performeurs : chaque talent doit pouvoir montrer son univers, ses médias, ses services et ses prochains rendez-vous."
          />
          <Link href="/talents" className="mb-10 text-sm font-black uppercase tracking-[0.16em] text-[#18f2a6]">
            Découvrir les talents →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {artists.map((artist) => (
            <ArtistCard artist={artist} key={artist.id} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <SectionHeading
          eyebrow="Pourquoi ça compte"
          title="La culture avance quand les talents trouvent un cadre et un public."
          text="SunnyVibz veut créer ce moment rare où une personne ose montrer ce qu’elle fait, où un partenaire découvre une idée, et où un projet trouve enfin une trajectoire concrète."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {proofPoints.map((proof) => (
            <article
              key={proof.name}
              className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <p className="text-base leading-8 text-[#fbf3df]/76">“{proof.quote}”</p>
              <p className="mt-5 text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                {proof.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="premium-card rounded-[2.5rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-8 text-center shadow-[0_0_50px_rgba(24,242,166,0.16)] sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffd978]">Contact</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-0.055em] text-[#fbf3df] sm:text-6xl">
            Vous voulez apprendre, exposer, vendre, soutenir ou proposer une idée ?
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
