type ReviewableValue = {
  value: string;
  needsOwnerReview: boolean;
  reviewNote: string;
};

type Offer = {
  id: string;
  name: string;
  eyebrow: string;
  price: ReviewableValue;
  summary: string;
  suitableFor: string;
  included: string[];
  excluded: string[];
  clientInvolvement: string;
  deliveryConditions: string;
};

const publicValue = (name: string) => {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
};

const reviewable = (
  value: string,
  reviewNote: string,
  needsOwnerReview = !value,
): ReviewableValue => ({ value, needsOwnerReview, reviewNote });

const safeExternalUrl = (value: string) => {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
};

const phone = publicValue("PUBLIC_PHONE") || "+41 78 331 93 30";
const email = publicValue("PUBLIC_EMAIL") || "contact@xabieriribar.ch";
const whatsappNumber = publicValue("PUBLIC_WHATSAPP_NUMBER") || "+41783319330";
const bookingUrl = safeExternalUrl(publicValue("PUBLIC_BOOKING_URL"));
const formEndpoint = safeExternalUrl(publicValue("PUBLIC_FORM_ENDPOINT"));
const analyticsDomain = publicValue("PUBLIC_ANALYTICS_DOMAIN");
const digits = (value: string) => value.replace(/[^+\d]/g, "");

export const business = {
  identity: {
    name: "Xabier Iribar",
    brandLine: "Le mécanicien du numérique",
    legalName: reviewable(
      publicValue("PUBLIC_LEGAL_NAME"),
      "Confirmer le nom ou la raison individuelle à afficher dans les mentions légales.",
    ),
    registration: reviewable(
      publicValue("PUBLIC_BUSINESS_REGISTRATION"),
      "Ajouter uniquement un numéro IDE/RC ou une forme juridique confirmés.",
    ),
    postalAddress: reviewable(
      publicValue("PUBLIC_POSTAL_ADDRESS"),
      "Confirmer si une adresse postale doit être rendue publique.",
    ),
  },
  site: {
    url: "https://xabieriribar.ch",
    locale: "fr-CH",
    language: "fr",
    defaultTitle:
      "Digitalisation pratique pour petites entreprises vaudoises | Xabier Iribar",
    defaultDescription:
      "Xabier Iribar simplifie un flux administratif ou commercial concret pour les garages, artisans et ateliers de Lausanne et du canton de Vaud.",
  },
  location: {
    base: "Aclens, canton de Vaud",
    serviceArea: "Lausanne et région, Ouest lausannois, Morges et Gros-de-Vaud",
    sectors: [
      "Garages",
      "Carrosseries",
      "Artisans",
      "Ateliers",
      "Petits services techniques",
    ],
  },
  contact: {
    phone: reviewable(
      phone,
      "Numéro retrouvé dans le dépôt initial ; confirmer qu’il peut être publié.",
      !phone,
    ),
    phoneHref: phone ? `tel:${digits(phone)}` : "",
    email: reviewable(
      email,
      "Adresse retrouvée dans le dépôt initial ; confirmer la boîte de réception.",
      !email,
    ),
    emailHref: email ? `mailto:${email}` : "",
    whatsappNumber: reviewable(
      whatsappNumber,
      "Numéro retrouvé dans le dépôt initial ; confirmer qu’il est relié à WhatsApp.",
      !whatsappNumber,
    ),
    whatsappHref: whatsappNumber
      ? `https://wa.me/${digits(whatsappNumber).replace("+", "")}?text=${encodeURIComponent(
          "Bonjour Xabier, je souhaite demander un diagnostic pour un problème concret dans mon entreprise.",
        )}`
      : "",
  },
  integrations: {
    bookingUrl: reviewable(
      bookingUrl,
      "Ajouter l’URL HTTPS du service de réservation choisi.",
    ),
    bookingHref: bookingUrl || "/contact/",
    formEndpoint: reviewable(
      formEndpoint,
      "Ajouter l’URL HTTPS du processeur de formulaire et vérifier son lieu de traitement.",
    ),
    analyticsDomain: reviewable(
      analyticsDomain,
      "Laisser vide pour ne charger aucun analytics ; sinon indiquer le domaine Plausible.",
    ),
    privacyRetention: reviewable(
      publicValue("PUBLIC_PRIVACY_RETENTION"),
      "Définir une durée ou des critères de suppression réalistes pour les demandes.",
    ),
  },
  portrait: reviewable(
    publicValue("PUBLIC_PORTRAIT_IMAGE") ||
      "/assets/xabier-iribar-portrait-640.webp",
    "Confirmer que le portrait représente Xabier et que son usage commercial est autorisé.",
    true,
  ),
  socials: {
    linkedin: "https://www.linkedin.com/in/xabier-iribar-revuelta-b85b09320/",
    github: "https://github.com/Xabieriribar",
  },
  diagnostic: {
    price: "Gratuit",
    format:
      "Un premier échange par téléphone, en visioconférence ou sur place lorsque cela apporte quelque chose.",
    deliverable:
      "La friction principale identifiée, un avis initial sur la pertinence d’agir et une prochaine étape proposée si utile.",
  },
  cta: {
    primary: "Demander un diagnostic",
  },
  offers: [
    {
      id: "diagnostic",
      name: "Diagnostic initial",
      eyebrow: "Étape 01 · comprendre",
      price: reviewable(
        "Gratuit",
        "Confirmer le maintien de la gratuité.",
        true,
      ),
      summary:
        "Nous partons d’une situation réelle : appel manqué, photos dispersées, devis préparés le soir ou informations recopiées.",
      suitableFor:
        "Une entreprise qui sait où cela coince, même sans savoir quelle solution choisir.",
      included: [
        "Un échange court autour d’un seul flux de travail",
        "L’identification de la friction principale",
        "Un premier avis sur l’utilité d’une intervention",
        "Une prochaine étape proposée quand elle est justifiée",
      ],
      excluded: [
        "Audit complet de l’entreprise",
        "Rapport de conseil détaillé",
        "Prototype livré ou gain garanti",
      ],
      clientInvolvement:
        "Montrer un exemple réel et expliquer qui fait quoi aujourd’hui.",
      deliveryConditions:
        "Téléphone, visioconférence ou visite locale selon le problème et les disponibilités.",
    },
    {
      id: "cadrage",
      name: "Cadrage ou prototype",
      eyebrow: "Étape 02 · vérifier",
      price: reviewable(
        "À partir de CHF 450",
        "Prix hérité du dépôt initial mais repositionné ; valider avant publication.",
        true,
      ),
      summary:
        "Un petit engagement payé pour vérifier la faisabilité et écrire le périmètre avant de construire.",
      suitableFor:
        "Un usage borné dont il faut confirmer les données, dépendances ou limites.",
      included: [
        "Flux actuel et flux proposé",
        "Dépendances, hypothèses et principaux risques",
        "Estimation de la mise en œuvre",
        "Prototype simple ou validation de faisabilité si pertinent",
        "Périmètre écrit",
      ],
      excluded: [
        "Solution de production",
        "Intégrations illimitées",
        "Conseil global",
      ],
      clientInvolvement:
        "Fournir des exemples non sensibles, valider les étapes et répondre aux questions métier.",
      deliveryConditions:
        "Démarre après accord écrit sur le cas étudié et les informations accessibles.",
    },
    {
      id: "implementation",
      name: "Mise en œuvre bornée",
      eyebrow: "Étape 03 · installer",
      price: reviewable(
        "CHF 1’500–4’500",
        "Fourchette de qualification proposée ; confirmer les seuils et la TVA.",
        true,
      ),
      summary:
        "Installation d’un seul flux défini, testé avec les personnes qui l’utiliseront, puis documenté.",
      suitableFor:
        "Un processus stable avec un résultat attendu, un responsable côté client et des outils identifiés.",
      included: [
        "Un processus défini",
        "Intégrations limitées et configuration",
        "Tests par étapes avec validation humaine",
        "Documentation, transfert et formation",
        "Période de correction convenue par écrit",
      ],
      excluded: [
        "ERP complet ou e-commerce complexe",
        "Migration comptable complète",
        "Révisions ou support illimités",
        "Système critique exigeant une équipe spécialisée",
        "Décision importante prise sans validation humaine",
      ],
      clientInvolvement:
        "Nommer un interlocuteur, donner les accès nécessaires dans des comptes appartenant au client et tester les scénarios convenus.",
      deliveryConditions:
        "Calendrier établi après cadrage, selon les outils tiers, les accès et la disponibilité des utilisateurs.",
    },
    {
      id: "site-internet",
      name: "Site compact et prise de contact",
      eyebrow: "Offre dédiée · être trouvable",
      price: reviewable(
        "CHF 1’800–3’800",
        "Fourchette proposée pour un site compact ; confirmer les seuils et la TVA.",
        true,
      ),
      summary:
        "Un site rapide et mobile qui explique le métier, facilite la demande et pose des bases locales propres.",
      suitableFor:
        "Une petite entreprise dont les clients doivent comprendre, appeler, écrire ou demander un rendez-vous facilement.",
      included: [
        "Site professionnel compact, mobile-first",
        "Services et chemins de contact clairs",
        "Fondations de référencement local",
        "Formulaire ou demande de rendez-vous si le flux s’y prête",
        "Analytics simple en option et documentation de reprise",
        "Domaine et comptes appartenant au client",
      ],
      excluded: [
        "Garantie de position Google",
        "Réservation en ligne forcée si elle ne convient pas au métier",
        "Rédaction ou photographie illimitées",
        "E-commerce complexe",
      ],
      clientInvolvement:
        "Valider les textes, fournir les preuves et photos utilisables, puis tester les demandes reçues.",
      deliveryConditions:
        "Le périmètre dépend du contenu disponible, des langues et des services externes choisis.",
    },
    {
      id: "maintenance",
      name: "Maintenance optionnelle",
      eyebrow: "Après livraison · si utile",
      price: reviewable(
        "Sur devis séparé",
        "Définir les formules seulement après validation de la capacité réelle.",
        true,
      ),
      summary:
        "Un cadre distinct pour les changements de contenu, les outils tiers ou le support après la période de correction.",
      suitableFor:
        "Les clients qui souhaitent déléguer des vérifications ou des évolutions précises.",
      included: [
        "Périmètre, fréquence et canal de demande écrits",
        "Interventions prévues dans l’enveloppe convenue",
        "Suivi des dépendances explicitement listées",
      ],
      excluded: [
        "Hébergement et licences tierces sauf mention contraire",
        "Nouvelle fonctionnalité non cadrée",
        "Disponibilité permanente ou intervention illimitée",
      ],
      clientInvolvement:
        "Signaler les changements métier et valider les interventions qui affectent le fonctionnement.",
      deliveryConditions:
        "Contrat facultatif, séparé du transfert et résiliable selon les conditions écrites.",
    },
  ] satisfies Offer[],
  navigation: [
    { href: "/offres/", label: "Offres" },
    { href: "/methode/", label: "Méthode" },
    { href: "/a-propos/", label: "À propos" },
    { href: "/contact/", label: "Contact" },
  ],
} as const;

export type BusinessConfig = typeof business;
export type BusinessOffer = (typeof business.offers)[number];

export const canonical = (path = "/") =>
  new URL(path, business.site.url).toString();

export const publicCasesOnly = <T extends { data: { draft: boolean } }>(
  entries: T[],
) => entries.filter((entry) => !entry.data.draft);
