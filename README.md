# 🇨🇭 Xabier Iribar · Landing Page & Automation Showcase

[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **Site vitrine et vitrine technique de [xabieriribar.ch](https://xabieriribar.ch).**
> Une landing page ultra-performante, interactive et sécurisée, conçue pour promouvoir des solutions d'automatisation sur-mesure pour les PME, artisans et garages du canton de Vaud (Suisse).

---

## ✨ Points Forts & Architecture Technique

### 🗺️ Carte 3D Interactive du Canton de Vaud
*   **Technologie** : Rendu dynamique 3D propulsé par **Three.js** via un élément `<canvas>`.
*   **Modélisation** : Extrusion tridimensionnelle à partir d'un tracé SVG fidèle des frontières géographiques du Canton de Vaud.
*   **Esthétique Premium** : Matériau de type verre dépoli (*frosted glassmorphic physical material*) avec indice de réfraction réaliste, éclairage spéculaire directionnel croisé (blanc et bleu sarcelle) et contour néon luminescent.
*   **Indicateur de Proximité** : Un marqueur 3D orange néon clignotant localise précisément la présence physique à **Aclens / Région lausannoise**.
*   **Interactivité** : Support du glisser-déposer sur mobile et ordinateur pour orienter manuellement la carte avec un effet d'inertie physique et de tangage subtil au survol de la souris.

### 🛡️ Sécurité & Endpoint Serverless (`/api/contact`)
Conçu selon les standards de sécurité les plus rigoureux pour un site statique hébergé sur Vercel :
*   **Limites de Requête** : Payload maximum bridé à `16 KiB`, filtrage strict des en-têtes HTTP et type de contenu restreint au JSON/URL-encoded.
*   **Anti-Spam (Honeypot)** : Un champ invisible `website` piège les bots automatisés.
*   **Délai de Validation** : Détection des soumissions instantanées (souvent inhumaines) via JavaScript.
*   **Rate Limiting** : Protection *best-effort* en mémoire par adresse IP d'entrée.
*   **Emails Fiables** : Intégration robuste avec l'API **Resend** pour l'acheminement sécurisé des fiches clients avec détection d'erreurs et fallbacks.
*   **Headers HTTP Durcis** : CSP stricte, en-têtes anti-clickjacking (`frame-ancestors 'none'`), no-store, nosniff, et noindex sur les pages de remerciement.

### 📅 Intégration de Réservation Fluide
*   Parcours utilisateur principal connecté directement à **Google Calendar Appointment Schedule** pour un système de prise de rendez-vous fluide et sans friction.
*   Fallback dynamique vers le formulaire de contact standard si le lien de réservation n'est pas configuré.

---

## 🛠️ Stack Technique

*   **Framework Principal** : Astro v6 (Static Site Generation pour des performances SEO maximales)
*   **Styles CSS** : CSS moderne optimisé avec PostCSS et Tailwind CSS
*   **Rendu 3D** : Three.js + TypeScript
*   **Hébergement & Backend API** : Vercel (Edge Functions & Serverless)
*   **Service d'envoi d'emails** : Resend API

---

## 🚀 Installation & Développement Local

### Prérequis
*   Node.js (v18+)
*   npm

### 1. Cloner le projet et installer les dépendances
```bash
git clone https://github.com/Xabieriribar/xabier-iribar-landing.git
cd xabier-iribar-landing
npm install
```

### 2. Lancer le serveur de développement local
```bash
npm run dev
```
Astro démarrera le serveur sur [http://localhost:4321](http://localhost:4321).

### 3. Compiler pour la production
```bash
npm run build
```
Les fichiers statiques seront générés dans le dossier `dist/`.

---

## 🌐 Déploiement Vercel & Variables d'Environnement

Le site se déploie en un clic sur Vercel comme projet Astro statique avec des fonctions d'API activées.

### Configuration requise sur Vercel :
*   **Framework preset** : Astro
*   **Build command** : `npm run build`
*   **Output directory** : `dist`

### Variables d'environnement (`.env`) :
Configurez ces variables dans la console d'administration Vercel :

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `PUBLIC_BOOKING_URL` | URL de votre calendrier de réservation Google Calendar | `https://calendar.app.google/...` |
| `RESEND_API_KEY` | Clé d'API secrète de votre compte Resend | `re_123456789...` |
| `CONTACT_FROM_EMAIL` | Adresse d'expédition vérifiée sur Resend | `Xabier Iribar <contact@xabieriribar.ch>` |
| `CONTACT_TO_EMAIL` | Adresse email de destination des diagnostics | `contact@xabieriribar.ch` |
| `CONTACT_ALLOWED_ORIGINS` | *(Optionnel)* Liste de domaines autorisés CORS (séparés par virgules) | `https://xabieriribar.ch` |

> ⚠️ **Sécurité** : Ne commitez jamais de fichier `.env` contenant de vraies clés secrètes. Utilisez le fichier `.env.example` comme modèle.

---

## 📁 Structure du Projet

```text
├── api/                   # Serverless Functions (Vercel API endpoint /api/contact)
├── public/                # Assets statiques (Images, Favicons, Vecteurs)
│   ├── assets/            # Portraits et illustrations
│   └── favicon-*.png      # Icônes de marque et favicons optimisés
├── src/
│   ├── components/        # Composants de page Astro (Hero, About, UseCases...)
│   ├── layouts/           # Gabarit de page de base (HTML5, SEO Meta, JSON-LD)
│   ├── styles/            # Fichiers de styles globaux CSS
│   └── utils/             # Configurations centralisées SEO & Données d'entreprise
├── vercel.json            # Configuration des en-têtes HTTP de sécurité pour Vercel
├── astro.config.mjs       # Configuration Astro
├── tailwind.config.mjs    # Configuration Tailwind
└── package.json           # Scripts et dépendances
```

---

## 🔒 Guide Technique de Sécurité & Mise en Production

<details>
<summary><b>1. Checklist de déploiement en production</b></summary>

Avant d'ouvrir le site au public :
1.  Activer la clé `RESEND_API_KEY` sur l'environnement de Production Vercel.
2.  Valider la propriété du domaine `xabieriribar.ch` dans la console Resend.
3.  Vérifier la bonne configuration des enregistrements **SPF, DKIM et DMARC** chez le registraire DNS pour éviter les spams.
4.  Tester l'envoi réel du formulaire depuis le site déployé pour valider la réception.
5.  Vérifier l'absence d'indexation (`noindex`) sur la page `/merci`.
6.  Documenter la politique de conservation des données collectées via le formulaire.
</details>

<details>
<summary><b>2. Configuration de la réservation Google Calendar</b></summary>

Pour lier le calendrier gratuit Google :
1.  Allez sur `calendar.google.com`.
2.  Cliquez sur **Créer** > **Planning des rendez-vous** (Appointment schedule).
3.  Créez un événement nommé "Audit IA gratuit" (30 à 45 minutes).
4.  Définissez vos plages horaires de disponibilité, le délai de prévenance et les buffers.
5.  Générez le lien public de partage.
6.  Renseignez ce lien dans la variable `PUBLIC_BOOKING_URL` de votre console Vercel, puis redéployez.
</details>

<details>
<summary><b>3. Mise à jour des coordonnées centrales</b></summary>

Toutes les métadonnées de l'entreprise (téléphone, adresse WhatsApp, adresse mail, localisation physique, JSON-LD Schema.org) sont centralisées dans le fichier :
👉 `src/utils/seo.ts`

Modifiez directement cet unique fichier pour mettre à jour les coordonnées du site sans toucher au code HTML des pages.
</details>

---

## 👤 Auteur & Contact

*   **Nom** : Xabier Iribar
*   **Spécialité** : Automatisation administrative et simplification digitale pour PME & Artisans
*   **Localisation** : Aclens · Lausanne / Vaud (Suisse)
*   **Site Web** : [xabieriribar.ch](https://xabieriribar.ch)
*   **LinkedIn** : [Xabier Iribar](https://www.linkedin.com/in/xabier-iribar-revuelta-b85b09320/)
*   **GitHub** : [@Xabieriribar](https://github.com/Xabieriribar)
