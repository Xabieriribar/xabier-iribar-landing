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
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL` (ex: `Xabier Iribar <contact@xabieriribar.ch>` après vérification du domaine chez Resend)
   - `RESEND_FROM_EMAIL` (alias optionnel si vous préférez ce nom)
   - `CONTACT_TO_EMAIL` (optionnel, par défaut `contact@xabieriribar.ch`)

Les variables doivent être activées sur l’environnement concerné (`Production` pour le site public). Un nouveau déploiement est nécessaire après modification des variables Vercel.

Si Resend répond `403`, la fonction Vercel est bien appelée mais Resend refuse l’envoi. Vérifier que la clé API est valide, que le domaine exact utilisé dans `CONTACT_FROM_EMAIL` est vérifié dans Resend, et que ce n’est pas une adresse `resend.dev` utilisée pour envoyer vers un autre destinataire.

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
