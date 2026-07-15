"use client";

import { useMemo, useState } from "react";
import type { Artist } from "@/lib/supabase/types";
import { ArtistCard } from "@/components/ArtistCard";

export function TalentGrid({ talents }: { talents: Artist[] }) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState("Toutes");
  const disciplines = ["Toutes", ...Array.from(new Set(talents.map((talent) => talent.specialty).filter(Boolean) as string[]))];
  const filtered = useMemo(() => talents.filter((talent) => `${talent.name} ${talent.bio} ${talent.specialty}`.toLowerCase().includes(query.toLowerCase()) && (discipline === "Toutes" || talent.specialty === discipline)), [discipline, query, talents]);
  return <><div className="mb-7 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto] md:items-center"><label className="sr-only" htmlFor="talent-search">Rechercher un talent</label><input id="talent-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un talent ou une discipline..." className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df] outline-none focus:border-[#18f2a6]/50" /><div className="flex flex-wrap gap-2">{disciplines.map((item) => <button type="button" key={item} onClick={() => setDiscipline(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${discipline === item ? "border-[#18f2a6]/45 bg-[#18f2a6]/10 text-[#18f2a6]" : "border-white/10 text-[#fbf3df]/55 hover:border-white/25"}`}>{item}</button>)}</div></div><p className="mb-5 text-sm text-[#fbf3df]/50">{filtered.length} talent{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((talent) => <ArtistCard artist={talent} key={talent.id} />)}</div>{filtered.length === 0 ? <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-[#fbf3df]/60">Aucun talent ne correspond à votre recherche.</p> : null}</>;
}
