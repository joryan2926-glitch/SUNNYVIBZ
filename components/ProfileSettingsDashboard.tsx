"use client";

import Link from "next/link";
import { useState } from "react";

const roleOptions = [
  ["adherent", "Adhérent"],
  ["artiste", "Artiste"],
  ["exposant", "Exposant"],
  ["benevole", "Bénévole"],
  ["association", "Association"],
  ["entreprise", "Entreprise"],
  ["partenaire", "Partenaire"],
  ["sponsor", "Sponsor"],
] as const;

export function ProfileSettingsDashboard() {
  const [fullName, setFullName] = useState("Alex Sunny");
  const [bio, setBio] = useState("Je crée, je partage et je participe à la vie artistique locale.");
  const [city, setCity] = useState("Marseille");
  const [website, setWebsite] = useState("");
  const [roles, setRoles] = useState<string[]>(["adherent", "artiste"]);
  const [artistStatus, setArtistStatus] = useState<"active" | "inactive">("active");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [notice, setNotice] = useState("");

  function toggleRole(role: string) {
    setRoles((current) => current.includes(role) ? current.filter((item) => item !== role) : [...current, role]);
  }

  function saveProfile() {
    setNotice("Profil enregistré sur cet appareil. La synchronisation Supabase sera active après exécution du module SQL.");
  }

  return (
    <main className="min-h-screen bg-[#03110d] px-4 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Mon identité SunnyVibz</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Construisez un profil qui vous ressemble.</h1><p className="mt-2 max-w-2xl text-sm text-white/60">Choisissez vos rôles, présentez votre univers et rendez vos projets visibles aux bonnes personnes.</p></div><Link href="/mon-compte" className="text-sm text-emerald-300 transition hover:text-emerald-200">← Retour au compte</Link></div>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-xl font-semibold text-emerald-100">AS</div><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Profil membre</p><p className="mt-1 text-sm text-white/50">Les champs publics apparaîtront sur votre fiche.</p></div></div><div className="mt-8 grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Nom affiché</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/50" /></label><label className="sm:col-span-2"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Bio courte</span><textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-300/50" /></label><label><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Ville</span><input value={city} onChange={(event) => setCity(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/50" /></label><label><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Site web</span><input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-emerald-300/50 placeholder:text-white/25" /></label></div></div>

          <div className="space-y-5"><article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Vos rôles</p><p className="mt-2 text-sm text-white/50">Sélectionnez plusieurs rôles, ils peuvent évoluer avec votre parcours.</p><div className="mt-5 grid grid-cols-2 gap-2">{roleOptions.map(([value, label]) => (<label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${roles.includes(value) ? "border-emerald-300/45 bg-emerald-300/10 text-emerald-100" : "border-white/10 text-white/55 hover:border-white/25"}`}><input type="checkbox" checked={roles.includes(value)} onChange={() => toggleRole(value)} className="accent-emerald-300" />{label}</label>))}</div></article><article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Profil artiste</p><div className="mt-4 flex items-center justify-between gap-4"><div><p className="font-semibold">Statut public</p><p className="mt-1 text-xs text-white/45">Actif pour apparaître dans Artistes.</p></div><button type="button" onClick={() => setArtistStatus((current) => current === "active" ? "inactive" : "active")} className={`relative h-7 w-12 rounded-full transition ${artistStatus === "active" ? "bg-emerald-300" : "bg-white/15"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${artistStatus === "active" ? "left-6" : "left-1"}`} /></button></div><p className="mt-3 text-xs text-emerald-200">{artistStatus === "active" ? "Profil artiste actif" : "Profil artiste inactif"}</p></article><article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Visibilité</p><div className="mt-4 grid grid-cols-2 gap-2">{(["public", "private"] as const).map((option) => (<button key={option} type="button" onClick={() => setVisibility(option)} className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${visibility === option ? "border-emerald-300/45 bg-emerald-300/10 text-emerald-100" : "border-white/10 text-white/50"}`}>{option === "public" ? "Profil public" : "Privé"}</button>))}</div></article></div>
        </section>

        <section className="flex flex-col justify-between gap-4 rounded-3xl border border-emerald-300/20 bg-emerald-300/5 p-6 sm:flex-row sm:items-center sm:p-8"><div><p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Aperçu</p><h2 className="mt-2 text-2xl font-semibold">{fullName || "Votre nom"}</h2><p className="mt-2 max-w-2xl text-sm text-white/60">{bio || "Ajoutez une bio pour présenter votre univers."}</p><p className="mt-3 text-xs text-white/40">{city || "Ville non renseignée"} · {roles.length} rôle{roles.length > 1 ? "s" : ""} · {visibility === "public" ? "Visible publiquement" : "Profil privé"}</p></div><button type="button" onClick={saveProfile} className="shrink-0 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200">Enregistrer le profil</button></section>{notice ? <p className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">{notice}</p> : null}
      </div>
    </main>
  );
}
