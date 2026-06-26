# SUNNYVIBZ

Plateforme premium Art & Culture pour l’association SUNNYVIBZ.

## Vision

SUNNYVIBZ révèle les talents, crée des rencontres culturelles et transforme l’énergie locale en expériences concrètes : ateliers, événements, Sunny Friday, profils talents, galerie, market créatif, réservations, abonnements, partenaires, contenus et futurs outils IA.

Le site n’est pas seulement une vitrine. Il prépare un écosystème culturel complet, proche d’un mélange entre agenda, réseau social créatif, marketplace, espace membre et plateforme événementielle.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase Auth, Database et Storage-ready via `.env.local`

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000).

## Vérification

```bash
npm run lint
npm run build
```

## Variables Vercel / Supabase

Créer les variables suivantes dans Vercel :

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Le site fonctionne uniquement avec ces deux variables publiques côté front. Le script SQL Supabase doit être exécuté manuellement dans le SQL Editor.

## Pages du site

- Accueil : promesse claire, hero premium, parcours, market, agenda, galerie, talents, preuve sociale et contact
- À propos : mission, positionnement, valeurs et ton de marque SunnyVibz
- Agenda : événements publiés depuis Supabase
- Ateliers : ateliers disponibles, places restantes, détail atelier et réservation
- Sunny Friday : rendez-vous des créateurs, exposants, stands, QR exposant et market événementiel
- Galerie : œuvres, moments, ateliers et créations publiés depuis Supabase
- Talents : profils actifs avec photos, vidéos, réseaux, services et futur mur social
- Partenaires : associations, entreprises, sponsors, lieux et structures culturelles
- Market : créations, prestations, services, commandes et mise en avant économique
- Articles : contenus publiés uniquement
- Abonnements : Essentielle 39 €/mois, Créative 65 €/mois, Premium 85 €/mois, Annuelle 720 €/an
- Connexion : Supabase Auth
- Mon compte : abonnement actuel, réservations, statut utilisateur, profil artiste actif/inactif et upload média talent
- FAQ : réponses simples sur SunnyVibz, ateliers, Sunny Friday, market et abonnements
- Admin : création rapide ateliers, articles, talents et abonnements
- Contact : formulaire connecté à `contact_messages`

## Base de données Supabase

Le schéma SQL est disponible dans :

```bash
supabase/schema.sql
```

Il crée les tables :

- `events`
- `artists`
- `gallery`
- `contact_messages`
- `workshops`
- `workshop_bookings`
- `sunny_friday_applications`
- `articles`
- `profiles`
- `subscription_plans`
- `user_subscriptions`

Il prépare aussi :

- RLS et policies publiques / utilisateurs / admin
- Trigger de création de profil après inscription
- Trigger anti-surbooking pour les ateliers complets
- Tarifs préférentiels ateliers et priorité Créative/Premium
- Bucket Supabase Storage `talent-media` pour photos/vidéos
- Candidatures exposants Sunny Friday

### Création des tables + données d’exemple

Dans Supabase, ouvrir `SQL Editor`, coller le contenu de `supabase/schema.sql`, puis exécuter le script.

### Créer le compte administrateur

1. Aller sur `/connexion`.
2. Créer un compte.
3. Récupérer l’id utilisateur dans Supabase Auth.
4. Exécuter :

```sql
update public.profiles
set is_admin = true
where id = 'TON_USER_ID';
```

### Vérifier la connexion Supabase

```bash
npm run supabase:check
```

Pour tester aussi l’insertion du formulaire de contact :

```bash
npm run supabase:check -- --write-contact
```

## À connecter avec des clés externes

- Paiement réel : Stripe, PayPal ou autre PSP.
- Emails automatiques : Resend, SendGrid, Brevo ou SMTP.
- Upload vidéo avancé : optimisation et transcodage éventuel.
- Modération des publications talent avant affichage public.
