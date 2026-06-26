"use client";

import { useActionState } from "react";
import {
  submitSunnyFridayApplication,
  type SunnyFridayApplicationState,
} from "@/lib/actions/sunny-friday";

const initialState: SunnyFridayApplicationState = {
  ok: false,
  message: "",
};

export function SunnyFridayApplicationForm() {
  const [state, formAction, pending] = useActionState(submitSunnyFridayApplication, initialState);

  return (
    <form
      action={formAction}
      className="premium-card rounded-[2rem] border border-[#18f2a6]/20 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
    >
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
        Candidature exposant
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
        Réserver un stand Sunny Friday.
      </h2>

      <div className="mt-6 grid gap-4">
        {[
          ["name", "Nom", "Votre nom"],
          ["email", "Email", "vous@email.fr"],
          ["phone", "Téléphone", "06..."],
          ["project_name", "Nom du projet", "Nom de votre marque, collectif ou activité"],
          ["discipline", "Discipline", "Photo, peinture, musique, sculpture, mode..."],
        ].map(([name, label, placeholder]) => (
          <label key={name} className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
            {label}
            <input
              name={name}
              type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
              required={name === "name" || name === "email" || name === "project_name"}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
              placeholder={placeholder}
            />
          </label>
        ))}

        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Besoins / message
          <textarea
            name="needs"
            rows={4}
            className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Stand, électricité, accroche, démonstration, performance..."
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/14 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.24)] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer ma candidature"}
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
