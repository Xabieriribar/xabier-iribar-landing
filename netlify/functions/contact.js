const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "contact@xabieriribar.ch";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const parseBody = (event) => {
  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"] || "";

  if (contentType.includes("application/json")) {
    return JSON.parse(event.body || "{}");
  }

  const params = new URLSearchParams(event.body || "");
  return Object.fromEntries(params.entries());
};

const mapsUrlFor = (businessName = "") => {
  const cleanName = String(businessName).trim();
  if (!cleanName) return "";

  const query = `${cleanName} Lausanne Vaud Switzerland`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { ok: false, error: "Method not allowed" });
  }

  let payload;

  try {
    payload = parseBody(event);
  } catch {
    return json(400, { ok: false, error: "Invalid request body" });
  }

  if (payload.website) {
    return json(200, { ok: true });
  }

  const firstName = String(payload.prenom || payload.firstName || "").trim();
  const lastName = String(payload.nom || payload.lastName || "").trim();
  const email = String(payload.email || "").trim();
  const businessName = String(
    payload.entreprise || payload.company || "",
  ).trim();
  const message = String(payload.message || "").trim();
  const source = String(
    payload.source || payload["form-name"] || "site",
  ).trim();
  const timestamp = new Date().toISOString();
  const mapsUrl = mapsUrlFor(businessName);

  if (!firstName || !lastName || !email || !businessName || !message) {
    return json(400, { ok: false, error: "Missing required fields" });
  }

  if (!RESEND_API_KEY || !FROM_EMAIL) {
    return json(500, {
      ok: false,
      error: "Email service is not configured",
    });
  }

  const subject = `Diagnostic gratuit - ${businessName} - ${firstName} ${lastName}`;
  const text = [
    "Nouvelle demande de diagnostic gratuit",
    "",
    `Prénom: ${firstName}`,
    `Nom: ${lastName}`,
    `Email: ${email}`,
    `Entreprise: ${businessName}`,
    `Google Maps: ${mapsUrl || "Non disponible"}`,
    `Source: ${source}`,
    `Timestamp: ${timestamp}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #161616; line-height: 1.6;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">Nouvelle demande de diagnostic gratuit</h1>
      <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 640px;">
        <tr><td style="padding: 8px 0; font-weight: 700;">Prénom</td><td>${escapeHtml(firstName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Nom</td><td>${escapeHtml(lastName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Entreprise</td><td>${escapeHtml(businessName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Google Maps</td><td>${mapsUrl ? `<a href="${mapsUrl}">${escapeHtml(mapsUrl)}</a>` : "Non disponible"}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Source</td><td>${escapeHtml(source)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Timestamp</td><td>${escapeHtml(timestamp)}</td></tr>
      </table>
      <h2 style="font-size: 18px; margin: 24px 0 8px;">Message</h2>
      <p style="white-space: pre-wrap; border-left: 3px solid #9f1616; padding-left: 14px;">${escapeHtml(message)}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend email failed", detail);
    return json(502, { ok: false, error: "Email provider failed" });
  }

  return json(200, { ok: true });
};
