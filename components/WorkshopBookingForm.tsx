"use client";

import { useActionState } from "react";
import { reserveWorkshop, type BookingFormState } from "@/lib/actions/bookings";
import type { Workshop } from "@/lib/supabase/types";

const initialState: BookingFormState = {
  ok: false,
  message: "",
};

export function WorkshopBookingForm({ workshop }: { workshop: Workshop }) {
  const [state, formAction, pending] = useActionState(reserveWorkshop, initialState);
  const isFull = workshop.status !== "available" || workshop.seats_remaining <= 0;

  return (
    <form
      action={formAction}
      className="premium-card rounded-[2rem] border border-[#18f2a6]/20 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <input type="hidden" name="workshop_id" value={workshop.id} />
      <div>
        <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#ffd978]">
          Réserver
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {workshop.title}
        </h2>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Nom
          <input
            name="name"
            required
            autoComplete="name"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Votre nom"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="vous@email.fr"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Téléphone
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="06..."
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending || isFull}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/14 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.24)] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/20 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isFull ? "Atelier complet" : pending ? "Réservation..." : "Réserver"}
      </button>

      {state.message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            state.ok
              ? "border-[#18f2a6]/30 bg-[#18f2a6]/10 text-[#18f2a6]"
              : "border-red-300/30 bg-red-500/10 text-red-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
