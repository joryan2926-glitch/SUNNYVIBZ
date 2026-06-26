# SUNNYVIBZ

Plateforme premium Art & Culture pour l’association SUNNYVIBZ.

## Vision

SUNNYVIBZ vise à devenir un écosystème culturel complet : réservations, ateliers, événements, communauté, artistes, marketplace, projets, formation et outils IA.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase-ready via `.env.local`

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

- Accueil : hero, présentation, agenda, galerie, artistes, appel au contact
- À propos : vision et valeurs de l’association
- Agenda : événements depuis Supabase
- Galerie : éléments publiés depuis Supabase
- Artistes : profils artistes depuis Supabase
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

### Création des tables + données d’exemple

Dans Supabase, ouvrir `SQL Editor`, coller le contenu de `supabase/schema.sql`, puis exécuter le script.

Le site n’utilise ensuite que les variables publiques :

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Vérifier la connexion Supabase

```bash
npm run supabase:check
```

Pour tester aussi l’insertion du formulaire de contact :

```bash
npm run supabase:check -- --write-contact
```
