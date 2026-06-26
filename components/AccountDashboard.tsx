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

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function AccountDashboard() {
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const [session, setSession] = useState<Session | null>(null);
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

      const email = currentSession.user.email.toLowerCase();
      const bookingsClient = supabase as unknown as BookingQueryClient;
      const { data, error } = await bookingsClient
        .from("workshop_bookings")
        .select("id,workshop_title,workshop_date,status,created_at,email")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase account bookings error:", error.message);
        setMessage(
          "Les réservations seront visibles ici après exécution du SQL Supabase et connexion des données.",
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
          Connectez-vous pour retrouver vos réservations et vos futures informations d’abonnement.
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

  return (
    <div className="grid gap-8">
      <section className="premium-card rounded-[2rem] border border-[#18f2a6]/20 bg-[#18f2a6]/10 p-7 shadow-2xl shadow-black/30">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
          Mon compte
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
          {session.user.email}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#fbf3df]/68">
          Cet espace prépare le futur dashboard membre : réservations, abonnement, profil, messages,
          crédits et avantages SUNNYVIBZ.
        </p>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          Mes réservations
        </h2>
        {message ? (
          <p className="rounded-2xl border border-[#ffd978]/20 bg-[#ffd978]/10 p-4 text-sm text-[#fbf3df]/70">
            {message}
          </p>
        ) : null}
        <div className="grid gap-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5"
              >
                <p className="text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
                  {booking.status}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#fbf3df]">{booking.workshop_title}</h3>
                <p className="mt-2 text-sm text-[#fbf3df]/64">
                  {dateFormatter.format(new Date(booking.workshop_date))}
                </p>
              </article>
            ))
          ) : (
            <p className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 text-sm text-[#fbf3df]/66">
              Aucune réservation pour le moment.
            </p>
          )}
        </div>
      </section>

      <TalentMediaUploader session={session} />
    </div>
  );
}
