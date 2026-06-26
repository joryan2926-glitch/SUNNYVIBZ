"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";

const modules = [
  ["Ateliers", "Créer, publier, suivre les places et les statuts."],
  ["Réservations", "Consulter les demandes, confirmer ou annuler."],
  ["Articles", "Rédiger, publier ou garder en brouillon."],
  ["Talents", "Activer, désactiver et gérer les profils média."],
  ["Abonnements", "Gérer les formules et les abonnements utilisateurs."],
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

export function AdminDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
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
  );
}
