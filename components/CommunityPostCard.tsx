import Link from "next/link";
import type { CommunityPost } from "@/lib/supabase/types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  const dateLabel = dateFormatter.format(new Date(post.created_at));

  return (
    <article className="rounded-[1.7rem] border border-[#ffd978]/16 bg-white/[0.052] p-6 shadow-xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#ffd978]/36">
      <div className="flex flex-wrap items-center gap-3 text-[0.68rem] font-black uppercase tracking-[0.14em]">
        {post.category ? (
          <span className="rounded-full border border-[#18f2a6]/28 bg-[#18f2a6]/8 px-3 py-1.5 text-[#18f2a6]">
            {post.category}
          </span>
        ) : null}
        <span className="text-[#fbf3df]/38">{dateLabel}</span>
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em] text-[#fbf3df]">
        {post.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[#fbf3df]/66">{post.content}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        <div>
          <p className="text-sm font-semibold text-[#fbf3df]">{post.author_name}</p>
          {post.author_role ? (
            <p className="mt-1 text-xs font-semibold text-[#ffd978]/70">{post.author_role}</p>
          ) : null}
        </div>

        {post.call_to_action_label && post.call_to_action_href ? (
          <Link
            href={post.call_to_action_href}
            className="rounded-full border border-[#ffd978]/26 px-4 py-2 text-sm font-semibold text-[#ffd978] transition hover:bg-[#ffd978]/10"
          >
            {post.call_to_action_label}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
