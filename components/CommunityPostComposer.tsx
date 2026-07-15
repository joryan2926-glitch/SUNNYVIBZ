"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export function CommunityPostComposer() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Appel à collaboration");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setNotice("Connectez-vous pour publier dans la communauté.");
      return;
    }
    if (title.trim().length < 4 || content.trim().length < 12) {
      setNotice("Ajoutez un titre et un message suffisamment détaillé.");
      return;
    }
    setPending(true);
    setNotice("");
    const { error } = await supabase.from("community_posts").insert({
      author_user_id: session.user.id,
      author_name: session.user.email?.split("@")[0] ?? "Membre SunnyVibz",
      author_role: "Membre",
      title: title.trim(),
      content: content.trim(),
      category,
      call_to_action_label: null,
      call_to_action_href: null,
      published: false,
    });
    setPending(false);
    if (error) {
      setNotice("La publication n’a pas pu être enregistrée. Vérifiez les policies Communauté.");
      return;
    }
    setTitle("");
    setContent("");
    setNotice("Publication envoyée à la modération. Elle apparaîtra après validation.");
  }

  return (
    <section className="mb-16 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/[0.06] p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Publier</p><h2 className="mt-2 text-2xl font-semibold text-[#fbf3df]">Partager une idée, une recherche ou une opportunité.</h2></div><p className="text-xs text-[#fbf3df]/45">Publication modérée par SunnyVibz</p></div>
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">Titre<input value={title} onChange={(event) => setTitle(event.target.value)} required minLength={4} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[#fbf3df] outline-none focus:border-emerald-300/50" placeholder="Je cherche un photographe..." /></label><label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78">Catégorie<select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[#fbf3df] outline-none focus:border-emerald-300/50"><option>Appel à collaboration</option><option>Projet</option><option>Événement</option><option>Service</option><option>Bénévolat</option></select></label><label className="grid gap-2 text-sm font-semibold text-[#fbf3df]/78 sm:col-span-2">Message<textarea value={content} onChange={(event) => setContent(event.target.value)} required minLength={12} rows={4} className="resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-[#fbf3df] outline-none focus:border-emerald-300/50" placeholder="Décrivez votre besoin, votre projet ou votre proposition..." /></label><div className="flex flex-wrap items-center gap-4 sm:col-span-2"><button type="submit" disabled={pending} className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200 disabled:opacity-60">{pending ? "Publication..." : "Envoyer à la modération"}</button>{notice ? <p role="status" aria-live="polite" className="text-sm text-emerald-100">{notice}</p> : null}</div></form>
    </section>
  );
}
