"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type AdminFormField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "datetime-local" | "number" | "select" | "url";
  rows?: number;
  placeholder?: string;
  helper?: string;
  options?: readonly { label: string; value: string }[];
};

type AdminCreateForm = {
  table: string;
  title: string;
  description: string;
  fields: readonly AdminFormField[];
  defaults: Record<string, unknown>;
};

const moduleCards = [
  {
    title: "Ateliers",
    metric: "Réserver / places / complet",
    status: "Actif MVP",
    href: "/ateliers",
    text: "Piloter les ateliers, dates, capacités, tarifs préférentiels et statuts disponible/complet.",
  },
  {
    title: "Espaces",
    metric: "Creative Lab / Sunilounge",
    status: "Actif MVP",
    href: "/espaces",
    text: "Suivre les espaces réservables, les usages, créneaux et priorités membres.",
  },
  {
    title: "Community",
    metric: "Profils / rôles / annonces",
    status: "Actif MVP",
    href: "/communaute",
    text: "Mettre en avant adhérents, artistes, associations, partenaires et besoins communautaires.",
  },
  {
    title: "SUNNY Market",
    metric: "Offres / services / créations",
    status: "Actif MVP",
    href: "/marketplace",
    text: "Gérer les offres, prestations, stands, créations, demandes et futures commandes.",
  },
  {
    title: "Agenda",
    metric: "Événements / billetterie future",
    status: "Actif MVP",
    href: "/agenda",
    text: "Préparer calendrier, événements, listes d’attente, réservations et communication.",
  },
  {
    title: "Comptes",
    metric: "Sunny Pass / Wallet / Rewards",
    status: "Base prête",
    href: "/mon-compte",
    text: "Contrôler les parcours membres, rôles, pass numérique, récompenses et portefeuille.",
  },
] as const;

const adminPriorities = [
  {
    title: "À valider",
    items: ["nouvelles réservations", "offres Market", "profils Community", "demandes partenaires"],
  },
  {
    title: "À surveiller",
    items: ["capacités ateliers", "occupation espaces", "événements à venir", "formulaires contact"],
  },
  {
    title: "À préparer",
    items: ["SQL Supabase", "RLS définitives", "Stripe", "emails de confirmation"],
  },
] as const;

const readinessItems = [
  ["Supabase avancé", "Exécuter les scripts SQL préparés, puis valider avec les checks plateforme."],
  ["Compte admin", "Créer un compte, récupérer son id Supabase Auth, puis passer is_admin à true dans profiles."],
  ["Cadre légal", "Compléter mentions légales, confidentialité et conditions avec les informations officielles."],
  ["Paiements", "Connecter Stripe avant tout paiement réel d’abonnement, atelier, stand ou Market."],
  ["Emails", "Connecter Resend, Brevo, SendGrid ou SMTP pour confirmations et notifications."],
  ["Contenus réels", "Remplacer les images, événements, talents et textes d’exemple par les contenus définitifs."],
] as const;

const booleanOptions = [
  { label: "Oui", value: "true" },
  { label: "Non", value: "false" },
] as const;

const adminCreateForms: readonly AdminCreateForm[] = [
  {
    table: "events",
    title: "Créer un événement",
    description: "Agenda, Sunny Friday, exposition, conférence ou temps communautaire.",
    fields: [
      { name: "title", label: "Titre" },
      { name: "slug", label: "Slug" },
      { name: "excerpt", label: "Résumé", type: "textarea", rows: 2 },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "start_date", label: "Date de début", type: "datetime-local" },
      { name: "end_date", label: "Date de fin", type: "datetime-local" },
      { name: "location", label: "Lieu" },
      { name: "image_url", label: "Image URL", type: "url", placeholder: "/gallery/scene-ouverte.svg" },
      { name: "category", label: "Catégorie" },
      { name: "price_label", label: "Prix affiché" },
    ],
    defaults: { published: true },
  },
  {
    table: "workshops",
    title: "Créer un atelier",
    description: "Atelier réservable avec capacité, prix et priorité membre.",
    fields: [
      { name: "title", label: "Titre" },
      { name: "slug", label: "Slug" },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "image_url", label: "Image URL", type: "url" },
      { name: "start_date", label: "Date", type: "datetime-local" },
      { name: "location", label: "Lieu" },
      { name: "price_label", label: "Prix affiché" },
      { name: "base_price_cents", label: "Prix base en centimes", type: "number" },
      { name: "capacity", label: "Places", type: "number" },
      { name: "subscriber_priority", label: "Priorité abonnés", type: "select", options: booleanOptions },
      { name: "access_notes", label: "Notes d’accès", type: "textarea", rows: 2 },
    ],
    defaults: {
      seats_remaining: 12,
      status: "available",
      requires_booking: true,
      subscriber_priority: true,
      published: true,
    },
  },
  {
    table: "spaces",
    title: "Créer un espace",
    description: "Espace réservable : atelier, lounge, exposition ou événement.",
    fields: [
      { name: "title", label: "Nom de l’espace" },
      { name: "slug", label: "Slug" },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "image_url", label: "Image URL", type: "url" },
      { name: "location", label: "Lieu" },
      { name: "area_label", label: "Type d’espace" },
      { name: "price_label", label: "Prix affiché" },
      { name: "capacity", label: "Capacité", type: "number" },
      { name: "slots_capacity", label: "Créneaux disponibles", type: "number" },
      { name: "access_notes", label: "Notes d’accès", type: "textarea", rows: 2 },
    ],
    defaults: {
      slots_remaining: 4,
      status: "available",
      requires_booking: true,
      subscriber_priority: true,
      published: true,
    },
  },
  {
    table: "market_offers",
    title: "Créer une offre Market",
    description: "Création, service, atelier, stand ou produit numérique.",
    fields: [
      { name: "seller_name", label: "Vendeur / talent" },
      { name: "title", label: "Titre" },
      { name: "slug", label: "Slug" },
      { name: "short_description", label: "Résumé", type: "textarea", rows: 2 },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "image_url", label: "Image URL", type: "url" },
      {
        name: "offer_type",
        label: "Type d’offre",
        type: "select",
        options: [
          { label: "Création", value: "artwork" },
          { label: "Service", value: "service" },
          { label: "Atelier", value: "workshop" },
          { label: "Stand", value: "stand" },
          { label: "Digital", value: "digital" },
        ],
      },
      { name: "category", label: "Catégorie" },
      { name: "price_label", label: "Prix affiché" },
      { name: "amount_cents", label: "Montant en centimes", type: "number" },
      { name: "delivery_mode", label: "Mode de livraison" },
      { name: "featured", label: "Mise en avant", type: "select", options: booleanOptions },
    ],
    defaults: { currency: "EUR", status: "available", featured: false, published: true },
  },
  {
    table: "community_profiles",
    title: "Créer un profil Community",
    description: "Membre, artiste, association, entreprise, partenaire ou bénévole.",
    fields: [
      { name: "display_name", label: "Nom affiché" },
      { name: "slug", label: "Slug" },
      { name: "headline", label: "Accroche" },
      { name: "bio", label: "Bio", type: "textarea", rows: 4 },
      { name: "avatar_url", label: "Avatar URL", type: "url" },
      {
        name: "profile_type",
        label: "Type de profil",
        type: "select",
        options: [
          { label: "Adhérent", value: "adherent" },
          { label: "Artiste", value: "artiste" },
          { label: "Association", value: "association" },
          { label: "Entreprise", value: "entreprise" },
          { label: "Partenaire", value: "partenaire" },
          { label: "Bénévole", value: "benevole" },
        ],
      },
      { name: "roles", label: "Rôles séparés par virgules", helper: "Ex : Artiste, Adhérent, Ambassadeur" },
      { name: "skills", label: "Compétences séparées par virgules" },
      { name: "needs", label: "Besoins séparés par virgules" },
      { name: "location", label: "Lieu" },
      { name: "featured", label: "Mise en avant", type: "select", options: booleanOptions },
    ],
    defaults: { status: "active", featured: false, published: true },
  },
  {
    table: "articles",
    title: "Créer un article",
    description: "Article, actualité, note d’intention ou annonce culturelle.",
    fields: [
      { name: "title", label: "Titre" },
      { name: "slug", label: "Slug" },
      { name: "excerpt", label: "Résumé", type: "textarea", rows: 2 },
      { name: "image_url", label: "Image URL", type: "url" },
      { name: "category", label: "Catégorie" },
      { name: "author", label: "Auteur" },
      { name: "content", label: "Contenu", type: "textarea", rows: 5 },
    ],
    defaults: { status: "published", published_at: new Date().toISOString() },
  },
  {
    table: "artists",
    title: "Créer un talent",
    description: "Profil talent public relié ensuite à Community et Market.",
    fields: [
      { name: "name", label: "Nom" },
      { name: "slug", label: "Slug" },
      { name: "bio", label: "Bio", type: "textarea", rows: 4 },
      { name: "specialty", label: "Spécialité" },
      { name: "image_url", label: "Image URL", type: "url" },
      { name: "instagram_url", label: "Instagram", type: "url" },
      { name: "website_url", label: "Site", type: "url" },
      { name: "featured", label: "Mise en avant", type: "select", options: booleanOptions },
    ],
    defaults: { status: "active", featured: false, published: true },
  },
] as const;

const numberFields = new Set([
  "capacity",
  "seats_remaining",
  "slots_capacity",
  "slots_remaining",
  "amount_cents",
  "base_price_cents",
  "subscriber_price_cents",
  "creative_price_cents",
  "premium_price_cents",
  "hourly_price_cents",
  "half_day_price_cents",
  "full_day_price_cents",
  "workshop_discount_percent",
  "priority_level",
  "sort_order",
]);

const booleanFields = new Set([
  "active",
  "featured",
  "published",
  "requires_booking",
  "subscriber_priority",
]);

const arrayFields = new Set(["benefits", "roles", "skills", "needs"]);
const dateFields = new Set(["start_date", "end_date", "published_at"]);

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

function parseFieldValue(key: string, value: FormDataEntryValue) {
  const cleanValue = typeof value === "string" ? value.trim() : value;

  if (cleanValue === "") {
    return null;
  }

  if (typeof cleanValue !== "string") {
    return cleanValue;
  }

  if (numberFields.has(key)) {
    return Number(cleanValue);
  }

  if (booleanFields.has(key)) {
    return cleanValue === "true";
  }

  if (arrayFields.has(key)) {
    return cleanValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (dateFields.has(key)) {
    return new Date(cleanValue).toISOString();
  }

  return cleanValue;
}

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
          Connectez-vous avec un compte administrateur pour accéder au cockpit SUNNYVIBZ.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-flex rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
        >
          Connexion
        </Link>
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

  async function handleCreate(event: FormEvent<HTMLFormElement>, form: AdminCreateForm) {
    event.preventDefault();
    setActionMessage("");

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = { ...form.defaults };

    for (const [key, value] of formData.entries()) {
      payload[key] = parseFieldValue(key, value);
    }

    if (form.table === "workshops" && typeof payload.capacity === "number") {
      payload.seats_remaining = payload.capacity;
    }

    if (form.table === "spaces") {
      if (typeof payload.slots_capacity === "number") {
        payload.slots_remaining = payload.slots_capacity;
      }
      if (payload.slots_remaining === undefined) {
        payload.slots_remaining = payload.slots_capacity ?? form.defaults.slots_remaining;
      }
    }

    const adminClient = supabase as unknown as AdminCrudClient;
    const { error } = await adminClient.from(form.table).insert(payload);

    if (error) {
      setActionMessage(`Erreur ${form.table} : ${error.message}`);
      return;
    }

    event.currentTarget.reset();
    setActionMessage(`Élément ajouté dans ${form.table}.`);
  }

  return (
    <div className="grid gap-10">
      <section className="rounded-[2.4rem] border border-[#18f2a6]/18 bg-[radial-gradient(circle_at_18%_12%,rgba(24,242,166,0.16),transparent_30%),radial-gradient(circle_at_84%_10%,rgba(255,217,120,0.14),transparent_28%),rgba(255,255,255,0.055)] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[0.72rem] font-black uppercase tracking-[0.22em] text-[#18f2a6]">
              Cockpit opérationnel
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.045em] text-[#fbf3df] sm:text-5xl">
              Piloter SUNNYVIBZ module par module, sans perdre la vision globale.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#fbf3df]/70">
              Cette première administration centralise les modules MVP : création de contenus,
              surveillance des priorités, accès aux pages publiques et préparation des prochaines
              protections Supabase.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {adminPriorities.map((priority) => (
              <article key={priority.title} className="rounded-3xl border border-white/10 bg-black/22 p-5">
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#ffd978]">
                  {priority.title}
                </h3>
                <ul className="mt-4 grid gap-2 text-xs leading-5 text-[#fbf3df]/66">
                  {priority.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {moduleCards.map((module) => (
          <article
            key={module.title}
            className="premium-card rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                {module.status}
              </p>
              <span className="rounded-full border border-[#ffd978]/22 bg-[#ffd978]/8 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#ffd978]">
                {module.metric}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
              {module.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{module.text}</p>
            <Link
              href={module.href}
              className="mt-5 inline-flex rounded-full border border-[#18f2a6]/30 bg-[#18f2a6]/8 px-4 py-2 text-sm font-semibold text-[#18f2a6] transition hover:bg-[#18f2a6]/14"
            >
              Ouvrir
            </Link>
          </article>
        ))}
      </section>

      <section className="rounded-[2.2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Création rapide
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
          Ajouter des contenus dans les tables principales.
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">
          Ces formulaires utilisent Supabase côté navigateur et restent dépendants des policies RLS.
          Ils servent de base CRUD avant une interface d’édition/suppression plus avancée.
        </p>
        {actionMessage ? (
          <p className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[#fbf3df]/74">
            {actionMessage}
          </p>
        ) : null}
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        {adminCreateForms.map((form) => (
          <form
            key={form.table}
            onSubmit={(event) => handleCreate(event, form)}
            className="rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                  {form.table}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
                  {form.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-[#fbf3df]/62">
                  {form.description}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {form.fields.map((field) => (
                <label
                  key={field.name}
                  className={`grid gap-2 text-sm font-semibold text-[#fbf3df]/76 ${
                    field.type === "textarea" ? "sm:col-span-2" : ""
                  }`}
                >
                  {field.label}
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.name}
                      rows={field.rows ?? 3}
                      placeholder={field.placeholder}
                      className="resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition placeholder:text-[#fbf3df]/28 focus:border-[#18f2a6]/60"
                    />
                  ) : field.type === "select" ? (
                    <select
                      name={field.name}
                      defaultValue={String(form.defaults[field.name] ?? field.options?.[0]?.value ?? "")}
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition focus:border-[#18f2a6]/60"
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#030403]">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field.name}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[#fbf3df] outline-none transition placeholder:text-[#fbf3df]/28 focus:border-[#18f2a6]/60"
                    />
                  )}
                  {field.helper ? <span className="text-xs font-normal text-[#fbf3df]/42">{field.helper}</span> : null}
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="mt-5 rounded-full border border-[#18f2a6]/40 bg-[#18f2a6]/12 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5 hover:bg-[#18f2a6]/18"
            >
              Ajouter
            </button>
          </form>
        ))}
      </div>

      <section className="rounded-[2.2rem] border border-[#ffd978]/18 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Prêt à lancer
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
          Les points à verrouiller avant production.
        </h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {readinessItems.map(([title, text]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-sm font-black uppercase tracking-[0.14em] text-[#18f2a6]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#fbf3df]/66">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}