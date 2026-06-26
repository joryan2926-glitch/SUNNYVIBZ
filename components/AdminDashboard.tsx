"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const modules = [
  ["Ateliers", "Créer, publier, suivre les places et les statuts."],
  ["Réservations", "Consulter les demandes, confirmer ou annuler."],
  ["Sunny Friday", "Suivre les candidatures exposants et préparer les stands."],
  ["Articles", "Rédiger, publier ou garder en brouillon."],
  ["Talents", "Activer, désactiver et gérer les profils média."],
  ["Abonnements", "Gérer les formules et les abonnements utilisateurs."],
] as const;

const adminCreateForms = [
  {
    table: "workshops",
    title: "Créer un atelier",
    fields: [
      ["title", "Titre"],
      ["slug", "Slug"],
      ["description", "Description"],
      ["image_url", "Image URL"],
      ["start_date", "Date ISO"],
      ["location", "Lieu"],
      ["price_label", "Prix"],
      ["capacity", "Places"],
    ],
    defaults: {
      seats_remaining: 12,
      status: "available",
      published: true,
    },
  },
  {
    table: "articles",
    title: "Créer un article",
    fields: [
      ["title", "Titre"],
      ["slug", "Slug"],
      ["excerpt", "Résumé"],
      ["image_url", "Image URL"],
      ["category", "Catégorie"],
      ["author", "Auteur"],
      ["content", "Contenu"],
    ],
    defaults: {
      status: "published",
      published_at: new Date().toISOString(),
    },
  },
  {
    table: "artists",
    title: "Créer un talent",
    fields: [
      ["name", "Nom"],
      ["slug", "Slug"],
      ["bio", "Bio"],
      ["specialty", "Spécialité"],
      ["image_url", "Image URL"],
      ["instagram_url", "Instagram"],
      ["website_url", "Site"],
    ],
    defaults: {
      status: "active",
      featured: false,
      published: true,
    },
  },
  {
    table: "subscriptions",
    title: "Créer une formule",
    fields: [
      ["name", "Nom"],
      ["slug", "Slug"],
      ["description", "Description"],
      ["price_label", "Prix"],
      ["benefits", "Avantages séparés par des virgules"],
    ],
    defaults: {
      featured: false,
      active: true,
    },
  },
] as const;

type AdminProfileQueryClient = {
  from: (table: "profiles") => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: { is_admin: boolean } | null; error: { message: string } | null }>;
      };
    };
  };
};

type AdminCrudClient = {
  from: (table: string) => {
    insert: (payload: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  };
};

export function AdminDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function loadAdmin() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData.session;
      setSession(currentSession);

      if (!currentSession) {
        setLoading(false);
        return;
      }

      const adminClient = supabase as unknown as AdminProfileQueryClient;
      const { data, error } = await adminClient
        .from("profiles")
        .select("is_admin")
        .eq("id", currentSession.user.id)
        .maybeSingle();

      if (error) {
        console.error("Supabase admin profile error:", error.message);
      }

      setIsAdmin(Boolean(data?.is_admin));
      setLoading(false);
    }

    loadAdmin();
  }, [supabase]);

  if (loading) {
    return <p className="text-sm text-[#fbf3df]/70">Vérification des droits admin...</p>;
  }

  if (!session) {
    return (
      <div className="rounded-[2rem] border border-[#ffd978]/18 bg-white/[0.055] p-7">
        <h2 className="text-2xl font-semibold text-[#fbf3df]">Administration protégée</h2>
        <p className="mt-3 text-sm leading-7 text-[#fbf3df]/68">
          Connectez-vous avec un compte administrateur pour accéder à cette zone.
        </p>
        <a
          href="/connexion"
          className="mt-6 inline-flex rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
        >
          Connexion
        </a>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-[2rem] border border-red-300/24 bg-red-500/10 p-7">
        <h2 className="text-2xl font-semibold text-[#fbf3df]">Accès refusé</h2>
        <p className="mt-3 text-sm leading-7 text-red-100/80">
          Votre profil n’a pas le rôle administrateur. La protection complète dépend de la table
          profiles et des policies RLS du fichier SQL.
        </p>
      </div>
    );
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>, table: string, defaults: Record<string, unknown>) {
    event.preventDefault();
    setActionMessage("");

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = { ...defaults };

    for (const [key, value] of formData.entries()) {
      const cleanValue = typeof value === "string" ? value.trim() : value;

      if (cleanValue === "") {
        payload[key] = null;
        continue;
      }

      if (key === "capacity" || key === "seats_remaining") {
        payload[key] = Number(cleanValue);
      } else if (key === "benefits" && typeof cleanValue === "string") {
        payload[key] = cleanValue
          .split(",")
          .map((benefit) => benefit.trim())
          .filter(Boolean);
      } else {
        payload[key] = cleanValue;
      }
    }

    if (table === "workshops" && typeof payload.capacity === "number") {
      payload.seats_remaining = payload.capacity;
    }

    const adminClient = supabase as unknown as AdminCrudClient;
    const { error } = await adminClient.from(table).insert(payload);

    if (error) {
      setActionMessage(`Erreur ${table} : ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setActionMessage(`Élément ajouté dans ${table}.`);
  }

  return (
    <div className="grid gap-10">
      <div className="grid gap-5 md:grid-cols-2">
        {modules.map(([title, text]) => (
          <article
            key={title}
            className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30"
          >
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
              Admin
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{text}</p>
          </article>
        ))}
      </div>

      <section className="rounded-[2.2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Création rapide
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
          Ajouter des contenus depuis l’admin.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">
          Ces formulaires utilisent Supabase et sont protégés par le profil admin + RLS. Ils servent
          de base CRUD avant une interface plus confortable avec édition/suppression détaillée.
        </p>
        {actionMessage ? (
          <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#fbf3df]/74">
            {actionMessage}
          </p>
        ) : null}
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {adminCreateForms.map((form) => (
          <form
            key={form.table}
            onSubmit={(event) => handleCreate(event, form.table, form.defaults)}
            className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30"
          >
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {form.title}
            </h3>
            <div className="mt-5 grid gap-3">
              {form.fields.map(([name, label]) => (
                <label key={name} className="grid gap-2 text-sm font-semibold text-[#fbf3df]/76">
                  {label}
                  {name === "description" || name === "content" ? (
                    <textarea
                      name={name}
                      rows={name === "content" ? 5 : 3}
                      className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
                    />
                  ) : (
                    <input
                      name={name}
                      type={name === "start_date" ? "datetime-local" : "text"}
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
                    />
                  )}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-5 rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
            >
              Ajouter
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
