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

## Déploiement

Le site est statique et peut être déployé sur Vercel, Netlify ou tout hébergeur statique.

Pour Netlify:

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Les formulaires HTML utilisent déjà `data-netlify="true"`.

Pour Vercel:

1. Framework preset: Astro
2. Build command: `npm run build`
3. Output directory: `dist`
4. Connecter le formulaire à un fournisseur externe si la collecte de demandes est nécessaire.

## Formulaire de contact

Les formulaires sont dans `src/components/ContactSection.astro`.

Ils sont configurés comme formulaires HTML classiques:

- `method="POST"`
- `action="/merci"`
- `data-netlify="true"`
- honeypot `website`

Options possibles:

- Netlify Forms: laisser la configuration actuelle.
- Formspree, Basin ou autre service: remplacer `action="/merci"` par l’URL du service.
- Resend ou autre provider email: créer une fonction serverless côté hébergeur et pointer `action` vers cette fonction.

Sans provider configuré, le site affiche aussi les liens directs email, téléphone et WhatsApp.

## Remplacer le visuel À propos

Le placeholder est dans `src/components/AboutSection.astro`.

Chercher le commentaire:

```html
<!-- TODO: replace this geometric placeholder with a real photo of Xabier when available. -->
```

Remplacer le bloc géométrique par une vraie image optimisée, par exemple:

```astro
<img
  src="/images/xabier-iribar.jpg"
  alt="Xabier Iribar"
  width="900"
  height="675"
  loading="lazy"
  decoding="async"
/>
```

Ajouter l’image dans `public/images/` et garder des dimensions fixes pour éviter le layout shift.

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

- `public/favicon.svg`
- `public/og-image.svg`

Les deux assets sont SVG et légers. Ils peuvent être remplacés sans toucher au code.
