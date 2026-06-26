import Link from "next/link";
import { SunnyLogo } from "./SunnyLogo";

const socials = [
  ["Instagram", "https://instagram.com/"],
  ["TikTok", "https://www.tiktok.com/"],
  ["Facebook", "https://www.facebook.com/"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffd978]/15 bg-black/35 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <SunnyLogo />
            <span>
              <strong className="block tracking-[0.18em] text-[#ffd978]">SUNNYVIBZ</strong>
              <small className="text-xs uppercase tracking-[0.18em] text-[#d8a62a]">
                Pôle Art & Culture
              </small>
            </span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-[#fbf3df]/64">
            Une plateforme culturelle pour créer, exposer, transmettre, connecter les talents,
            les partenaires et faire rayonner les projets locaux.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-sm uppercase tracking-[0.18em] text-[#ffd978]">Navigation</h2>
          <div className="grid gap-2 text-sm text-[#fbf3df]/70">
            <Link href="/a-propos">À propos</Link>
            <Link href="/agenda">Agenda</Link>
            <Link href="/ateliers">Ateliers</Link>
            <Link href="/articles">Articles</Link>
            <Link href="/galerie">Galerie</Link>
            <Link href="/marketplace">Market</Link>
            <Link href="/talents">Talents</Link>
            <Link href="/abonnements">Abonnements</Link>
            <Link href="/partenaires">Partenaires</Link>
            <Link href="/connexion">Connexion</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-sm uppercase tracking-[0.18em] text-[#ffd978]">Réseaux</h2>
          <div className="flex flex-wrap gap-3">
            {socials.map(([label, href]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#18f2a6]/25 px-4 py-2 text-sm text-[#18f2a6] transition hover:bg-[#18f2a6]/10"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
