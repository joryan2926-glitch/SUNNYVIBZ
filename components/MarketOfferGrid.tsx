"use client";

import { useMemo, useState } from "react";
import type { MarketOffer } from "@/lib/supabase/types";
import { MarketOfferCard } from "@/components/MarketOfferCard";

export function MarketOfferGrid({ offers }: { offers: MarketOffer[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes");
  const categories = ["Toutes", ...Array.from(new Set(offers.map((offer) => offer.category).filter(Boolean) as string[]))];
  const filtered = useMemo(() => offers.filter((offer) => {
    const haystack = `${offer.title} ${offer.seller_name} ${offer.short_description} ${offer.category ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (category === "Toutes" || offer.category === category);
  }), [category, offers, query]);

  return <><div className="mb-7 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-[1fr_auto] md:items-center"><label className="sr-only" htmlFor="market-search">Rechercher une offre</label><input id="market-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une création, un talent, une prestation..." className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df] outline-none focus:border-[#18f2a6]/50" /><div className="flex flex-wrap gap-2">{categories.map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${category === item ? "border-[#18f2a6]/45 bg-[#18f2a6]/10 text-[#18f2a6]" : "border-white/10 text-[#fbf3df]/55 hover:border-white/25"}`}>{item}</button>)}</div></div><p className="mb-5 text-sm text-[#fbf3df]/50">{filtered.length} offre{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}</p><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filtered.map((offer) => <MarketOfferCard key={offer.id} offer={offer} />)}</div>{filtered.length === 0 ? <p className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-[#fbf3df]/60">Aucune offre ne correspond à votre recherche.</p> : null}</>;
}
