# Xabier Iribar · Landing page

Site Astro statique pour `xabieriribar.ch`.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Astro affichera l’URL locale, en général `http://localhost:4321`.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Déploiement Vercel

Le site est statique côté Astro et inclut une Vercel Function pour envoyer les demandes de diagnostic par email.

1. Framework preset: Astro
2. Build command: `npm run build`
3. Output directory: `dist`
4. Variables d’environnement Vercel:
   - `PUBLIC_BOOKING_URL` (URL publique de la page Google Calendar Appointment Schedule)
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL` (ex: `Xabier Iribar <contact@xabieriribar.ch>` après vérification du domaine chez Resend)
   - `RESEND_FROM_EMAIL` (alias optionnel si vous préférez ce nom)
   - `CONTACT_TO_EMAIL` (optionnel, par défaut `contact@xabieriribar.ch`)
   - `CONTACT_ALLOWED_ORIGINS` (optionnel, liste séparée par des virgules pour domaines de preview ou alias)

Les variables doivent être activées sur l’environnement concerné (`Production` pour le site public). Un nouveau déploiement est nécessaire après modification des variables Vercel.

Si Resend répond `403`, la fonction Vercel est bien appelée mais Resend refuse l’envoi. Vérifier que la clé API est valide, que le domaine exact utilisé dans `CONTACT_FROM_EMAIL` est vérifié dans Resend, et que ce n’est pas une adresse `resend.dev` utilisée pour envoyer vers un autre destinataire.

Le fichier `.env.example` contient la liste des variables nécessaires. Ne jamais commiter un vrai fichier `.env`.

## Réservation d’audit IA gratuit

Le parcours principal du site pointe vers une page de réservation externe Google Calendar Appointment Schedule.

Choix technique:

- Google Calendar Appointment Schedule est l’option retenue pour garder un système gratuit/simple.
- Les visiteurs choisissent un créneau sur la page Google.
- Le rendez-vous est ajouté directement dans Google Calendar.
- Le site ne stocke aucun token Google et n’utilise pas l’API Google Calendar.
- Le formulaire `/api/contact` reste disponible comme fallback écrit via Resend.

Configuration manuelle:

1. Ouvrir `calendar.google.com` depuis un ordinateur.
2. Cliquer sur `Create` puis `Appointment schedule`.
3. Créer un rendez-vous nommé par exemple `Audit IA gratuit`.
4. Choisir une durée de 30 à 45 minutes.
5. Définir les disponibilités, le délai minimum de réservation, les buffers et le nombre maximum de rendez-vous par jour.
6. Choisir le format: Google Meet, téléphone ou à préciser plus tard.
7. Activer la vérification email si disponible pour limiter les réservations abusives.
8. Ajouter une description courte: emails, WhatsApp, Excel, devis, relances, dossiers.
9. Copier le lien public de réservation.
10. Ajouter ce lien dans Vercel sous `PUBLIC_BOOKING_URL` pour `Production`.
11. Redéployer le site.

Sans `PUBLIC_BOOKING_URL`, les boutons de réservation redirigent vers le formulaire de contact afin de ne pas casser le parcours.

Note confidentialité: la réservation est gérée par Google Calendar. Les informations saisies dans la page Google servent à organiser le rendez-vous et sont traitées selon les conditions et règles de confidentialité de Google. Ajouter cette information dans la future politique de confidentialité du site.

## Sécurité du formulaire

L’endpoint `/api/contact` applique les contrôles suivants:

- méthodes autorisées: `POST` et `OPTIONS`
- formats acceptés: `application/json` et `application/x-www-form-urlencoded`
- taille maximale de requête: `16 KiB`
- allowlist stricte des champs attendus
- limites serveur sur prénom, nom, email, entreprise et message
- validation serveur de l’email avant usage dans `reply_to`
- honeypot `website`
- délai minimal côté client quand JavaScript est actif
- rate limit best-effort en mémoire par IP d’entrée
- réponses génériques sans détails Resend côté client
- logs sans données personnelles complètes
- headers API `no-store`, `nosniff`, `noindex`, `frame-ancestors 'none'`

Le rate limit en mémoire est une défense légère adaptée à un petit site. Il ne remplace pas un rate limit au niveau du provider, WAF ou edge network.

## Headers HTTP

`vercel.json` ajoute des headers de base si le site est déployé sur Vercel:

- `Content-Security-Policy`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options`
- `Strict-Transport-Security`

Si le site est déployé sur Netlify, Cloudflare Pages ou un autre provider, reproduire ces headers dans la configuration équivalente. Garder `script-src 'unsafe-inline'` uniquement tant que le JSON-LD inline est présent dans `src/layouts/BaseLayout.astro`.

## Checklist de déploiement sécurisé

Avant la mise en production:

1. Configurer `RESEND_API_KEY` uniquement dans le provider de hosting.
2. Vérifier le domaine `xabieriribar.ch` dans Resend.
3. Configurer SPF, DKIM et DMARC pour le domaine d’envoi.
4. Utiliser `CONTACT_FROM_EMAIL` avec une adresse du domaine vérifié.
5. Configurer `CONTACT_TO_EMAIL` vers la boîte de réception attendue.
6. Ajouter les domaines de preview dans `CONTACT_ALLOWED_ORIGINS` si nécessaire.
7. Exécuter `npm ci`, `npm run build` et `npm audit`.
8. Partager uniquement un repo propre: pas de `.git`, `node_modules`, `.astro`, `.env` ni ZIP interne dans une archive source; `dist` doit être généré par le provider ou utilisé seul comme output statique.
9. Supprimer ou déplacer `new_landing.zip` hors du repo local avant partage ou packaging.
10. Vérifier en production les headers HTTP, `/merci` en `noindex` et l’envoi réel du formulaire.
11. Définir une durée de conservation des emails de contact et documenter le traitement dans une politique de confidentialité.

## Formulaire de contact

Les formulaires sont dans `src/components/ContactSection.astro`.

Ils gardent une base HTML sans JavaScript, puis un script améliore l’envoi vers:

```text
/api/contact
```

La fonction:

- envoie l’email à `contact@xabieriribar.ch`
- inclut prénom, nom, email, entreprise, message, source et timestamp
- génère un lien Google Maps à partir du nom d’entreprise
- utilise le honeypot `website`

Sans variables Resend configurées, le site affiche toujours les liens directs email, téléphone et WhatsApp.

## Assets

Le portrait et les logos sont dans `public/assets/`.

Les cartes logos optimisées pour le fond papier du site sont dans `public/assets/generated/`.

## Mettre à jour téléphone, email et domaine

Les informations centrales sont dans `src/utils/seo.ts`.

Modifier:

- `site.url`
- `site.email`
- `site.phone`
- `site.phoneHref`
- `site.whatsappHref`

## QR code carte de visite

La cible recommandée pour un QR code est:

```text
https://xabieriribar.ch/diagnostic
```

Cette page est courte, statique et pensée pour une ouverture rapide depuis mobile.

## Favicon et image sociale

- `public/favicon-32.png`
- `public/favicon-192.png`
- `public/favicon-512.png`
- `public/apple-touch-icon.png`
- `public/og-image.svg`

Le favicon raster a été généré pour rester lisible à petite taille.
