import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center"><p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">SUNNYVIBZ</p><h1 className="mt-4 text-5xl font-semibold tracking-tight text-[#fbf3df]">Cette page s’est éclipsée.</h1><p className="mt-4 max-w-xl text-sm leading-7 text-[#fbf3df]/60">Le contenu recherché n’existe pas encore ou a changé de place.</p><Link href="/" className="mt-8 rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-[#032017] transition hover:bg-emerald-200">Retour à l’accueil</Link></main>;
}
