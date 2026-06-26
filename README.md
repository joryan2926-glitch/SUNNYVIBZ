# SUNNYVIBZ

Plateforme premium Art & Culture pour l’association SUNNYVIBZ.

## Vision

SUNNYVIBZ vise à devenir un écosystème culturel complet : réservations, ateliers, événements, Sunny Friday, talents, market créatif, abonnements, communauté, partenaires, projets, formation et outils IA.

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

## Pages du site

- Accueil : proposition claire + parcours Ateliers / Talents / Abonnements
- À propos : vision et valeurs de l’association
- Agenda : événements depuis Supabase
- Ateliers : ateliers, places restantes et réservation
- Sunny Friday : stands exposants, parcours créateurs, market événementiel
- Galerie : éléments publiés depuis Supabase
- Talents : profils créatifs actifs
- Market : offres, services, prestations, commandes à connecter
- Articles : contenus publiés uniquement
- Abonnements : Découverte, Artiste, Premium
- Connexion : Supabase Auth
- Mon compte : réservations et upload média talent
- Admin : création rapide ateliers, articles, talents, abonnements
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
- `subscriptions`
- `user_subscriptions`

Il prépare aussi :

- RLS et policies publiques / utilisateurs / admin
- Trigger de création de profil après inscription
- Trigger anti-surbooking pour les ateliers complets
- Bucket Supabase Storage `talent-media` pour photos/vidéos
- Candidatures exposants Sunny Friday

### Création des tables + données d’exemple

Dans Supabase, ouvrir `SQL Editor`, coller le contenu de `supabase/schema.sql`, puis exécuter le script.

Le site n’utilise ensuite que les variables publiques :

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

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
- Upload vidéo avancé : optimisation/transcodage éventuel.
