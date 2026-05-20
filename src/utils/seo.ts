const configuredBookingHref = (import.meta.env.PUBLIC_BOOKING_URL || "").trim();

export const site = {
  name: "Xabier Iribar",
  subtitle: "Automatisation pour PME locales",
  url: "https://xabieriribar.ch",
  email: "contact@xabieriribar.ch",
  phone: "+41 78 331 93 30",
  phoneHref: "tel:+41783319330",
  linkedinHref: "https://www.linkedin.com/in/xabier-iribar-revuelta-b85b09320/",
  githubHref: "https://github.com/Xabieriribar",
  bookingProvider: "Google Calendar",
  bookingHref: configuredBookingHref || "/#contact",
  bookingIsConfigured: Boolean(configuredBookingHref),
  whatsappMessage:
    "Bonjour Xabier, je souhaite réserver un diagnostic gratuit pour voir comment simplifier les processus de mon entreprise.",
  whatsappHref:
    "https://wa.me/41783319330?text=Bonjour%20Xabier%2C%20je%20souhaite%20r%C3%A9server%20un%20diagnostic%20gratuit%20pour%20voir%20comment%20simplifier%20les%20processus%20de%20mon%20entreprise.",
  location: "Aclens · Lausanne/Vaud",
  defaultTitle:
    "Diagnostic terrain gratuit pour PME vaudoises | Xabier Iribar",
  defaultDescription:
    "Je crée des ponts invisibles entre vos e-mails, WhatsApp et fichiers Excel. Gagnez du temps au quotidien sans changer vos habitudes. Spécialiste pour artisans et garages dans le canton de Vaud.",
};

export function canonical(path = "/") {
  return new URL(path, site.url).toString();
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": canonical("#professional-service"),
    name: site.name,
    description: site.defaultDescription,
    slogan: "Je pars du terrain, pas de la technologie.",
    image: canonical("/assets/xabier-iribar-portrait.png"),
    logo: canonical("/favicon-512.png"),
    priceRange: "$$",
    serviceType: [
      "Automatisation administrative pour PME vaudoises",
      "Automatisation emails WhatsApp Excel",
      "Diagnostic terrain automatisation PME",
      "Conseil automatisation Lausanne",
    ],
    areaServed: ["Aclens", "Lausanne", "Vaud", "Suisse romande", "Switzerland"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aclens",
      addressRegion: "Vaud",
      addressCountry: "CH",
    },
    telephone: site.phone,
    email: site.email,
    url: site.url,
    sameAs: [
      "https://oust.ch/",
      "https://socraft.io/",
      "https://42lausanne.ch/",
      "https://j42l.ch/",
      site.linkedinHref,
      site.githubHref,
    ],
  };
}
