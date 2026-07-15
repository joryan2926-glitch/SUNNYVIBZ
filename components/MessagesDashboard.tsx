"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Conversation = {
  id: string;
  name: string;
  role: string;
  initials: string;
  preview: string;
  time: string;
  unread: number;
  messages: { fromMe: boolean; text: string; time: string }[];
};

const initialConversations: Conversation[] = [
  {
    id: "sunny-team",
    name: "Équipe SunnyVibz",
    role: "Coordination",
    initials: "SV",
    preview: "Votre réservation Creative Lab est confirmée.",
    time: "10:42",
    unread: 2,
    messages: [
      { fromMe: false, text: "Bonjour ! Votre réservation Creative Lab est confirmée pour vendredi.", time: "10:40" },
      { fromMe: false, text: "Avez-vous besoin d’un chevalet ou d’un accompagnement matériel ?", time: "10:42" },
    ],
  },
  {
    id: "maya-sol",
    name: "Maya Sol",
    role: "Artiste partenaire",
    initials: "MS",
    preview: "Merci pour ton retour sur le projet.",
    time: "Hier",
    unread: 0,
    messages: [{ fromMe: false, text: "Merci pour ton retour sur le projet, on se retrouve au prochain atelier.", time: "Hier" }],
  },
  {
    id: "market-support",
    name: "Support Market",
    role: "Sunny Market",
    initials: "SM",
    preview: "Votre demande est en cours de traitement.",
    time: "12 juin",
    unread: 0,
    messages: [{ fromMe: false, text: "Votre demande est en cours de traitement. Nous revenons vers vous rapidement.", time: "12 juin" }],
  },
];

export function MessagesDashboard() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0].id);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const selected = useMemo(() => conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0], [conversations, selectedId]);

  function selectConversation(id: string) {
    setSelectedId(id);
    setConversations((current) => current.map((conversation) => conversation.id === id ? { ...conversation, unread: 0 } : conversation));
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setConversations((current) => current.map((conversation) => conversation.id === selected.id ? { ...conversation, preview: text, time: "À l’instant", messages: [...conversation.messages, { fromMe: true, text, time: "À l’instant" }] } : conversation));
    setDraft("");
    setNotice("Message enregistré dans votre fil. La synchronisation temps réel sera activée avec Supabase.");
  }

  return (
    <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Community</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Des échanges qui font avancer vos projets.</h1><p className="mt-2 max-w-2xl text-sm text-white/60">Échangez avec l’équipe, les artistes et les partenaires depuis un espace simple et centralisé.</p></div>
          <Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link>
        </div>

        <section className="grid min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] md:grid-cols-[280px_1fr]">
          <aside className="border-b border-white/10 md:border-b-0 md:border-r"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Messages</p><p className="mt-1 text-sm text-white/50">{conversations.length} conversations</p></div><button type="button" onClick={() => setNotice("La création d’une conversation sera disponible avec les profils Supabase.")} className="grid h-9 w-9 place-items-center rounded-full border border-emerald-300/30 text-lg text-emerald-200 transition hover:bg-emerald-300/10">+</button></div><div className="p-3">{conversations.map((conversation) => (<button key={conversation.id} type="button" onClick={() => selectConversation(conversation.id)} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${selected.id === conversation.id ? "bg-emerald-300/10" : "hover:bg-white/[0.04]"}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-xs font-semibold text-emerald-100">{conversation.initials}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold">{conversation.name}</span><span className="text-[10px] text-white/35">{conversation.time}</span></span><span className="mt-1 block truncate text-xs text-white/45">{conversation.preview}</span>{conversation.unread > 0 ? <span className="mt-2 inline-flex rounded-full bg-emerald-300 px-1.5 py-0.5 text-[10px] font-bold text-[#032017]">{conversation.unread} nouveau{conversation.unread > 1 ? "x" : ""}</span> : null}</span></button>))}</div></aside>

          <div className="flex min-h-[620px] flex-col"><header className="flex items-center gap-3 border-b border-white/10 p-5"><span className="grid h-11 w-11 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-sm font-semibold text-emerald-100">{selected.initials}</span><div><h2 className="font-semibold">{selected.name}</h2><p className="text-xs text-white/45">{selected.role} · Répond généralement sous 24h</p></div></header><div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-8">{selected.messages.map((message, index) => (<div key={`${message.time}-${index}`} className={`flex ${message.fromMe ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.fromMe ? "rounded-br-md bg-emerald-300 text-[#032017]" : "rounded-bl-md border border-white/10 bg-white/[0.06] text-white/80"}`}><p>{message.text}</p><p className={`mt-1 text-[10px] ${message.fromMe ? "text-[#032017]/60" : "text-white/35"}`}>{message.time}</p></div></div>))}</div><form onSubmit={sendMessage} className="border-t border-white/10 p-4 sm:p-5"><div className="flex items-end gap-3"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} placeholder="Écrire un message…" className="min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/45" /><button type="submit" className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200">Envoyer</button></div>{notice ? <p className="mt-3 text-xs text-emerald-200/80">{notice}</p> : <p className="mt-3 text-xs text-white/35">Les échanges restent privés et seront protégés par les policies RLS Supabase.</p>}</form></div>
        </section>
      </div>
    </main>
  );
}
