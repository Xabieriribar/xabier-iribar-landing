import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const pages = {
  default: {
    eyebrow: "ACLENS · LAUSANNE ET RÉGION",
    title: "Le mécanicien du numérique",
    subtitle: "Un problème concret. Une intervention bornée.",
  },
  offres: {
    eyebrow: "OFFRES · PÉRIMÈTRES BORNÉS",
    title: "Comprendre, vérifier, installer",
    subtitle: "Des prix indicatifs avant un cadrage écrit.",
  },
  audit: {
    eyebrow: "DIAGNOSTIC INITIAL · GRATUIT",
    title: "Partir d’un problème réel",
    subtitle: "Appels, photos, devis, rendez-vous ou dossiers.",
  },
};

const escapeXml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const svgFor = ({ eyebrow, title, subtitle }) => `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f5f6f3"/>
  <path d="M0 0H1200V630H0Z" fill="url(#grid)" opacity=".55"/>
  <defs>
    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0V28" fill="none" stroke="#cdd6da" stroke-width="1"/>
    </pattern>
  </defs>
  <rect x="68" y="60" width="1064" height="510" rx="14" fill="#fff" stroke="#0d2538" stroke-width="3"/>
  <path d="M68 150H1132M260 60V150M954 60V150" stroke="#9eacb5" stroke-width="2"/>
  <rect x="100" y="88" width="118" height="40" fill="#0d2538"/>
  <text x="126" y="116" fill="#fff" font-family="Arial, sans-serif" font-size="22" font-weight="700">XI · 001</text>
  <text x="292" y="113" fill="#a83e0d" font-family="monospace" font-size="23" font-weight="700" letter-spacing="2">${escapeXml(eyebrow)}</text>
  <circle cx="1014" cy="105" r="23" fill="#d75b1f"/>
  <path d="m1003 105 8 8 15-18" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="108" y="276" fill="#0d2538" font-family="Arial, sans-serif" font-size="62" font-weight="700">${escapeXml(title)}</text>
  <text x="108" y="340" fill="#30424f" font-family="Arial, sans-serif" font-size="31">${escapeXml(subtitle)}</text>
  <path d="M108 416H1092" stroke="#cdd6da" stroke-width="2"/>
  <text x="108" y="474" fill="#16324a" font-family="monospace" font-size="25" font-weight="700">XABIER IRIBAR</text>
  <text x="108" y="516" fill="#30424f" font-family="Arial, sans-serif" font-size="25">Garages · artisans · ateliers · petites entreprises vaudoises</text>
  <path d="M956 425v98M976 445v78M996 425v98M1016 445v78M1036 425v98M1056 445v78M1076 425v98" stroke="#9eacb5" stroke-width="3"/>
</svg>`;

await mkdir("public/og", { recursive: true });

for (const [name, data] of Object.entries(pages)) {
  await sharp(Buffer.from(svgFor(data)))
    .png({ compressionLevel: 9 })
    .toFile(`public/og/${name}.png`);
}
