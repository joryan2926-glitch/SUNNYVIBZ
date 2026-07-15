"use client";

import { useMemo, useState } from "react";
import type { Workshop } from "@/lib/supabase/types";
import { WorkshopCard } from "@/components/WorkshopCard";

export function WorkshopGrid({ workshops }: { workshops: Workshop[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => workshops.filter((workshop) => `${workshop.title} ${workshop.description} ${workshop.location}`.toLowerCase().includes(query.toLowerCase())), [query, workshops]);
  return <><div className="mb-7"><label className="sr-only" htmlFor="workshop-search">Rechercher un atelier</label><input id="workshop-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un atelier, une discipline, un lieu..." className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#fbf3df] outline-none focus:border-[#18f2a6]/50" /></div><p className="mb-5 text-sm text-[#fbf3df]/50">{filtered.length} atelier{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{filtered.map((workshop) => <WorkshopCard workshop={workshop} key={workshop.id} />)}</div>{filtered.length === 0 ? <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-[#fbf3df]/60">Aucun atelier ne correspond à votre recherche.</p> : null}</>;
}
