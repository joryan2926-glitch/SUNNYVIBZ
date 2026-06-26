"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = {
  ok: false,
  message: "",
};

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Nom
          <input
            name="name"
            autoComplete="name"
            required
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Votre nom"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="vous@email.fr"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Sujet
          <input
            name="subject"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Adhésion, exposition, partenariat..."
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Message
          <textarea
            name="message"
            required
            minLength={10}
            rows={6}
            className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
            placeholder="Écrivez votre message..."
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#18f2a6]/55 bg-[#18f2a6]/14 px-6 text-sm font-black uppercase tracking-[0.14em] text-[#fbf3df] shadow-[0_0_34px_rgba(24,242,166,0.24)] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Envoi..." : "Envoyer le message"}
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
