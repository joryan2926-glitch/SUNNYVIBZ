import Image from "next/image";
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
    <article className="premium-card group relative overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/45 hover:shadow-[#18f2a6]/10">
      <div className="absolute -right-14 -top-14 size-32 rounded-full bg-[#18f2a6]/12 blur-2xl transition duration-500 group-hover:bg-[#18f2a6]/24" />
      {event.image_url ? (
        <div className="-mx-6 -mt-6 mb-6 h-48 overflow-hidden">
          <Image
            src={event.image_url}
            alt={event.title}
            width={900}
            height={520}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="size-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="mb-8 flex items-start justify-between gap-5">
        <span className="rounded-full border border-[#18f2a6]/30 bg-[#18f2a6]/10 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#18f2a6]">
          {event.category ?? "Événement"}
        </span>
        <span className="text-right text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#ffd978]">
          {event.price_label ?? "SUNNYVIBZ"}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#fbf3df]/62">
        {dateFormatter.format(new Date(event.start_date))}
      </p>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
        {event.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{event.excerpt ?? event.description}</p>
      {event.location ? (
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-[#d8a62a]">
          {event.location}
        </p>
      ) : null}
    </article>
  );
}
