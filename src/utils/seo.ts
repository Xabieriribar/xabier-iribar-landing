export const site = {
  name: "Xabier Iribar",
  subtitle: "Automatisation pour PME locales",
  url: "https://xabieriribar.ch",
  email: "contact@xabieriribar.ch",
  phone: "+41 78 331 93 30",
  phoneHref: "tel:+41783319330",
  whatsappHref: "https://wa.me/41783319330",
  location: "Aclens · Lausanne/Vaud",
  defaultTitle: "Automatisation IA pour PME à Lausanne/Vaud | Xabier Iribar",
  defaultDescription:
    "J’aide les PME autour de Lausanne et dans le canton de Vaud à automatiser les tâches répétitives: demandes clients, devis, relances, documents et rapports.",
};

export function canonical(path = "/") {
  return new URL(path, site.url).toString();
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    serviceType: "Automatisation de processus pour PME",
    areaServed: "Aclens, Lausanne, Vaud, Switzerland",
    telephone: site.phone,
    email: site.email,
    url: site.url,
  };
}
