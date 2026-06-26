"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Mode = "signin" | "signup";

export function AuthPanel() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo:
                typeof window !== "undefined" ? `${window.location.origin}/mon-compte` : undefined,
            },
          });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage(
        mode === "signin"
          ? "Connexion réussie. Vous pouvez accéder à votre compte."
          : "Inscription créée. Vérifiez votre email si Supabase demande une confirmation.",
      );
    }

    setPending(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMessage("Vous êtes déconnecté.");
  }

  if (loading) {
    return <p className="text-sm text-[#fbf3df]/70">Chargement de la session...</p>;
  }

  if (session) {
    return (
      <div className="premium-card rounded-[2rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-7 shadow-2xl shadow-black/30">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Connecté
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {session.user.email}
        </h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/mon-compte"
            className="rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
          >
            Mon compte
          </a>
          <button
            type="button"
            onClick={signOut}
            className="rounded-full border border-[#ffd978]/36 bg-[#ffd978]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#ffd978]"
          >
            Déconnexion
          </button>
        </div>
        {message ? <p className="mt-5 text-sm text-[#fbf3df]/70">{message}</p> : null}
      </div>
    );
  }

  return (
    <div className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-6 flex gap-2 rounded-full border border-white/10 bg-black/20 p-1">
        {(["signin", "signup"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`flex-1 rounded-full px-4 py-3 text-xs font-black uppercase tracking-[0.14em] transition ${
              mode === item ? "bg-[#18f2a6]/16 text-[#18f2a6]" : "text-[#fbf3df]/62"
            }`}
          >
            {item === "signin" ? "Connexion" : "Inscription"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full border border-[#18f2a6]/45 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Traitement..." : mode === "signin" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      {message ? <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#fbf3df]/70">{message}</p> : null}
    </div>
  );
}
