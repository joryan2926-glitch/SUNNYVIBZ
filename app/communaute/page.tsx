import type { Metadata } from "next";
import Link from "next/link";
import { CommunityPostCard } from "@/components/CommunityPostCard";
import { CommunityPostComposer } from "@/components/CommunityPostComposer";
import { CommunityProfileCard } from "@/components/CommunityProfileCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getCommunityPosts, getCommunityProfiles } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "SUNNY Community",
  description:
    "Découvrez la communauté SUNNYVIBZ : adhérents, talents, associations, partenaires, projets, appels à collaboration et réseau culturel local.",
};

export const revalidate = 60;

const communityBenefits = [
  {
    title: "Présenter son profil",
    text: "Chaque membre peut exister avec ses rôles : adhérent, artiste, bénévole, association, entreprise, partenaire ou ambassadeur.",
  },
  {
    title: "Trouver des talents",
    text: "Photo, peinture, sculpture, musique, animation, médiation : SUNNYVIBZ met en avant les activités qui font vivre le lieu.",
  },
  {
    title: "Créer des connexions",
    text: "Les besoins, compétences et annonces communautaires aident à former des équipes, projets et collaborations.",
  },
  {
    title: "Accéder au Market",
    text: "Les profils actifs deviennent la base des futures prestations, boutiques, services et ventes SUNNY Market.",
  },
] as const;

const userPath = [
  "Visiteur",
  "Adhérent",
  "Participant",
  "Abonné",
  "Créateur de projet",
  "Ambassadeur",
] as const;

export default async function CommunityPage() {
  const [profiles, posts] = await Promise.all([
    getCommunityProfiles(8),
    getCommunityPosts(6),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <section className="relative mb-16 overflow-hidden rounded-[2.5rem] border border-[#18f2a6]/18 bg-[radial-gradient(circle_at_12%_18%,rgba(24,242,166,0.20),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(255,217,120,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.02))] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-[#18f2a6]/18 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-80 w-80 rounded-full bg-[#ffd978]/12 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#18f2a6]">
              SUNNY Community
            </p>
            <h1 className="max-w-4xl text-balance text-4xl font-medium tracking-[-0.055em] text-[#fbf3df] sm:text-5xl lg:text-7xl">
              Le réseau vivant qui relie membres, talents, partenaires et projets.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#fbf3df]/70 sm:text-lg">
              La communauté devient le cœur de SUNNYVIBZ : on se présente, on trouve
              des compétences, on lance des appels, on prépare le Market et on transforme
              les rencontres en actions concrètes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/connexion"
                className="rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/12 px-5 py-3 text-sm font-bold text-[#18f2a6] shadow-[0_0_24px_rgba(24,242,166,0.16)] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/18"
              >
                Rejoindre la communauté
              </Link>
              <Link
                href="/marketplace"
                className="rounded-full border border-[#ffd978]/28 px-5 py-3 text-sm font-bold text-[#ffd978] transition hover:-translate-y-0.5 hover:bg-[#ffd978]/10"
              >
                Voir le Market
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/28 p-5 backdrop-blur">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffd978]">
              Parcours usager
            </p>
            <div className="mt-5 grid gap-3">
              {userPath.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#18f2a6]/24 bg-[#18f2a6]/10 text-xs font-black text-[#18f2a6]">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#fbf3df]/78">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {communityBenefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-3xl border border-[#ffd978]/16 bg-white/[0.045] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/35"
          >
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#fbf3df]">
              {benefit.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#fbf3df]/64">{benefit.text}</p>
          </article>
        ))}
      </section>

      <CommunityPostComposer />

      <section className="mb-16">
        <SectionHeading
          eyebrow="Profils actifs"
          title="Des membres visibles, plusieurs rôles, une vraie logique réseau."
          text="Un utilisateur ne se limite jamais à un seul rôle. Il peut être adhérent, talent, exposant, bénévole, partenaire ou porteur de projet selon son parcours."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {profiles.map((profile) => (
            <CommunityProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionHeading
          eyebrow="Fil communautaire"
          title="Les premiers appels à collaboration, annonces et opportunités."
          text="Cette base prépare le futur réseau social SUNNYVIBZ : photos, vidéos, projets, services, demandes de bénévoles et mises en relation."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/8 p-7 text-center shadow-[0_0_36px_rgba(24,242,166,0.08)] sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#18f2a6]">
          Suite logique
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-4xl">
          La Community connecte les profils au Market, aux ateliers, aux espaces et aux projets.
        </h2>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full border border-[#ffd978]/28 px-5 py-3 text-sm font-bold text-[#ffd978] transition hover:bg-[#ffd978]/10"
          >
            Proposer un partenariat
          </Link>
          <Link
            href="/ateliers"
            className="rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/12 px-5 py-3 text-sm font-bold text-[#18f2a6] transition hover:bg-[#18f2a6]/18"
          >
            Voir les ateliers
          </Link>
        </div>
      </section>
    </main>
  );
}
