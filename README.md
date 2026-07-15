# xabieriribar.ch

Site commercial statique de Xabier Iribar, « Le mécanicien du numérique ». Il présente une activité de digitalisation pratique pour les garages, carrosseries, artisans, ateliers et petits services techniques de Lausanne et du canton de Vaud.

Le site a deux objectifs : obtenir des demandes de diagnostic qualifiées et démontrer une architecture web rapide, compréhensible et transférable à une petite entreprise.

## Stack réelle

- Astro 6 en génération entièrement statique ;
- TypeScript strict ;
- Tailwind CSS 4 compilé au build, complété par du CSS global et des styles Astro ;
- composants Astro sans React, Vue ou Svelte ;
- JavaScript vanilla uniquement pour l’amélioration du formulaire et le chargement volontaire du calendrier ;
- collection de contenu Astro typée pour les cas d’intervention ;
- sitemap Astro, `robots.txt`, `llms.txt` et JSON-LD ;
- aucun backend, CMS, compte utilisateur ou fonction Vercel.

Node.js **22.12 ou plus récent** est requis par Astro 6. Pour la production, Node 22 LTS est recommandé.

## Installation et développement

```bash
npm ci
npm run dev
```

Le serveur local est disponible par défaut sur `http://localhost:4321`.

Compilation de production :

```bash
npm ci && npm run build
```

Les fichiers à publier sont générés dans `dist/`.

## Scripts

| Commande                   | Rôle                                                                           |
| -------------------------- | ------------------------------------------------------------------------------ |
| `npm run dev`              | Développement Astro                                                            |
| `npm run og:generate`      | Génère les images sociales PNG à partir du gabarit SVG du script               |
| `npm run format`           | Formate les fichiers pris en charge                                            |
| `npm run format:check`     | Vérifie le formatage                                                           |
| `npm run check`            | Vérifie Astro et TypeScript                                                    |
| `npm run build`            | Génère les images sociales puis le site statique                               |
| `npm test`                 | Reconstruit puis vérifie routes, liens, sitemap, brouillons, JSON-LD et replis |
| `npm run preview`          | Sert le build localement                                                       |
| `npm run audit:lighthouse` | Sert `dist/` et lance Lighthouse mobile sur l’accueil                          |

Le rapport Lighthouse JSON est écrit dans `tmp/lighthouse.json`, dossier ignoré par Git.

## Configuration centrale

Les données métier, offres, prix, navigation, canaux et intégrations sont centralisés dans `src/config/business.ts`. Chaque valeur non confirmée est de type `ReviewableValue` et comporte une note de revue propriétaire.

Les variables publiques sont documentées dans `.env.example` :

| Variable                       | Usage                                              |
| ------------------------------ | -------------------------------------------------- |
| `PUBLIC_PHONE`                 | Téléphone public                                   |
| `PUBLIC_EMAIL`                 | E-mail public                                      |
| `PUBLIC_WHATSAPP_NUMBER`       | Numéro WhatsApp au format international            |
| `PUBLIC_FORM_ENDPOINT`         | Endpoint HTTPS acceptant un formulaire HTML `POST` |
| `PUBLIC_BOOKING_URL`           | URL HTTPS de réservation                           |
| `PUBLIC_ANALYTICS_DOMAIN`      | Domaine Plausible ; vide = aucun analytics         |
| `PUBLIC_LEGAL_NAME`            | Identité ou raison légale confirmée                |
| `PUBLIC_BUSINESS_REGISTRATION` | IDE/RC ou forme juridique confirmés, si applicable |
| `PUBLIC_POSTAL_ADDRESS`        | Adresse postale à rendre publique                  |
| `PUBLIC_PRIVACY_RETENTION`     | Durée ou critères de conservation                  |
| `PUBLIC_PORTRAIT_IMAGE`        | Chemin public ou URL du portrait validé            |

Les variables `PUBLIC_*` sont intégrées au build et ne doivent jamais contenir de secret. Aucun token, mot de passe ou clé privée n’est nécessaire au site.

## Formulaire statique

Quand `PUBLIC_FORM_ENDPOINT` est défini, `/contact/` affiche un formulaire HTML standard avec quatre champs et un honeypot. Il fonctionne sans JavaScript : le navigateur envoie directement le `POST` au processeur externe. Le script fourni ajoute seulement un état `aria-live` et des indications de validation ; il n’intercepte pas l’envoi.

Le champ caché `success_url` contient `/merci/`. Les conventions de redirection variant selon les prestataires, il faut adapter le nom de ce champ au processeur retenu et tester le parcours déployé.

Quand l’endpoint est absent, le formulaire n’est pas affiché : téléphone, WhatsApp et e-mail servent de repli sûr. L’ancienne route `/api/contact`, Resend et les variables Vercel ont été supprimés.

Le processeur reçoit des données personnelles. Vérifier son contrat, ses lieux de traitement, sa rétention et ses mesures anti-spam avant activation. Ne pas affirmer que les données restent en Suisse sans preuve.

## Réservation

`PUBLIC_BOOKING_URL` alimente les liens de réservation. Aucun embed n’est chargé sur l’accueil. Sur `/audit/`, l’iframe externe est créée seulement après un clic ; un lien direct et le formulaire restent disponibles.

Sans URL, les CTA renvoient vers `/contact/`. Après avoir choisi un prestataire, vérifier que sa page autorise l’intégration en iframe et adapter `frame-src` dans `public/.htaccess` à son domaine exact.

## Analytics et confidentialité

Plausible n’est chargé que si `PUBLIC_ANALYTICS_DOMAIN` contient une valeur. Le script utilise `defer`. Le site n’ajoute ni cookies, ni `localStorage`, ni `sessionStorage`, ni traceur publicitaire ; aucun bandeau cookie n’est donc affiché dans cette configuration.

La politique de confidentialité est conditionnelle à la configuration générée. Elle doit être revue si le formulaire, la réservation, l’hébergement, les analytics ou tout autre service externe changent.

## Modifier les offres

Éditer le tableau `business.offers` dans `src/config/business.ts`. Chaque offre contient : public adapté, inclusions, exclusions, implication du client, conditions de réalisation et prix indicatif. Le drapeau `needsOwnerReview` doit rester vrai tant que le montant n’a pas été confirmé.

La maintenance reste une offre facultative. Les corrections de défauts de la période d’acceptation, les coûts d’hébergement, les changements de contenu, les évolutions de services tiers et les nouvelles fonctions sont distingués.

## Publier un cas réel

Les cas se trouvent dans `src/content/cases/` et suivent le schéma de `src/content.config.ts`.

1. Copier le gabarit fictif et lui donner un slug descriptif.
2. Remplacer chaque texte par des faits validés.
3. Obtenir l’autorisation du client pour le nom, la citation et les images.
4. Retirer plaques, visages, documents, coordonnées et métadonnées inutiles.
5. Vérifier la méthode de mesure de chaque résultat.
6. Ajouter un texte alternatif utile aux images.
7. Passer `draft: false` seulement après cette revue.
8. Lancer `npm test` et vérifier le sitemap.

Les entrées `draft: true` sont exclues des chemins de production, des listes et du sitemap. Le modèle fictif n’est visible qu’en développement et porte un avertissement/noindex.

## Images

Le portrait fourni initialement a été transformé en variantes 384/640 px AVIF et WebP avec dimensions intrinsèques. Son authenticité et son droit d’usage restent à confirmer avant publication.

Pour remplacer une image :

- conserver une source originale hors du dossier `public` si elle n’a pas à être livrée ;
- créer au moins deux largeurs AVIF/WebP ;
- indiquer `width`, `height`, `srcset`, `sizes` et un texte alternatif ;
- charger paresseusement les images sous la ligne de flottaison ;
- ne jamais utiliser une image de stock pour représenter Xabier ou un client.

Les images sociales sont générées par `scripts/generate-og.mjs` avec Sharp. Modifier le tableau `pages` pour ajouter une variante, puis exécuter `npm run og:generate`.

## Structure utile

```text
public/
  .htaccess              # exemple d’en-têtes/routage Apache à tester
  llms.txt
  robots.txt
  og/                    # PNG sociaux générés
scripts/
  generate-og.mjs
src/
  components/            # composants Astro sans hydratation
  config/business.ts     # identité, canaux, offres, navigation
  content/cases/         # cas réels et brouillons
  content.config.ts      # schéma de collection
  layouts/BaseLayout.astro
  pages/                 # routes statiques
  styles/global.css
tests/site.test.mjs
DECISIONS.md
deploy.md
vercel.json              # redirection et en-têtes de la production actuelle
```

## Sécurité et limites connues

- La petite surface du site statique réduit les risques, mais le formulaire externe reste un système distinct à évaluer.
- `public/.htaccess` est un exemple pour Apache/Infomaniak. Tester chaque en-tête après publication ; un module indisponible est ignoré grâce aux blocs `IfModule`.
- La CSP autorise actuellement les formulaires et iframes HTTPS afin de garder les prestataires configurables. La resserrer aux domaines réellement choisis.
- Le diagnostic n’est pas un audit juridique, comptable ou complet de sécurité.
- Aucun client, témoignage, résultat, partenariat, délai ou classement Google n’est revendiqué sans preuve.
- `npm audit` doit être relancé avant chaque publication ; les vulnérabilités uniquement liées aux outils de développement sont documentées dans `DECISIONS.md`.

## Mise en production

La production actuelle est reliée à la branche `main` sur Vercel : un push
validé déclenche le build et la publication. `vercel.json` applique la
redirection historique et les en-têtes adaptés à cette plateforme. Voir
[deploy.md](deploy.md) pour cette procédure et pour l’alternative statique
Infomaniak.

Checklist minimale :

- confirmer téléphone, e-mail, WhatsApp et portrait ;
- valider identité légale, adresse et politique de conservation ;
- confirmer les prix et la question de la TVA ;
- choisir/tester le formulaire et la réservation ;
- compléter `.env` sans le committer ;
- exécuter `npm ci && npm run format:check && npm run check && npm test` ;
- vérifier le formulaire réel, la page merci, les en-têtes, HTTPS, sitemap et données structurées sur le domaine final.
