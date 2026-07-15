"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = readonly [string, string];

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]">
        {open ? "Fermer" : "Menu"}
      </button>
      {open ? <nav id="mobile-navigation" aria-label="Navigation mobile" className="absolute inset-x-0 top-full border-b border-[#ffd978]/15 bg-[#030403]/95 p-4 shadow-2xl backdrop-blur-2xl"><div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">{items.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-sm font-semibold text-[#fbf3df]/80 transition hover:bg-[#18f2a6]/10 hover:text-[#18f2a6]">{label}</Link>)}<Link href="/connexion" onClick={() => setOpen(false)} className="rounded-2xl border border-[#ffd978]/28 bg-[#ffd978]/10 px-4 py-3 text-sm font-semibold text-[#ffd978]">Connexion</Link></div></nav> : null}
    </div>
  );
}
