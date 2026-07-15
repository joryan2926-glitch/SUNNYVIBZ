import Image from "next/image";
import Link from "next/link";
import type { CommunityProfile } from "@/lib/supabase/types";

const profileTypeLabels: Record<CommunityProfile["profile_type"], string> = {
  adherent: "Adhérent",
  artiste: "Talent",
  association: "Association",
  entreprise: "Entreprise",
  partenaire: "Partenaire",
  benevole: "Bénévole",
  admin: "Équipe",
};

export function CommunityProfileCard({ profile }: { profile: CommunityProfile }) {
  const initials = profile.display_name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="premium-card group overflow-hidden rounded-[2rem] border border-[#18f2a6]/18 bg-white/[0.052] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/50">
      <div className="relative h-64 overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(24,242,166,0.24),transparent_34%),linear-gradient(135deg,rgba(255,217,120,0.18),rgba(3,4,3,0.94))]">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.display_name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-92 transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-5xl font-light tracking-[-0.06em] text-[#ffd978] drop-shadow-[0_0_24px_rgba(255,217,120,0.42)]">
            {initials}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-[#18f2a6]/35 bg-[#03100c]/70 px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#18f2a6] backdrop-blur">
          {profileTypeLabels[profile.profile_type]}
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {profile.roles.slice(0, 3).map((role) => (
            <span
              key={role}
              className="rounded-full border border-[#ffd978]/20 bg-[#ffd978]/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#ffd978]"
            >
              {role}
            </span>
          ))}
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {profile.display_name}
        </h3>
        <p className="mt-2 text-sm font-semibold text-[#18f2a6]">
          {profile.headline ?? "Membre SUNNYVIBZ"}
        </p>
        <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#fbf3df]/66">{profile.bio}</p>

        <div className="mt-5 grid gap-3 text-xs text-[#fbf3df]/66">
          {profile.skills.length > 0 ? (
            <div>
              <p className="mb-2 font-black uppercase tracking-[0.16em] text-[#fbf3df]/44">
                Propose
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="rounded-full bg-white/[0.055] px-3 py-1.5">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {profile.needs.length > 0 ? (
            <div>
              <p className="mb-2 font-black uppercase tracking-[0.16em] text-[#fbf3df]/44">
                Recherche
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.needs.slice(0, 4).map((need) => (
                  <span key={need} className="rounded-full bg-[#18f2a6]/8 px-3 py-1.5 text-[#18f2a6]">
                    {need}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#fbf3df]/48">
            {profile.location ?? "SUNNYVIBZ"}
          </span>
          <Link
            href="/contact"
            className="rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/10 px-4 py-2 text-sm font-semibold text-[#18f2a6] transition hover:bg-[#18f2a6]/18"
          >
            Contacter
          </Link>
        </div>
      </div>
    </article>
  );
}
