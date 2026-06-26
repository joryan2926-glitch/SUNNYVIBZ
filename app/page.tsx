const frontOffice = [
  "Accueil",
  "Concept",
  "Espaces",
  "Ateliers",
  "Sunny Events",
  "Sunny Friday",
  "Artistes",
  "Marketplace",
  "Adhésion",
  "Connexion",
];

const spaces = [
  {
    title: "Creative Lab",
    subtitle: "Ateliers & formations",
    body: "Réservez des ateliers, créez des parcours et suivez vos apprentissages.",
    stat: "500+ ateliers",
  },
  {
    title: "Maison Créative",
    subtitle: "Expositions & conférences",
    body: "Une vitrine premium pour expositions, talks, résidences et rencontres.",
    stat: "120+ artistes",
  },
  {
    title: "Sunilounge",
    subtitle: "Détente & échanges",
    body: "Un espace communautaire pour connecter talents, publics et partenaires.",
    stat: "850+ membres",
  },
  {
    title: "Salles Artistes",
    subtitle: "Résidences & création",
    body: "Réservation en temps réel des salles, studios et ressources culturelles.",
    stat: "76% occupation",
  },
  {
    title: "Sunny Friday",
    subtitle: "Marché des créateurs",
    body: "Stands exposants, plan interactif, QR exposant, paiement et commandes.",
    stat: "30+ exposants",
  },
];

const memberModules = [
  "Dashboard",
  "SUNNY PASS",
  "Wallet",
  "Crédits",
  "Réservations",
  "Projets",
  "Récompenses",
  "Messages",
];

const platformModules = [
  {
    title: "Réservations temps réel",
    items: ["Disponibilités", "Créneaux", "Paiement", "Confirmation QR"],
  },
  {
    title: "Adhésions",
    items: ["Inscription", "Paiement", "Signature numérique", "Carte membre"],
  },
  {
    title: "SUNNY Credits",
    items: ["Recharge", "Historique", "Bonus", "Récompenses"],
  },
  {
    title: "Marketplace",
    items: ["Boutiques artistes", "Services", "Commandes", "Paiements"],
  },
  {
    title: "Sunny Events",
    items: ["Calendrier", "Billetterie", "Liste d’attente", "Réservations"],
  },
  {
    title: "Sunny Projects",
    items: ["Partenaires", "Bénévoles", "Crowdfunding", "Financements"],
  },
  {
    title: "Communauté",
    items: ["Fil d’actualité", "Messagerie", "Mise en relation", "Groupes"],
  },
  {
    title: "SUNNY Academy",
    items: ["Tutoriels", "Masterclass", "Formations", "Certificats"],
  },
  {
    title: "IA SUNNYVIBZ",
    items: ["Assistant Artiste", "Assistant Projet", "Communication", "Association"],
  },
];

const artists = [
  "Portfolio",
  "Galerie",
  "Vidéos",
  "Réseaux sociaux",
  "Événements",
  "Services",
];

const ceoMetrics = [
  ["Acquisition", "+34%", "nouveaux membres"],
  ["Conversion", "18.7%", "visiteurs → adhérents"],
  ["Fidélisation", "82%", "membres actifs"],
  ["Engagement", "4.8/5", "satisfaction"],
  ["CA", "42K€", "prévision trimestre"],
  ["Marketplace", "310", "commandes"],
  ["Réservations", "1 240", "créneaux"],
  ["Prévisions IA", "+21%", "croissance estimée"],
];

const roles = [
  "Adhérent",
  "Artiste",
  "Exposant",
  "Bénévole",
  "Association",
  "Centre de loisirs",
  "Entreprise",
  "Partenaire",
  "Sponsor",
];

function SunnyLogo({ variant = "gold" }: { variant?: "gold" | "white" | "green" | "neonGold" }) {
  return (
    <span className={`sunnyLogo ${variant}`} aria-label="Logo SUNNYVIBZ">
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="4" />
        <path
          d="M22 44c18-18 36-19 54-1C55 35 38 36 22 52m76-8c-18-18-36-19-54-1 21-8 38-7 54 9"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M60 42c-11 12-14 25-8 39m8-39c11 12 14 25 8 39"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="6"
        />
        <path
          d="M25 70h70M31 82h58M40 94h40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
        />
      </svg>
    </span>
  );
}

function GlowButton({
  children,
  tone = "emerald",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "gold" | "ghost";
}) {
  return <button className={`btnGlow ${tone}`}>{children}</button>;
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="sectionTitle">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function QrCodeMock() {
  return (
    <div className="qrCodeMock" aria-label="QR Code membre">
      {Array.from({ length: 64 }).map((_, index) => (
        <i
          key={index}
          className={
            index % 2 === 0 || index % 7 === 0 || [3, 9, 18, 35, 42, 59].includes(index)
              ? "active"
              : ""
          }
        />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="sunnyApp">
      <div className="backgroundAura" />

      <header className="mainHeader">
        <a className="brandBlock" href="#accueil">
          <SunnyLogo variant="neonGold" />
          <span>
            <strong>SUNNYVIBZ</strong>
            <small>Pôle Art & Culture</small>
          </span>
        </a>

        <nav className="mainNav" aria-label="Navigation SUNNYVIBZ">
          {frontOffice.slice(0, 8).map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="headerButtons">
          <GlowButton tone="gold">Connexion</GlowButton>
          <GlowButton>Adhérer</GlowButton>
        </div>
      </header>

      <section className="heroSection" id="accueil">
        <div className="heroContent">
          <span className="heroLabel">Maquette officielle • Référence visuelle</span>
          <h1>
            <span>L’art.</span>
            <span>La culture.</span>
            <span>La vibz.</span>
          </h1>
          <p>
            SUNNYVIBZ devient une plateforme immersive pour réserver, créer, vendre, financer,
            apprendre, rencontrer et piloter l’activité culturelle d’une association moderne.
          </p>
          <div className="heroButtons">
            <GlowButton>Réserver un espace</GlowButton>
            <GlowButton tone="gold">Découvrir l’écosystème</GlowButton>
            <GlowButton tone="ghost">Voir la marketplace</GlowButton>
          </div>
        </div>

        <div className="heroVisual" aria-label="Façade immersive SUNNYVIBZ">
          <div className="neonBuilding">
            <div className="buildingGlowTop" />
            <div className="signBoard">
              <SunnyLogo variant="green" />
              <strong>SUNNYVIBZ</strong>
              <small>PÔLE ART & CULTURE</small>
            </div>
            <div className="glassGallery">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="sideWords">
              <span>Créer</span>
              <span>Partager</span>
              <span>Exposer</span>
              <span>Vibrer</span>
              <span>Ensemble</span>
            </div>
          </div>

          <aside className="sunnyPass">
            <span>SUNNY PASS</span>
            <p>Votre passeport culturel</p>
            <QrCodeMock />
            <strong>Carte membre</strong>
            <small>QR Code • Wallet • Crédits • Récompenses</small>
          </aside>
        </div>
      </section>

      <section className="benefitRibbon" aria-label="Actions principales">
        {[
          ["Réservez", "vos espaces en temps réel"],
          ["Participez", "aux ateliers créatifs"],
          ["Exposez", "vos œuvres et services"],
          ["Vendez", "sur la marketplace"],
          ["Financez", "vos projets culturels"],
          ["Apprenez", "avec SUNNY Academy"],
        ].map(([title, text]) => (
          <article key={title}>
            <span />
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="sectionBlock" id="concept">
        <SectionTitle
          eyebrow="Concept"
          title="Un écosystème premium pour l’association, les artistes et la communauté."
          text="La plateforme doit réunir vitrine publique, espace membre, réservation, marketplace, événements, projets, formation, IA et pilotage culturel."
        />
        <div className="conceptGrid">
          <article className="glassPanel largePanel">
            <span className="panelBadge">Objectif produit</span>
            <h3>Airbnb + Eventbrite + Patreon + LinkedIn + Notion, adapté à SUNNYVIBZ.</h3>
            <p>
              Chaque membre peut réserver, acheter, vendre, publier, apprendre, financer un
              projet et rejoindre des groupes, sans être limité à un seul rôle.
            </p>
          </article>
          <article className="glassPanel designSystemPanel">
            <span className="panelBadge">Design System</span>
            <div className="colorTokens">
              <i className="emerald" />
              <i className="gold" />
              <i className="black" />
              <i className="white" />
            </div>
            <p>Primary Emerald • Secondary Gold • Dark Black • Off White</p>
          </article>
        </div>
      </section>

      <section className="sectionBlock" id="espaces">
        <SectionTitle
          eyebrow="Espaces"
          title="Les univers SUNNYVIBZ deviennent des produits réservables."
          text="Chaque espace possède ses pages, ses disponibilités, ses événements, ses contenus et ses règles de paiement."
        />
        <div className="spaceGrid">
          {spaces.map((space) => (
            <article className="glowCard spaceCard" key={space.title}>
              <div className="spaceVisual">
                <SunnyLogo variant="gold" />
              </div>
              <span>{space.subtitle}</span>
              <h3>{space.title}</h3>
              <p>{space.body}</p>
              <strong>{space.stat}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionSplit" id="adhésion">
        <article className="glassPanel membershipPanel">
          <span className="panelBadge">Adhésion</span>
          <h2>Inscription en ligne, paiement, signature numérique, carte membre et QR Code.</h2>
          <p>
            Le parcours d’adhésion doit générer le SUNNY PASS, ouvrir le wallet, activer les
            crédits et donner accès aux réservations, projets, récompenses et messages.
          </p>
          <div className="timeline">
            {["Compte", "Rôles", "Paiement", "Signature", "Carte", "QR Code"].map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
        </article>

        <article className="memberDashboard">
          <SectionTitle
            eyebrow="Espace membre"
            title="Un dashboard personnel pour piloter toute l’expérience."
            text="SUNNY PASS, wallet, crédits, réservations, projets, récompenses et messages sont visibles en un coup d’œil."
          />
          <div className="widgetGrid">
            {memberModules.map((module, index) => (
              <div className="dashboardWidget" key={module}>
                <span>0{index + 1}</span>
                <strong>{module}</strong>
                <p>Widget verre fumé, glow et animation légère.</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="sectionBlock" id="marketplace">
        <SectionTitle
          eyebrow="Modules obligatoires"
          title="La plateforme complète, prête à être déclinée page par page."
          text="Chaque carte ci-dessous représente un futur module métier avec ses fonctionnalités clés."
        />
        <div className="moduleGrid">
          {platformModules.map((module) => (
            <article className="glowCard moduleCard" key={module.title}>
              <span className="moduleDot" />
              <h3>{module.title}</h3>
              <ul>
                {module.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionSplit" id="artistes">
        <article>
          <SectionTitle
            eyebrow="Profils artistes"
            title="Chaque artiste dispose d’une vraie vitrine professionnelle."
            text="Portfolio, galerie, vidéos, réseaux, événements et services doivent être reliés à la marketplace et aux réservations."
          />
          <div className="artistPills">
            {artists.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="glassPanel aiPanel">
          <span className="panelBadge">IA SUNNYVIBZ</span>
          <h3>Assistants intelligents pour accélérer la création et la gestion.</h3>
          <div className="assistantGrid">
            {["Artiste", "Projet", "Animateur", "Association", "Communication"].map((assistant) => (
              <span key={assistant}>Assistant {assistant}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="sectionBlock" id="sunny-events">
        <SectionTitle
          eyebrow="Sunny Events & Sunny Friday"
          title="Événementiel, billetterie, exposants et marchés créateurs."
          text="Calendrier, liste d’attente, réservation de stands, plan interactif, paiement et QR exposant."
        />
        <div className="eventsBoard">
          <article className="eventCard">
            <span>24 MAI</span>
            <strong>Sunny Friday</strong>
            <p>Marché des créateurs • stands • QR exposant</p>
          </article>
          <article className="eventCard">
            <span>28 MAI</span>
            <strong>Atelier peinture</strong>
            <p>Techniques mixtes • réservation temps réel</p>
          </article>
          <article className="eventCard">
            <span>05 JUIN</span>
            <strong>Exposition</strong>
            <p>Couleurs urbaines • billetterie • liste d’attente</p>
          </article>
        </div>
      </section>

      <section className="sectionBlock ceoDashboard">
        <SectionTitle
          eyebrow="CEO Dashboard"
          title="Un cockpit de direction pour piloter la croissance culturelle."
          text="Acquisition, conversion, fidélisation, engagement, CA, abonnements, marketplace, Sunny Friday, taux d’occupation et prévisions IA."
        />
        <div className="metricGrid">
          {ceoMetrics.map(([label, value, text]) => (
            <article className="metricCard" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBlock rolesBlock">
        <SectionTitle
          eyebrow="Gestion des rôles"
          title="Un utilisateur peut posséder plusieurs rôles simultanément."
          text="Ne jamais limiter un utilisateur à un seul rôle : SUNNYVIBZ doit refléter la réalité associative et culturelle."
        />
        <div className="roleCloud">
          {roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
