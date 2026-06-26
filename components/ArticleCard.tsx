import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/supabase/types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="premium-card group overflow-hidden rounded-[2rem] border border-[#ffd978]/16 bg-white/[0.055] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#18f2a6]/40">
      <div className="relative h-56 overflow-hidden">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent" />
        {article.category ? (
          <span className="absolute left-5 top-5 rounded-full border border-[#ffd978]/30 bg-black/35 px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.14em] text-[#ffd978] backdrop-blur">
            {article.category}
          </span>
        ) : null}
      </div>
      <div className="p-6">
        <p className="text-[0.72rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
          {article.published_at ? dateFormatter.format(new Date(article.published_at)) : "SUNNYVIBZ"} ·{" "}
          {article.author}
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[#fbf3df]">
          {article.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#fbf3df]/66">{article.excerpt}</p>
        <Link
          href={`/articles/${article.slug}`}
          className="mt-6 inline-flex rounded-full border border-[#18f2a6]/35 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
        >
          Lire l’article
        </Link>
      </div>
    </article>
  );
}
