import type { Metadata } from "next";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getEvents } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Agenda des événements, ateliers, expositions et Sunny Friday de SUNNYVIBZ.",
};

export const revalidate = 60;

export default async function AgendaPage() {
  const events = await getEvents(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading
        eyebrow="Agenda"
        title="Événements, ateliers et rendez-vous culturels."
        text="Cette page affiche les événements publiés dans Supabase depuis la table events."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </main>
  );
}
