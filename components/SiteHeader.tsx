import Link from "next/link";
import { SunnyLogo } from "./SunnyLogo";

const navItems = [
  ["Accueil", "/"],
  ["À propos", "/a-propos"],
  ["Agenda", "/agenda"],
  ["Galerie", "/galerie"],
  ["Talents", "/talents"],
  ["Partenaires", "/partenaires"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ffd978]/15 bg-[#030403]/82 shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil SUNNYVIBZ">
          <SunnyLogo />
          <span>
            <strong className="block text-lg font-semibold tracking-[0.18em] text-[#ffd978] drop-shadow-[0_0_16px_rgba(255,217,120,0.48)] sm:text-xl">
              SUNNYVIBZ
            </strong>
            <small className="block text-xs uppercase tracking-[0.22em] text-[#d8a62a]">
              Pôle Art & Culture
            </small>
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#fbf3df]/72 sm:gap-4"
          aria-label="Navigation principale"
        >
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-transparent px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-[#18f2a6]/30 hover:bg-[#18f2a6]/10 hover:text-[#18f2a6]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
