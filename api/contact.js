const cleanEnv = (value = "") =>
  String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "");

const TO_EMAIL = cleanEnv(
  process.env.CONTACT_TO_EMAIL || "contact@xabieriribar.ch",
);
const FROM_EMAIL = cleanEnv(
  process.env.CONTACT_FROM_EMAIL || process.env.RESEND_FROM_EMAIL,
);
const RESEND_API_KEY = cleanEnv(process.env.RESEND_API_KEY);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const parseBody = async (request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const text = await request.text();
  return Object.fromEntries(new URLSearchParams(text).entries());
};

const mapsUrlFor = (businessName = "") => {
  const cleanName = String(businessName).trim();
  if (!cleanName) return "";

  const query = `${cleanName} Lausanne Vaud Switzerland`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const acceptsJson = (request) => {
  const accept = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  return (
    accept.includes("application/json") ||
    contentType.includes("application/json")
  );
};

const respond = (request, status, body) => {
  if (acceptsJson(request)) return json(status, body);

  if (status >= 200 && status < 300) {
    return Response.redirect(new URL("/merci", request.url), 303);
  }

  return new Response(body.error || "Le message n’a pas pu être envoyé.", {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

const providerErrorFor = async (response) => {
  const detail = await response.text();

  try {
    const parsed = JSON.parse(detail);
    return {
      status: response.status,
      name: parsed.name || parsed.error || "resend_error",
      message: parsed.message || detail,
    };
  } catch {
    return {
      status: response.status,
      name: "resend_error",
      message: detail,
    };
  }
};

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return json(405, { ok: false, error: "Method not allowed" });
    }

    let payload;

    try {
      payload = await parseBody(request);
    } catch {
      return respond(request, 400, {
        ok: false,
        error: "Invalid request body",
      });
    }

    if (payload.website) {
      return respond(request, 200, { ok: true });
    }

    const firstName = String(payload.prenom || payload.firstName || "").trim();
    const lastName = String(payload.nom || payload.lastName || "").trim();
    const email = String(payload.email || "").trim();
    const businessName = String(
      payload.entreprise || payload.company || "",
    ).trim();
    const message = String(payload.message || "").trim();
    const source = String(
      payload.source ||
        payload["form-name"] ||
        request.headers.get("referer") ||
        "site",
    ).trim();
    const timestamp = new Date().toISOString();
    const mapsUrl = mapsUrlFor(businessName);

    if (!firstName || !lastName || !email || !businessName || !message) {
      return respond(request, 400, {
        ok: false,
        error: "Missing required fields",
      });
    }

    if (!RESEND_API_KEY || !FROM_EMAIL) {
      console.error("Contact email service is not configured");
      return respond(request, 500, {
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

    let response;

    try {
      response = await fetch("https://api.resend.com/emails", {
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
    } catch (error) {
      console.error("Resend email request failed", error);
      return respond(request, 502, {
        ok: false,
        error: "Email provider failed",
      });
    }

    if (!response.ok) {
      const providerError = await providerErrorFor(response);
      console.error("Resend email failed", providerError);
      return respond(request, 502, {
        ok: false,
        error: "Email provider failed",
        providerStatus: providerError.status,
        providerMessage: providerError.message,
      });
    }

    return respond(request, 200, { ok: true });
  },
};
