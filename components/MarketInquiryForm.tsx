"use client";

import { useActionState } from "react";
import { submitMarketInquiry, type MarketInquiryState } from "@/lib/actions/market";

const initialState: MarketInquiryState = {
  ok: false,
  message: "",
};

export function MarketInquiryForm({ offerId, offerTitle }: { offerId: string; offerTitle: string }) {
  const [state, formAction, pending] = useActionState(submitMarketInquiry, initialState);

  return (
    <form id="demande" action={formAction} className="rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/[0.06] p-6 shadow-2xl shadow-black/25 sm:p-8">
      <input type="hidden" name="offer_id" value={offerId} />
      <p className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-[#18f2a6]">Demande Market</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">Parler de « {offerTitle} »</h2>
      <p className="mt-3 text-sm leading-7 text-[#fbf3df]/64">Décrivez votre besoin, votre délai ou votre projet. L’équipe coordonnera la suite avec le talent.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">Nom<input name="name" required autoComplete="name" className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60" placeholder="Votre nom" /></label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">Email<input name="email" type="email" required autoComplete="email" className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60" placeholder="vous@email.fr" /></label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78 sm:col-span-2">Téléphone (optionnel)<input name="phone" type="tel" autoComplete="tel" className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60" placeholder="06..." /></label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78 sm:col-span-2">Votre demande<textarea name="message" required minLength={10} rows={5} className="resize-none rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60" placeholder="Date, quantité, budget, format ou contexte..." /></label>
      </div>
      <button type="submit" disabled={pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/14 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/20 disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Envoi..." : "Envoyer la demande"}</button>
      {state.message ? <p role="status" aria-live="polite" className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${state.ok ? "border-[#18f2a6]/30 bg-[#18f2a6]/10 text-[#18f2a6]" : "border-red-300/30 bg-red-500/10 text-red-100"}`}>{state.message}</p> : null}
    </form>
  );
}
