import type { Event } from "@/lib/supabase/types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/45 hover:shadow-[#18f2a6]/10">
      <div className="mb-8 flex items-start justify-between gap-5">
        <span className="rounded-full border border-[#18f2a6]/30 bg-[#18f2a6]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#18f2a6]">
          {event.category ?? "Événement"}
        </span>
        <span className="text-right text-xs font-bold uppercase tracking-[0.14em] text-[#ffd978]">
          {event.price_label ?? "SUNNYVIBZ"}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#fbf3df]/62">
        {dateFormatter.format(new Date(event.start_date))}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
        {event.title}
      </h3>
      <p className="mt-4 leading-7 text-[#fbf3df]/66">{event.excerpt ?? event.description}</p>
      {event.location ? (
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-[#d8a62a]">
          {event.location}
        </p>
      ) : null}
    </article>
  );
}
