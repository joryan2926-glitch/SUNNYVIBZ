"use client";

import { ChangeEvent, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function TalentMediaUploader({ session }: { session: Session }) {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [lastUrl, setLastUrl] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPending(true);
    setMessage("");
    setLastUrl("");

    const safeName = file.name.replace(/[^a-z0-9.\-_]/gi, "-").toLowerCase();
    const path = `${session.user.id}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from("talent-media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      setMessage(
        "Upload impossible pour le moment. Exécutez le SQL Supabase pour créer le bucket talent-media et ses policies.",
      );
      setPending(false);
      return;
    }

    const { data } = supabase.storage.from("talent-media").getPublicUrl(path);
    setLastUrl(data.publicUrl);
    setMessage("Média envoyé. Il pourra ensuite être relié à votre profil talent.");
    setPending(false);
  }

  return (
    <section className="premium-card rounded-[2rem] border border-[#ffd978]/18 bg-white/[0.055] p-7 shadow-2xl shadow-black/30">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
        Médias talent
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
        Ajouter une photo ou une vidéo.
      </h2>
      <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">
        Cet upload prépare le futur réseau social SUNNYVIBZ : portfolios, coulisses, vidéos,
        créations et publications reliées aux profils talents.
      </p>
      <label className="mt-6 inline-flex cursor-pointer rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5">
        {pending ? "Envoi..." : "Choisir un média"}
        <input
          type="file"
          accept="image/*,video/*"
          className="sr-only"
          disabled={pending}
          onChange={handleUpload}
        />
      </label>
      {message ? (
        <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#fbf3df]/70">
          {message}
        </p>
      ) : null}
      {lastUrl ? (
        <a
          href={lastUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 block text-sm font-semibold text-[#18f2a6]"
        >
          Voir le média envoyé
        </a>
      ) : null}
    </section>
  );
}
