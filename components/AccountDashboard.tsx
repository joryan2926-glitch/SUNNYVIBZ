"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { TalentMediaUploader } from "@/components/TalentMediaUploader";
import { createBrowserSupabase } from "@/lib/supabase/browser";

type BookingRow = {
  id: string;
  workshop_title: string;
  workshop_date: string;
  status: string;
  created_at: string;
  subscription_plan_slug: string | null;
  pricing_note: string | null;
  priority_access: boolean;
};

type ProfileRow = {
  full_name: string | null;
  roles: string[] | null;
  artist_status: "active" | "inactive" | null;
  is_admin: boolean | null;
};

type AccountSubscriptionPlan = {
  slug: string;
  name: string;
  price_label: string;
  commitment_label: string;
  access_label: string;
  benefits: string[];
  priority_level: number;
  workshop_discount_percent: number;
};

type AccountSubscriptionRow = {
  id: string;
  status: "active" | "past_due" | "cancelled" | "expired";
  started_at: string;
  ends_at: string | null;
  subscription_plans: AccountSubscriptionPlan | null;
};

type BookingQueryClient = {
  from: (table: "workshop_bookings") => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        order: (
          column: string,
          options: { ascending: boolean },
        ) => Promise<{ data: BookingRow[] | null; error: { message: string } | null }>;
      };
    };
  };
};

type ProfileQueryClient = {
  from: (table: "profiles") => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        maybeSingle: () => Promise<{ data: ProfileRow | null; error: { message: string } | null }>;
      };
    };
  };
};

type SubscriptionQueryClient = {
  from: (table: "user_subscriptions") => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        eq: (
          column: string,
          value: string,
        ) => {
          order: (
            column: string,
            options: { ascending: boolean },
          ) => {
            limit: (
              count: number,
            ) => Promise<{
              data: AccountSubscriptionRow[] | null;
              error: { message: string } | null;
            }>;
          };
        };
      };
    };
  };
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatRoles(roles: string[] | null | undefined, isAdmin: boolean | null | undefined) {
  const safeRoles = roles && roles.length > 0 ? roles : ["adherent"];
  const labels = safeRoles.map((role) => role.charAt(0).toUpperCase() + role.slice(1));

  if (isAdmin) {
    labels.push("Admin");
  }

  return labels.join(" · ");
}

export function AccountDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [subscription, setSubscription] = useState<AccountSubscriptionRow | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadAccount() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData.session;
      setSession(currentSession);

      if (!currentSession?.user.email) {
        setLoading(false);
        return;
      }

      const profileClient = supabase as unknown as ProfileQueryClient;
      const { data: profileData, error: profileError } = await profileClient
        .from("profiles")
        .select("full_name,roles,artist_status,is_admin")
        .eq("id", currentSession.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Supabase account profile error:", profileError.message);
      } else {
        setProfile(profileData);
      }

      const subscriptionClient = supabase as unknown as SubscriptionQueryClient;
      const { data: subscriptionData, error: subscriptionError } = await subscriptionClient
        .from("user_subscriptions")
        .select(
          "id,status,started_at,ends_at,subscription_plans(slug,name,price_label,commitment_label,access_label,benefits,priority_level,workshop_discount_percent)",
        )
        .eq("user_id", currentSession.user.id)
        .eq("status", "active")
        .order("started_at", { ascending: false })
        .limit(1);

      if (subscriptionError) {
        console.error("Supabase account subscription error:", subscriptionError.message);
        setMessage(
          "L’abonnement actuel sera visible ici après exécution du SQL Supabase avec subscription_plans et user_subscriptions.",
        );
      } else {
        setSubscription(subscriptionData?.[0] ?? null);
      }

      const email = currentSession.user.email.toLowerCase();
      const bookingsClient = supabase as unknown as BookingQueryClient;
      const { data, error } = await bookingsClient
        .from("workshop_bookings")
        .select(
          "id,workshop_title,workshop_date,status,created_at,email,subscription_plan_slug,pricing_note,priority_access",
        )
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase account bookings error:", error.message);
        setMessage(
          "Les réservations apparaîtront ici après l’exécution du SQL Supabase et la création de la table workshop_bookings.",
        );
      } else {
        setBookings(data ?? []);
      }

      setLoading(false);
    }

    loadAccount();
  }, [supabase]);

  if (loading) {
    return <p className="text-sm text-[#fbf3df]/70">Chargement de votre compte...</p>;
  }

  if (!session) {
    return (
      <div className="rounded-[2rem] border border-[#ffd978]/18 bg-white/[0.055] p-7">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          Connexion requise
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#fbf3df]/68">
          Connectez-vous pour retrouver vos réservations, votre abonnement, votre statut utilisateur
          et votre futur profil talent.
        </p>
        <a
          href="/connexion"
          className="mt-6 inline-flex rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6]"
        >
          Se connecter
        </a>
      </div>
    );
  }

  const plan = subscription?.subscription_plans ?? null;
  const artistStatus =
    profile?.roles?.includes("artiste") || profile?.roles?.includes("talent")
      ? profile.artist_status === "active"
        ? "Profil artiste actif"
        : "Profil artiste inactif"
      : "Profil artiste non demandé";

  return (
    <div className="grid gap-8">
      <section className="premium-card rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-7 shadow-2xl shadow-black/30">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Mon compte
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
          {profile?.full_name || session.user.email}
        </h2>
        <p className="mt-2 text-sm text-[#fbf3df]/62">{session.user.email}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
            Statut utilisateur
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
            {formatRoles(profile?.roles, profile?.is_admin)}
          </h2>
        </article>

        <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
            Profil artiste
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
            {artistStatus}
          </h2>
        </article>

        <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-5">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
            Abonnement actuel
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
            {plan ? `${plan.name} · ${plan.price_label}` : "Aucune formule active"}
          </h2>
          {plan ? (
            <p className="mt-2 text-sm text-[#fbf3df]/62">
              {plan.commitment_label} · {plan.access_label}
            </p>
          ) : null}
        </article>
      </section>

      {message ? (
        <p className="rounded-2xl border border-[#ffd978]/20 bg-[#ffd978]/10 p-4 text-sm text-[#fbf3df]/70">
          {message}
        </p>
      ) : null}

      {plan ? (
        <section className="rounded-[2rem] border border-[#18f2a6]/22 bg-[#18f2a6]/10 p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
            Vos avantages {plan.name}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {plan.benefits.map((benefit) => (
              <p
                key={benefit}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#fbf3df]/72"
              >
                {benefit}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-5 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          Mes réservations d’ateliers
        </h2>
        <div className="grid gap-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="rounded-full border border-[#18f2a6]/26 bg-[#18f2a6]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                    {booking.status}
                  </p>
                  {booking.priority_access ? (
                    <p className="rounded-full border border-[#ffd978]/24 bg-[#ffd978]/10 px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#ffd978]">
                      Prioritaire
                    </p>
                  ) : null}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#fbf3df]">
                  {booking.workshop_title}
                </h3>
                <p className="mt-2 text-sm text-[#fbf3df]/64">
                  {dateFormatter.format(new Date(booking.workshop_date))}
                </p>
                {booking.pricing_note ? (
                  <p className="mt-3 text-sm text-[#fbf3df]/58">{booking.pricing_note}</p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-sm text-[#fbf3df]/66">
              Aucune réservation pour le moment. Réservez un atelier pour voir l’historique apparaître ici.
            </p>
          )}
        </div>
      </section>

      <TalentMediaUploader session={session} />
    </div>
  );
}
