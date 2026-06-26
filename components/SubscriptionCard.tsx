import Link from "next/link";
import type { Subscription } from "@/lib/supabase/types";

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  return (
    <article
      className={`premium-card rounded-[2rem] border p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
        subscription.featured
          ? "border-[#18f2a6]/42 bg-[#18f2a6]/12"
          : "border-[#ffd978]/16 bg-white/[0.055]"
      }`}
    >
      <p className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#ffd978]">
        {subscription.featured ? "Recommandé" : "Formule"}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#fbf3df]">
        {subscription.name}
      </h2>
      <p className="mt-2 text-xl font-semibold text-[#18f2a6]">{subscription.price_label}</p>
      <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{subscription.description}</p>
      <ul className="mt-6 grid gap-3 text-sm text-[#fbf3df]/76">
        {subscription.benefits.map((benefit) => (
          <li key={benefit} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            {benefit}
          </li>
        ))}
      </ul>
      <Link
        href="/connexion"
        className="mt-7 inline-flex w-full justify-center rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
      >
        Choisir cette formule
      </Link>
    </article>
  );
}
