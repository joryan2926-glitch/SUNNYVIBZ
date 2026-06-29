import Link from "next/link";
import { SunnyLogo } from "./SunnyLogo";

const socialsToConnect = [
  "Instagram",
  "TikTok",
  "Facebook",
] as const;

const footerGroups = [
  {
    title: "Découvrir",
    links: [
      ["Comment ça marche", "/comment-ca-marche"],
      ["À propos", "/a-propos"],
      ["Galerie", "/galerie"],
      ["Articles", "/articles"],
      ["Partenaires", "/partenaires"],
      ["FAQ", "/faq"],
    ],
  },
  {
    title: "Participer",
    links: [
      ["Ateliers", "/ateliers"],
      ["Agenda", "/agenda"],
      ["Sunny Friday", "/sunny-friday"],
      ["Talents", "/talents"],
    ],
  },
  {
    title: "Plateforme",
    links: [
      ["Market", "/marketplace"],
      ["Abonnements", "/abonnements"],
      ["Connexion", "/connexion"],
      ["Mon compte", "/mon-compte"],
      ["Admin", "/admin"],
    ],
  },
  {
    title: "Cadre",
    links: [
      ["Mentions légales", "/mentions-legales"],
      ["Confidentialité", "/confidentialite"],
      ["Conditions", "/conditions"],
      ["Contact", "/contact"],
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-[#ffd978]/15 bg-black/35 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_1.6fr_0.7fr]">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <SunnyLogo />
            <span>
              <strong className="block tracking-[0.18em] text-[#ffd978]">SUNNYVIBZ</strong>
              <small className="text-xs uppercase tracking-[0.18em] text-[#d8a62a]">
                Pôle Art & Culture
              </small>
            </span>
          </Link>
          <p className="max-w-md text-sm leading-7 text-[#fbf3df]/64">
            Une plateforme culturelle pour créer, exposer, transmettre, connecter les talents,
            les partenaires et faire rayonner les projets locaux.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm uppercase tracking-[0.18em] text-[#ffd978]">
                {group.title}
              </h2>
              <div className="grid gap-2 text-sm text-[#fbf3df]/70">
                {group.links.map(([label, href]) => (
                  <Link key={href} href={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="mb-4 text-sm uppercase tracking-[0.18em] text-[#ffd978]">Réseaux</h2>
          <div className="flex flex-wrap gap-3">
            {socialsToConnect.map((label) => (
              <span
                key={label}
                className="rounded-full border border-[#18f2a6]/25 px-4 py-2 text-sm text-[#18f2a6]"
                title="Lien officiel à connecter"
              >
                {label}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-6 text-[#fbf3df]/54">
            Liens officiels à connecter dès que les comptes SunnyVibz sont confirmés.
          </p>
        </div>
      </div>
    </footer>
  );
}
