"use client";

import { useActionState } from "react";
import { reserveSpace, type SpaceBookingFormState } from "@/lib/actions/space-bookings";
import type { Space } from "@/lib/supabase/types";

const initialState: SpaceBookingFormState = {
  ok: false,
  message: "",
};

export function SpaceBookingForm({ space }: { space: Space }) {
  const [state, formAction, pending] = useActionState(reserveSpace, initialState);
  const isFull = space.status !== "available" || space.slots_remaining <= 0;

  return (
    <form
      action={formAction}
      className="premium-card rounded-[2rem] border border-[#18f2a6]/20 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <input type="hidden" name="space_id" value={space.id} />
      <div>
        <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#ffd978]">
          Réserver un espace
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {space.title}
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
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Date souhaitée
          <input
            name="requested_date"
            type="date"
            required
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Créneau
          <select
            name="requested_time_slot"
            required
            defaultValue=""
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
          >
            <option value="" disabled>
              Choisir un créneau
            </option>
            <option value="matin">Matin</option>
            <option value="apres-midi">Après-midi</option>
            <option value="soiree">Soirée</option>
            <option value="journee">Journée complète</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Votre formule SunnyVibz
          <select
            name="subscription_plan_slug"
            defaultValue=""
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
          >
            <option value="">Sans abonnement / à confirmer</option>
            <option value="essentielle">Essentielle</option>
            <option value="creative">Créative — priorité</option>
            <option value="premium">Premium — priorité forte</option>
            <option value="annuelle">Annuelle</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Usage prévu
          <textarea
            name="intended_use"
            rows={4}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Atelier, répétition, réunion, exposition, shooting, résidence..."
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-[#ffd978]/16 bg-[#ffd978]/10 p-4 text-xs leading-6 text-[#fbf3df]/70">
        <p>Réservation obligatoire · {space.slots_remaining} créneau(x) disponible(s).</p>
        <p>Les demandes sont confirmées après vérification de la capacité et du type d’usage.</p>
      </div>

      <button
        type="submit"
        disabled={pending || isFull}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/14 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.24)] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/20 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isFull ? "Espace complet" : pending ? "Demande..." : "Demander une réservation"}
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
