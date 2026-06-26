import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/supabase/queries";

type ArticleDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles(24);

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return {
    title: article ? article.title : "Article introuvable",
    description: article?.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <p className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-[#ffd978]">
        {article.category ?? "Article"}
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.055em] text-[#fbf3df] sm:text-6xl">
        {article.title}
      </h1>
      <p className="mt-5 text-sm text-[#18f2a6]">
        {article.author}
        {article.published_at ? ` · ${dateFormatter.format(new Date(article.published_at))}` : ""}
      </p>

      {article.image_url ? (
        <div className="premium-card relative mt-10 min-h-[22rem] overflow-hidden rounded-[2.2rem] border border-[#ffd978]/18">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 900px"
            className="object-cover"
          />
        </div>
      ) : null}

      <article className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-base leading-8 text-[#fbf3df]/75 sm:p-10">
        {article.content.split("\n").map((paragraph) => (
          <p key={paragraph} className="mb-5 last:mb-0">
            {paragraph}
          </p>
        ))}
      </article>
    </main>
  );
}
