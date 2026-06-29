# Dossier complet du site SUNNYVIBZ

Ce document sert de guide central pour comprendre, gérer et faire évoluer le site SunnyVibz.

SunnyVibz doit être pensé comme une plateforme Art & Culture premium : une vitrine moderne, mais aussi un futur écosystème avec réservations, abonnements, talents, événements, market, communauté et espace membre.

---

## 1. Vision du site

SUNNYVIBZ est une plateforme dédiée à l’art, la culture et la mise en avant des talents.

L’objectif n’est pas seulement de présenter une association. Le site doit devenir un vrai outil pour :

- faire connaître le projet ;
- présenter les espaces et les événements ;
- vendre ou réserver des expériences ;
- gérer les ateliers ;
- mettre en avant les talents ;
- créer une communauté ;
- proposer des abonnements ;
- préparer un market créatif ;
- connecter partenaires, artistes, exposants, membres et public.

La direction globale : un écosystème premium, chaleureux, artistique et moderne.

---

## 2. Identité visuelle

Le design doit rester fidèle à la maquette validée :

- fond noir profond ;
- vert émeraude lumineux ;
- doré luxe ;
- cartes avec glow ;
- glassmorphism léger ;
- boutons arrondis ;
- animations douces ;
- ambiance moderne type Apple / Tesla / Stripe / Notion, mais adaptée au monde culturel.

À éviter :

- trop de couleurs différentes ;
- textes trop gros partout ;
- pages trop chargées ;
- visuels génériques sans lien avec l’art ou la culture ;
- ton trop administratif.

À privilégier :

- phrases courtes ;
- bénéfices clairs ;
- visuels forts ;
- appels à l’action simples ;
- présentation premium mais accessible.

---

## 3. Stack technique

Le site utilise :

- Next.js ;
- React ;
- TypeScript ;
- Tailwind CSS ;
- Supabase pour la base de données, l’authentification et le storage ;
- Vercel pour le déploiement.

Commandes principales :

```bash
npm install
npm run dev
npm run lint
npm run build
npm run readiness:check
```

Pour lancer le site en local :

```bash
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

---

## 4. Variables Supabase / Vercel

Le site doit fonctionner avec ces variables :

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Elles doivent être mises :

- dans `.env.local` en local ;
- dans Vercel, section Environment Variables.

Ne pas utiliser `SUPABASE_DATABASE_URL` pour ce projet côté front.

---

## 5. Pages existantes

### Accueil `/`

Rôle : présenter l’univers SunnyVibz rapidement.

Contenu :

- hero premium ;
- promesse Art & Culture ;
- accès aux ateliers, talents, abonnements, market ;
- agenda ;
- galerie ;
- preuve sociale ;
- contact.

But : donner envie de découvrir, réserver, rejoindre ou contacter.

### Comment ça marche `/comment-ca-marche`

Rôle : expliquer la logique globale de la plateforme.

Cette page montre le parcours :

- découvrir ;
- réserver ;
- adhérer ;
- participer ;
- être visible ;
- vendre et soutenir.

Elle sert de boussole pour comprendre que SunnyVibz se construit progressivement : fondation, économie, communauté.

### À propos `/a-propos`

Rôle : expliquer la mission.

À mettre en avant :

- révéler les talents ;
- créer des rencontres ;
- structurer une communauté culturelle ;
- transformer les idées en projets réels.

### Agenda `/agenda`

Rôle : afficher les événements.

Données : table Supabase `events`.

À prévoir ensuite :

- filtres par catégorie ;
- billetterie ;
- liste d’attente ;
- QR code événement.

### Ateliers `/ateliers`

Rôle : afficher les ateliers disponibles.

Chaque atelier doit montrer :

- titre ;
- description ;
- image ;
- date ;
- lieu ;
- tarif ;
- capacité ;
- places restantes ;
- statut disponible / complet ;
- priorité abonnés.

Les détails sont disponibles sur :

```text
/ateliers/[slug]
```

### Sunny Friday `/sunny-friday`

Rôle : présenter le rendez-vous créateurs / exposants.

Modules prévus :

- candidature exposant ;
- réservation de stand ;
- besoins techniques ;
- QR exposant ;
- lien avec le market ;
- mise en avant des talents.

### Galerie `/galerie`

Rôle : afficher les visuels, œuvres, ambiances et moments.

Données : table Supabase `gallery`.

À faire évoluer vers :

- upload média ;
- filtres ;
- profils talents liés ;
- vidéos ;
- modération.

### Talents `/talents`

Rôle : mettre en avant les artistes, créateurs, photographes, peintres, sculpteurs, musiciens, intervenants et partenaires créatifs.

Détails :

```text
/talents/[slug]
```

Important : préférer le mot “talents” plutôt que “artistes” seulement, car SunnyVibz peut sublimer plusieurs disciplines.

### Market `/marketplace`

Rôle : préparer le futur moteur économique.

Il doit permettre à terme :

- vente de créations ;
- réservation de prestations ;
- commandes ;
- services artistiques ;
- offres partenaires ;
- paiement ;
- lien avec les profils talents.

### Abonnements `/abonnements`

Rôle : présenter les formules officielles.

Formules actuelles :

| Formule | Prix | Engagement | Position |
|---|---:|---|---|
| Essentielle | 39 € / mois | 3 mois | Découverte du lieu |
| Créative | 65 € / mois | 3 mois | Offre principale |
| Premium | 85 € / mois | 3 mois | Accès élargi |
| Annuelle | 720 € / an | 12 mois | Fidélisation |

Créative est l’offre à pousser en priorité.

### Connexion `/connexion`

Rôle : inscription / connexion avec Supabase Auth.

Permet ensuite d’accéder à :

```text
/mon-compte
```

### Mon compte `/mon-compte`

Rôle : espace membre.

Affiche :

- email utilisateur ;
- statut utilisateur ;
- abonnement actuel ;
- profil artiste actif / inactif ;
- réservations d’ateliers ;
- upload média talent.

### Admin `/admin`

Rôle : base d’administration simple.

Permet de créer rapidement :

- ateliers ;
- articles ;
- talents ;
- formules d’abonnement.

Important : l’accès dépend du champ `is_admin` dans la table `profiles`.

### Contact `/contact`

Rôle : recevoir les demandes.

Données : table Supabase `contact_messages`.

### FAQ `/faq`

Rôle : répondre simplement aux questions fréquentes.

---

## 6. Base de données Supabase

Le fichier principal est :

```text
supabase/schema.sql
```

Il doit être exécuté dans :

```text
Supabase → SQL Editor
```

Tables principales :

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

Le SQL configure aussi :

- RLS ;
- policies ;
- données d’exemple ;
- trigger de création de profil ;
- trigger anti-surbooking atelier ;
- bucket `talent-media`.

---

## 7. Ordre correct pour configurer Supabase

1. Aller dans Supabase.
2. Ouvrir SQL Editor.
3. Copier tout le contenu de :

```text
supabase/schema.sql
```

4. Exécuter le script.
5. Attendre la fin sans erreur.
6. Vérifier les tables dans Table Editor.
7. Vérifier que les données d’exemple existent.
8. Tester le site.

Ensuite, en local :

```bash
npm run platform:check
```

Si tout est bon, les tables doivent être lisibles.

---

## 8. Créer un compte admin

1. Aller sur `/connexion`.
2. Créer un compte.
3. Aller dans Supabase Auth.
4. Copier l’id utilisateur.
5. Exécuter dans SQL Editor :

```sql
update public.profiles
set is_admin = true
where id = 'TON_USER_ID';
```

Ensuite, retourner sur :

```text
/admin
```

---

## 9. Réservations d’ateliers

Logique actuelle :

- une personne remplit le formulaire ;
- le site vérifie l’atelier ;
- si l’atelier est complet, réservation bloquée ;
- sinon, insertion dans `workshop_bookings` ;
- le trigger Supabase décrémente `seats_remaining`.

À surveiller :

- ne pas modifier manuellement `seats_remaining` n’importe comment ;
- ne pas supprimer un atelier avec des réservations sans vérifier ;
- bien garder les statuts : `available`, `full`, `cancelled`.

À améliorer plus tard :

- confirmation email automatique ;
- paiement ;
- QR code réservation ;
- liste d’attente ;
- annulation depuis le compte ;
- validation admin.

---

## 10. Abonnements

Table :

```text
subscription_plans
```

Formules :

- Essentielle ;
- Créative ;
- Premium ;
- Annuelle.

Table de liaison utilisateur :

```text
user_subscriptions
```

À faire ensuite :

- connecter Stripe ou autre paiement ;
- créer automatiquement une ligne dans `user_subscriptions` après paiement ;
- afficher les droits exacts dans `/mon-compte` ;
- limiter certains accès selon la formule.

---

## 11. Market

Le market est stratégique.

Il doit devenir le moteur économique du site, avec :

- créations ;
- prestations ;
- services ;
- commandes ;
- paiements ;
- lien avec profil talent ;
- lien avec Sunny Friday ;
- commissions éventuelles.

Priorité recommandée :

1. Créer table `market_items`.
2. Créer page détail offre.
3. Ajouter bouton “Commander” ou “Demander”.
4. Ajouter paiement.
5. Ajouter suivi commande dans `/mon-compte`.

---

## 12. Talents et futur réseau social

Aujourd’hui :

- profils talents ;
- pages détail ;
- upload média dans mon compte.

À faire :

- table `talent_media` ;
- modération admin ;
- mur social ;
- likes / commentaires plus tard ;
- vidéos ;
- portfolio public ;
- services liés au market.

Important : ne pas ouvrir un réseau social complet trop tôt. Il faut d’abord bien gérer :

- profils ;
- médias ;
- modération ;
- signalement ;
- droits d’auteur.

---

## 13. Contenu à préparer

Pour rendre le site plus fort, il faut préparer :

- vraies photos du lieu ;
- vraies photos d’ateliers ;
- portraits des talents ;
- logo final en bonne qualité ;
- textes courts pour chaque espace ;
- dates réelles des événements ;
- offres market concrètes ;
- tarifs exacts ;
- règlement intérieur ;
- conditions d’adhésion ;
- politique de confidentialité ;
- mentions légales.

Pages légales à ajouter :

- `/mentions-legales` : base créée, à compléter avec les informations officielles ;
- `/confidentialite` : base créée, à valider juridiquement ;
- `/conditions` : base créée, à compléter avant paiement réel.

---

## 14. SEO

Déjà présent :

- metadata Next.js ;
- sitemap ;
- robots ;
- pages structurées.

À améliorer :

- ajouter images Open Graph ;
- ajouter vraie adresse ;
- ajouter données structurées JSON-LD ;
- optimiser titres par ville/quartier ;
- créer articles réguliers ;
- travailler les mots-clés :
  - ateliers créatifs ;
  - art et culture ;
  - exposition ;
  - marché créateurs ;
  - artistes locaux ;
  - espace créatif ;
  - association culturelle.

---

## 15. Déploiement Vercel

Workflow normal :

1. Modifier le code.
2. Tester :

```bash
npm run lint
npm run build
```

3. Commit :

```bash
git add .
git commit -m "message clair"
```

4. Push :

```bash
git push origin main
```

5. Vercel redéploie automatiquement.

À vérifier dans Vercel :

- domaine `sunnyvibz.fr` connecté ;
- variables Supabase présentes ;
- dernier déploiement en succès.

---

## 16. Diagnostic global

Une commande de diagnostic a été ajoutée :

```bash
npm run readiness:check
```

Elle sert à voir rapidement si la plateforme est prête ou non.

Elle vérifie :

- variables Supabase présentes ;
- tables attendues dans le schéma SQL ;
- tables réellement lisibles dans Supabase ;
- variables Stripe à connecter ;
- variable email à connecter ;
- email de notification admin à connecter.

Si la commande indique `MANQUANT remote workshops`, `MANQUANT remote articles` ou `MANQUANT remote subscription_plans`, cela veut dire que le SQL n’a pas encore été exécuté dans Supabase SQL Editor.

---

## 17. Méthode pour bien travailler

Ne pas tout faire en même temps.

Ordre recommandé :

### Priorité 1 — Fondation

- Exécuter le SQL Supabase ;
- vérifier toutes les tables ;
- vérifier contact ;
- vérifier ateliers ;
- vérifier abonnements ;
- créer compte admin.

### Priorité 2 — Contenu réel

- remplacer les textes exemple ;
- ajouter vraies images ;
- ajouter vrais événements ;
- ajouter vrais ateliers ;
- ajouter vrais talents.

### Priorité 3 — Paiement

- connecter Stripe ;
- paiement abonnements ;
- paiement ateliers ;
- paiement stands Sunny Friday ;
- paiement market.

### Priorité 4 — Admin sérieux

- modifier / supprimer les contenus ;
- gérer les réservations ;
- gérer les abonnés ;
- gérer les candidatures Sunny Friday ;
- modérer les médias.

### Priorité 5 — Communauté

- profils avancés ;
- publications ;
- commentaires ;
- groupes ;
- messages.

---

## 18. Checklist avant mise en production forte

- [ ] SQL Supabase exécuté.
- [ ] Variables Vercel configurées.
- [ ] Domaine connecté.
- [ ] Compte admin créé.
- [ ] Formulaire contact testé.
- [ ] Réservation atelier testée.
- [ ] Abonnements visibles.
- [ ] Pages mobile vérifiées.
- [ ] Mentions légales ajoutées.
- [ ] Politique de confidentialité ajoutée.
- [ ] Paiement sécurisé si vente réelle.
- [ ] Emails automatiques configurés.
- [ ] Sauvegarde de la base prévue.

---

## 19. Actions externes que Codex ne peut pas faire seul

Certaines actions demandent des accès ou informations officielles. Codex peut préparer le code, mais il faut fournir ou faire ces étapes :

- exécuter `supabase/schema.sql` dans Supabase SQL Editor ;
- créer le vrai compte administrateur et passer `is_admin = true` ;
- fournir les informations légales officielles : adresse, représentant, email, RNA/SIRET si applicable ;
- fournir les liens officiels Instagram, TikTok, Facebook ;
- créer/configurer le compte Stripe ou autre paiement ;
- fournir les clés email Resend, Brevo, SendGrid ou SMTP ;
- décider les vraies conditions de vente et remboursement ;
- fournir les vraies images, événements, talents et offres Market.

---

## 20. Erreurs à éviter

- Changer la base Supabase sans mettre à jour les types dans `lib/supabase/types.ts`.
- Modifier une table sans adapter `supabase/schema.sql`.
- Mettre des clés privées dans le code.
- Faire payer sans conditions générales.
- Autoriser les uploads sans modération.
- Ajouter trop de modules avant que les bases soient stables.
- Oublier de tester mobile.
- Utiliser plusieurs noms pour la même chose : garder “Talents”, “Sunny Friday”, “Market”, “Abonnements”.

---

## 21. Résumé simple

SunnyVibz doit avancer en 3 temps :

1. Rendre le site propre, crédible et complet.
2. Connecter les vraies données, réservations, abonnements et paiements.
3. Transformer le site en plateforme communautaire et économique.

La bonne stratégie : solide d’abord, spectaculaire ensuite.

Le site a déjà une bonne base. Maintenant, la priorité est d’exécuter le SQL Supabase, d’ajouter du vrai contenu et de connecter les paiements quand les offres sont prêtes.
