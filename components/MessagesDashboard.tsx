"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type Conversation = { id: string; subject: string | null; created_by: string; updated_at: string };
type MemberRow = { conversation_id: string; last_read_at: string | null; conversations: Conversation | null };
type MessageRow = { id: string; conversation_id: string; sender_id: string; body: string; created_at: string };
type Result<T> = { data: T | null; error: { message: string } | null };
type MemberClient = { from: (table: "conversation_members") => { select: (columns: string) => { eq: (column: string, value: string) => Promise<Result<MemberRow[]>> }; insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } };
type MessageClient = { from: (table: "messages") => { select: (columns: string) => { eq: (column: string, value: string) => { order: (column: string, options: { ascending: boolean }) => Promise<Result<MessageRow[]>> } }; insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }> } };
type ConversationClient = { from: (table: "conversations") => { insert: (payload: Record<string, unknown>) => { select: (columns: string) => { single: () => Promise<Result<Conversation>> } } } };

const formatter = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export function MessagesDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");

  const loadConversations = useCallback(async (userId: string) => {
    const client = supabase as unknown as MemberClient;
    const { data, error } = await client.from("conversation_members").select("conversation_id,last_read_at,conversations(id,subject,created_by,updated_at)").eq("user_id", userId);
    if (error) { setNotice("Les conversations ne sont pas encore disponibles. Vérifiez le SQL messagerie."); return []; }
    const rows = (data ?? []).map((row) => row.conversations).filter((conversation): conversation is Conversation => Boolean(conversation));
    setConversations(rows);
    setSelectedId((current) => current && rows.some((conversation) => conversation.id === current) ? current : rows[0]?.id ?? "");
    return rows;
  }, [supabase]);

  const loadMessages = useCallback(async (conversationId: string) => {
    const client = supabase as unknown as MessageClient;
    const { data, error } = await client.from("messages").select("id,conversation_id,sender_id,body,created_at").eq("conversation_id", conversationId).order("created_at", { ascending: true });
    if (error) { setNotice("Les messages ne peuvent pas être chargés pour cette conversation."); return; }
    setMessages(data ?? []);
  }, [supabase]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      if (data.session) {
        const rows = await loadConversations(data.session.user.id);
        if (rows[0]) await loadMessages(rows[0].id);
      }
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [loadConversations, loadMessages, supabase]);

  useEffect(() => {
    if (!selectedId || !session) return;
    const channel = supabase.channel(`sunny-messages-${selectedId}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${selectedId}` }, (payload) => {
      const incoming = payload.new as MessageRow;
      setMessages((current) => current.some((message) => message.id === incoming.id) ? current : [...current, incoming]);
    }).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [selectedId, session, supabase]);

  async function selectConversation(conversationId: string) {
    setMessages([]);
    setSelectedId(conversationId);
    await loadMessages(conversationId);
  }

  async function createConversation() {
    if (!session) return;
    setPending(true);
    setNotice("");
    const conversationClient = supabase as unknown as ConversationClient;
    const memberClient = supabase as unknown as MemberClient;
    const created = await conversationClient.from("conversations").insert({ subject: "Demande SunnyVibz", context_type: "support", created_by: session.user.id }).select("id,subject,created_by,updated_at").single();
    if (created.error || !created.data) { setPending(false); setNotice("La conversation ne peut pas être créée. Vérifiez les policies RLS."); return; }
    const memberResult = await memberClient.from("conversation_members").insert({ conversation_id: created.data.id, user_id: session.user.id });
    if (memberResult.error) { setPending(false); setNotice("La conversation a été créée mais le membre n’a pas pu être ajouté."); return; }
    await loadConversations(session.user.id);
    setSelectedId(created.data.id);
    await loadMessages(created.data.id);
    setPending(false);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedId || !session) return;
    setPending(true);
    const client = supabase as unknown as MessageClient;
    const { error } = await client.from("messages").insert({ conversation_id: selectedId, sender_id: session.user.id, body });
    setPending(false);
    if (error) { setNotice("Le message n’a pas pu être envoyé."); return; }
    setDraft("");
  }

  if (loading) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-sm text-white/60 sm:px-8">Chargement de vos conversations...</main>;
  if (!session) return <main className="min-h-screen bg-[#03110d] px-4 py-16 text-white sm:px-8"><div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Community</p><h1 className="mt-3 text-3xl font-semibold">Connectez-vous pour accéder à vos messages.</h1><Link href="/connexion" className="mt-7 inline-flex rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017]">Se connecter</Link></div></main>;

  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? null;
  return <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl space-y-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">SUNNY Community</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Des échanges qui font avancer vos projets.</h1><p className="mt-2 max-w-2xl text-sm text-white/60">Vos conversations sont maintenant synchronisées avec Supabase.</p></div><Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link></div><section className="grid min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] md:grid-cols-[280px_1fr]"><aside className="border-b border-white/10 md:border-b-0 md:border-r"><div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Messages</p><p className="mt-1 text-sm text-white/50">{conversations.length} conversation{conversations.length > 1 ? "s" : ""}</p></div><button type="button" disabled={pending} onClick={createConversation} className="grid h-9 w-9 place-items-center rounded-full border border-emerald-300/30 text-lg text-emerald-200 transition hover:bg-emerald-300/10 disabled:opacity-50">+</button></div><div className="p-3">{conversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => void selectConversation(conversation.id)} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition ${selectedId === conversation.id ? "bg-emerald-300/10" : "hover:bg-white/[0.04]"}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-xs font-semibold text-emerald-100">SV</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{conversation.subject || "Conversation SunnyVibz"}</span><span className="mt-1 block text-xs text-white/45">{formatter.format(new Date(conversation.updated_at))}</span></span></button>)}</div></aside><div className="flex min-h-[620px] flex-col"><header className="border-b border-white/10 p-5"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Conversation</p><h2 className="mt-2 font-semibold">{selected?.subject || "Nouvelle conversation"}</h2></header><div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-8">{selected ? messages.map((message) => { const fromMe = message.sender_id === session.user.id; return <div key={message.id} className={`flex ${fromMe ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${fromMe ? "rounded-br-md bg-emerald-300 text-[#032017]" : "rounded-bl-md border border-white/10 bg-white/[0.06] text-white/80"}`}><p>{message.body}</p><p className={`mt-1 text-[10px] ${fromMe ? "text-[#032017]/60" : "text-white/35"}`}>{formatter.format(new Date(message.created_at))}</p></div></div>; }) : <div className="flex h-full items-center justify-center text-center text-sm text-white/45">Créez une conversation avec le bouton +.</div>}</div><form onSubmit={sendMessage} className="border-t border-white/10 p-4 sm:p-5"><div className="flex items-end gap-3"><textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={1} disabled={!selected || pending} placeholder={selected ? "Écrire un message…" : "Créez d’abord une conversation"} className="min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-emerald-300/45 disabled:opacity-50" /><button type="submit" disabled={!selected || pending} className="rounded-full bg-emerald-300 px-5 py-3 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200 disabled:opacity-50">Envoyer</button></div>{notice ? <p role="status" aria-live="polite" className="mt-3 text-xs text-emerald-200/80">{notice}</p> : <p className="mt-3 text-xs text-white/35">Les nouveaux messages se synchronisent en temps réel lorsque Realtime est activé.</p>}</form></div></section></div></main>;
}
