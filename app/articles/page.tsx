import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getArticles } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Articles SUNNYVIBZ : actualités, coulisses, talents, ateliers, market créatif et projets culturels.",
};

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await getArticles(24);

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading
        eyebrow="Articles"
        title="Des récits pour suivre la vibz de l’intérieur."
        text="Ici, SunnyVibz raconte ses coulisses : talents, ateliers, market, Sunny Friday, partenaires, idées et prochains projets."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard article={article} key={article.id} />
        ))}
      </div>
    </main>
  );
}
