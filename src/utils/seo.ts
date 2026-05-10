export const site = {
  name: "Xabier Iribar",
  subtitle: "Automatisation pour PME locales",
  url: "https://xabieriribar.ch",
  email: "contact@xabieriribar.ch",
  phone: "+41 78 331 93 30",
  phoneHref: "tel:+41783319330",
  whatsappHref: "https://wa.me/41783319330",
  location: "Aclens · Lausanne/Vaud",
  defaultTitle: "Xabier Iribar · Automatisation pour PME locales",
  defaultDescription:
    "Automatisation pragmatique pour PME locales à Aclens, Lausanne et Vaud. Diagnostic gratuit pour simplifier demandes clients, devis, relances et documents.",
};

export function canonical(path = "/") {
  return new URL(path, site.url).toString();
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    serviceType: "Automatisation de processus pour PME locales",
    areaServed: "Aclens, Lausanne, Vaud, Switzerland",
    telephone: site.phone,
    email: site.email,
    url: site.url,
  };
}
