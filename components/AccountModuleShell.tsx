import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";

type AccountModuleShellProps = {
  eyebrow: string;
  title: string;
  text: string;
  items: readonly string[];
};

export function AccountModuleShell({ eyebrow, items, text, title }: AccountModuleShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} text={text} />

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            className="rounded-[1.7rem] border border-[#ffd978]/16 bg-white/[0.055] p-6 shadow-2xl shadow-black/25"
            key={item}
          >
            <p className="text-[0.68rem] font-black uppercase tracking-[0.16em] text-[#18f2a6]">
              MVP
            </p>
            <p className="mt-3 text-sm leading-7 text-[#fbf3df]/72">{item}</p>
          </article>
        ))}
      </section>

      <Link
        className="mt-10 inline-flex rounded-full border border-[#18f2a6]/36 bg-[#18f2a6]/10 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#18f2a6] transition hover:-translate-y-0.5"
        href="/mon-compte"
      >
        Retour au tableau de bord
      </Link>
    </main>
  );
}
