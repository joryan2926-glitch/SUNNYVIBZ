const agenda = [
  {
    date: "Chaque vendredi",
    title: "Sunny Friday",
    text: "Marché créatif, rencontres artistes, stands exposants et ambiance musicale.",
  },
  {
    date: "Bientôt",
    title: "Ateliers créatifs",
    text: "Peinture, expression artistique, projets collectifs et initiation culturelle.",
  },
  {
    date: "Sur inscription",
    title: "Expositions & scènes ouvertes",
    text: "Un espace pour exposer, partager, performer et faire découvrir les talents locaux.",
  },
];

const gallery = [
  "Ateliers",
  "Expositions",
  "Artistes",
  "Culture urbaine",
  "Sunny Friday",
  "Communauté",
];

function SunnyLogo() {
  return (
    <span className="sunnyLogo" aria-label="Logo SUNNYVIBZ">
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

export default function Home() {
  return (
    <main className="siteShell">
      <div className="ambientGlow" />

      <header className="siteHeader">
        <a className="brand" href="#accueil" aria-label="Retour à l’accueil SUNNYVIBZ">
          <SunnyLogo />
          <span>
            <strong>SUNNYVIBZ</strong>
            <small>Pôle Art & Culture</small>
          </span>
        </a>

        <nav className="navLinks" aria-label="Navigation principale">
          <a href="#presentation">Présentation</a>
          <a href="#agenda">Agenda</a>
          <a href="#galerie">Galerie</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="accueil">
        <div className="heroCopy">
          <p className="eyebrow">Association culturelle • Création • Partage</p>
          <h1>
            SUNNYVIBZ
            <span>Pôle Art & Culture</span>
          </h1>
          <p className="heroText">
            Un lieu vivant pour créer, exposer, apprendre, rencontrer des artistes et faire
            rayonner les talents d’aujourd’hui.
          </p>
          <div className="heroActions">
            <a className="primaryButton" href="#presentation">
              Découvrir
            </a>
            <a className="secondaryButton" href="#agenda">
              Voir l’agenda
            </a>
          </div>
        </div>

        <div className="heroCard" aria-label="Carte d’ambiance SUNNYVIBZ">
          <div className="heroLogoWrap">
            <SunnyLogo />
          </div>
          <p>Créer</p>
          <p>Partager</p>
          <p>Vibrer ensemble</p>
        </div>
      </section>

      <section className="section presentation" id="presentation">
        <div>
          <p className="eyebrow">Présentation</p>
          <h2>Un espace artistique chaleureux pour connecter les talents et le public.</h2>
        </div>
        <div className="textPanel">
          <p>
            SUNNYVIBZ accompagne les artistes, les adhérents, les bénévoles et les partenaires
            autour d’une même énergie : rendre la culture accessible, visible et vivante.
          </p>
          <p>
            La plateforme servira progressivement à présenter l’association, annoncer les
            événements, gérer les inscriptions, valoriser les créations et faciliter les contacts.
          </p>
        </div>
      </section>

      <section className="section" id="agenda">
        <div className="sectionHeading">
          <p className="eyebrow">Événements & agenda</p>
          <h2>Les prochains rendez-vous SunnyVibz.</h2>
        </div>

        <div className="agendaGrid">
          {agenda.map((event) => (
            <article className="eventCard" key={event.title}>
              <span>{event.date}</span>
              <h3>{event.title}</h3>
              <p>{event.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="galerie">
        <div className="sectionHeading">
          <p className="eyebrow">Galerie</p>
          <h2>Une identité visuelle artistique, solaire et premium.</h2>
        </div>

        <div className="galleryGrid">
          {gallery.map((item, index) => (
            <article className="galleryCard" key={item}>
              <span>0{index + 1}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section contactSection" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Envie de rejoindre, exposer ou soutenir SUNNYVIBZ ?</h2>
          <p>
            Contactez l’association pour une adhésion, une collaboration, une exposition, un
            atelier ou un partenariat culturel.
          </p>
        </div>

        <div className="contactCard">
          <a href="mailto:contact@sunnyvibz.fr">contact@sunnyvibz.fr</a>
          <a href="https://sunnyvibz.fr">sunnyvibz.fr</a>
          <span>Art • Culture • Communauté</span>
        </div>
      </section>
    </main>
  );
}
