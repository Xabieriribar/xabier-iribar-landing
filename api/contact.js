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
const EXTRA_ALLOWED_ORIGINS = cleanEnv(process.env.CONTACT_ALLOWED_ORIGINS)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FORM_AGE_MS = 2500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const RESEND_API_URL = "https://api.resend.com/emails";

const FIELD_LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  businessName: 120,
  message: 3000,
  source: 120,
  formName: 80,
  website: 200,
  startedAt: 32,
};

const ALLOWED_FIELDS = new Set([
  "prenom",
  "firstName",
  "nom",
  "lastName",
  "email",
  "entreprise",
  "company",
  "message",
  "source",
  "form-name",
  "website",
  "contact_started_at",
  "telephone",
  "tache_enerve",
]);

const ALLOWED_FORM_NAMES = new Set(["diagnostic-contact", "diagnostic-qr"]);
const ALLOWED_SOURCE_PATHS = new Set(["/", "/diagnostic", "/diagnostic/"]);
const JSON_CONTENT_TYPE = "application/json";
const FORM_CONTENT_TYPE = "application/x-www-form-urlencoded";

const API_SECURITY_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Security-Policy":
    "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

const withSecurityHeaders = (headers = {}) => ({
  ...API_SECURITY_HEADERS,
  ...headers,
});

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: withSecurityHeaders({
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    }),
  });

const text = (status, body, headers = {}) =>
  new Response(body, {
    status,
    headers: withSecurityHeaders({
      "Content-Type": "text/plain; charset=utf-8",
      ...headers,
    }),
  });

const redirect = (request, location, status = 303) =>
  new Response(null, {
    status,
    headers: withSecurityHeaders({
      Location: new URL(location, request.url).toString(),
    }),
  });

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const byteLength = (value = "") => new TextEncoder().encode(value).byteLength;

const parseContentType = (request) =>
  (request.headers.get("content-type") || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

const requestError = (status, code) =>
  Object.assign(new Error(code), { status, code });

const assertBodySize = (request) => {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return;

  const parsedLength = Number(contentLength);
  if (
    !Number.isFinite(parsedLength) ||
    parsedLength < 0 ||
    parsedLength > MAX_BODY_BYTES
  ) {
    throw requestError(413, "request_too_large");
  }
};

const addPayloadField = (payload, key, value) => {
  if (!ALLOWED_FIELDS.has(key)) {
    throw requestError(400, "unexpected_field");
  }

  if (Object.prototype.hasOwnProperty.call(payload, key)) {
    throw requestError(400, "duplicate_field");
  }

  if (typeof value !== "string") {
    throw requestError(400, "invalid_field_type");
  }

  payload[key] = value;
};

const parseBody = async (request) => {
  assertBodySize(request);

  const contentType = parseContentType(request);
  if (contentType !== JSON_CONTENT_TYPE && contentType !== FORM_CONTENT_TYPE) {
    throw requestError(415, "unsupported_media_type");
  }

  const rawBody = await request.text();
  if (byteLength(rawBody) > MAX_BODY_BYTES) {
    throw requestError(413, "request_too_large");
  }

  const payload = Object.create(null);

  if (contentType === JSON_CONTENT_TYPE) {
    let parsed;

    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw requestError(400, "invalid_json");
    }

    if (
      parsed === null ||
      Array.isArray(parsed) ||
      Object.getPrototypeOf(parsed) !== Object.prototype
    ) {
      throw requestError(400, "invalid_json_shape");
    }

    for (const [key, value] of Object.entries(parsed)) {
      addPayloadField(payload, key, value);
    }

    return payload;
  }

  const formData = new URLSearchParams(rawBody);
  for (const [key, value] of formData.entries()) {
    addPayloadField(payload, key, value);
  }

  return payload;
};

const acceptsJson = (request) => {
  const accept = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  return (
    accept.includes("application/json") ||
    contentType.includes("application/json")
  );
};

const respond = (request, status, body, headers = {}) => {
  if (acceptsJson(request)) return json(status, body, headers);

  if (status >= 200 && status < 300) {
    return redirect(request, "/merci");
  }

  return text(
    status,
    body.error || "Le message n'a pas pu etre envoye.",
    headers,
  );
};

const clientIpFor = (request) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim().slice(0, 64);

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim().slice(0, 64);

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim().slice(0, 64);

  return "";
};

const rateLimitStore = () => {
  globalThis.__contactRateLimit ??= new Map();
  return globalThis.__contactRateLimit;
};

const checkRateLimit = (request) => {
  const ip = clientIpFor(request);
  if (!ip) return true;

  const now = Date.now();
  const store = rateLimitStore();
  const current = store.get(ip);

  if (!current || current.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  current.count += 1;

  if (store.size > 1000) {
    for (const [key, value] of store.entries()) {
      if (value.resetAt <= now) store.delete(key);
    }
  }

  return current.count <= RATE_LIMIT_MAX;
};

const allowedOriginsFor = (request) => {
  const requestOrigin = new URL(request.url).origin;
  return new Set([
    requestOrigin,
    "https://xabieriribar.ch",
    "https://www.xabieriribar.ch",
    ...EXTRA_ALLOWED_ORIGINS,
  ]);
};

const hasAllowedOrigin = (request) => {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  return allowedOriginsFor(request).has(origin);
};

const hasAllowedReferer = (request) => {
  const referer = request.headers.get("referer");
  if (!referer) return true;

  try {
    return allowedOriginsFor(request).has(new URL(referer).origin);
  } catch {
    return false;
  }
};

const singleLine = (value = "", maxLength) => {
  const normalized = String(value)
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (normalized.length > maxLength) {
    throw requestError(400, "field_too_long");
  }

  return normalized;
};

const messageField = (value = "", maxLength) => {
  const normalized = String(value)
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, " ")
    .trim();

  if (normalized.length > maxLength) {
    throw requestError(400, "field_too_long");
  }

  return normalized;
};

const truncateSingleLine = (value, maxLength) => {
  const clean = String(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return clean.length > maxLength
    ? `${clean.slice(0, maxLength - 3)}...`
    : clean;
};

const isValidEmail = (email) => {
  if (!email || email.length > FIELD_LIMITS.email || /[\r\n\s]/.test(email)) {
    return false;
  }

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (
    !local ||
    !domain ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    domain.includes("..")
  ) {
    return false;
  }

  const emailPattern =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

  return emailPattern.test(email);
};

const emailAddressFrom = (value = "") => {
  const cleanValue = cleanEnv(value);
  if (!cleanValue || /[\r\n]/.test(cleanValue)) return "";

  const bracketMatch = cleanValue.match(/<([^<>]+)>$/);
  return bracketMatch ? bracketMatch[1].trim() : cleanValue;
};

const isValidConfiguredEmail = (value = "") => {
  const address = emailAddressFrom(value);
  return isValidEmail(address);
};

const submittedTooFast = (payload) => {
  const rawStartedAt = singleLine(
    payload.contact_started_at || "",
    FIELD_LIMITS.startedAt,
  );
  if (!rawStartedAt) return false;

  const startedAt = Number(rawStartedAt);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return false;

  return Date.now() - startedAt < MIN_FORM_AGE_MS;
};

const normalizedContactFrom = (payload) => {
  const firstName = singleLine(
    payload.prenom || payload.firstName || "",
    FIELD_LIMITS.firstName,
  );
  const lastName = singleLine(
    payload.nom || payload.lastName || "",
    FIELD_LIMITS.lastName,
  );
  const email = singleLine(payload.email || "", FIELD_LIMITS.email);
  const businessName = singleLine(
    payload.entreprise || payload.company || "",
    FIELD_LIMITS.businessName,
  );
  const message = messageField(payload.message || "", FIELD_LIMITS.message);
  const telephone = singleLine(payload.telephone || "", 80);
  const tacheEnerve = singleLine(payload.tache_enerve || "", 200);
  const website = singleLine(payload.website || "", FIELD_LIMITS.website);
  const formName = singleLine(
    payload["form-name"] || "",
    FIELD_LIMITS.formName,
  );
  const rawSource = singleLine(payload.source || "", FIELD_LIMITS.source);
  const source = ALLOWED_SOURCE_PATHS.has(rawSource) ? rawSource : "site";

  if (!firstName || !lastName || !email || !businessName || !message) {
    throw requestError(400, "missing_required_fields");
  }

  if (!isValidEmail(email)) {
    throw requestError(400, "invalid_email");
  }

  if (formName && !ALLOWED_FORM_NAMES.has(formName)) {
    throw requestError(400, "invalid_form_name");
  }

  return {
    firstName,
    lastName,
    email,
    businessName,
    message,
    telephone,
    tacheEnerve,
    website,
    formName: formName || "unknown",
    source,
  };
};

const mapsUrlFor = (businessName = "") => {
  const cleanName = String(businessName).trim();
  if (!cleanName) return "";

  const query = `${cleanName} Lausanne Vaud Switzerland`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const providerErrorFor = async (response) => {
  let name = "resend_error";

  try {
    const detail = await response.text();
    const parsed = JSON.parse(detail);
    name = String(parsed.name || parsed.error || name).slice(0, 80);
  } catch {
    name = "resend_error";
  }

  return {
    status: response.status,
    name,
  };
};

const sendWithResend = async ({ from, to, replyTo, subject, text, html }) => {
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (response.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    error: await providerErrorFor(response),
  };
};

const buildEmail = ({
  firstName,
  lastName,
  email,
  businessName,
  message,
  telephone,
  tacheEnerve,
  formName,
  source,
}) => {
  const timestamp = new Date().toISOString();
  const mapsUrl = mapsUrlFor(businessName);
  const subject = truncateSingleLine(
    `Diagnostic gratuit - ${businessName} - ${firstName} ${lastName}`,
    140,
  );

  const textBody = [
    "Nouvelle demande de diagnostic gratuit",
    "",
    `Prenom: ${firstName}`,
    `Nom: ${lastName}`,
    `Email: ${email}`,
    `Entreprise: ${businessName}`,
    `Téléphone: ${telephone || "Non renseigné"}`,
    `Tâche la plus énervante: ${tacheEnerve || "Non renseignée"}`,
    `Google Maps: ${mapsUrl || "Non disponible"}`,
    `Formulaire: ${formName}`,
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
        <tr><td style="padding: 8px 0; font-weight: 700;">Prenom</td><td>${escapeHtml(firstName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Nom</td><td>${escapeHtml(lastName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Entreprise</td><td>${escapeHtml(businessName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Téléphone</td><td>${escapeHtml(telephone || "Non renseigné")}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Tâche énervante</td><td>${escapeHtml(tacheEnerve || "Non renseignée")}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Google Maps</td><td>${mapsUrl ? `<a href="${mapsUrl}">${escapeHtml(mapsUrl)}</a>` : "Non disponible"}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Formulaire</td><td>${escapeHtml(formName)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Source</td><td>${escapeHtml(source)}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 700;">Timestamp</td><td>${escapeHtml(timestamp)}</td></tr>
      </table>
      <h2 style="font-size: 18px; margin: 24px 0 8px;">Message</h2>
      <p style="white-space: pre-wrap; border-left: 3px solid #9f1616; padding-left: 14px;">${escapeHtml(message)}</p>
    </div>
  `;

  return { subject, text: textBody, html };
};

const genericError = {
  ok: false,
  error:
    "Le message n'a pas pu etre envoye. Vous pouvez aussi ecrire directement a contact@xabieriribar.ch.",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: withSecurityHeaders({
          Allow: "POST, OPTIONS",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept",
          "Access-Control-Max-Age": "86400",
        }),
      });
    }

    if (request.method !== "POST") {
      return json(
        405,
        { ok: false, error: "Method not allowed" },
        { Allow: "POST, OPTIONS" },
      );
    }

    if (!hasAllowedOrigin(request) || !hasAllowedReferer(request)) {
      return respond(request, 403, genericError);
    }

    if (!checkRateLimit(request)) {
      return respond(
        request,
        429,
        { ok: false, error: "Trop de demandes. Reessayez plus tard." },
        { "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) },
      );
    }

    let payload;

    try {
      payload = await parseBody(request);
    } catch (error) {
      return respond(request, error.status || 400, genericError);
    }

    let tooFast = false;

    try {
      tooFast = submittedTooFast(payload);
    } catch {
      return respond(request, 400, genericError);
    }

    if (payload.website || tooFast) {
      return respond(request, 200, { ok: true });
    }

    let contact;

    try {
      contact = normalizedContactFrom(payload);
    } catch {
      return respond(request, 400, genericError);
    }

    if (
      !isValidConfiguredEmail(TO_EMAIL) ||
      !isValidConfiguredEmail(FROM_EMAIL)
    ) {
      console.error(
        "Contact email service has invalid sender or recipient config",
      );
      return respond(request, 500, genericError);
    }

    if (!RESEND_API_KEY) {
      console.error("Contact email service is missing RESEND_API_KEY");
      return respond(request, 500, genericError);
    }

    const emailContent = buildEmail(contact);
    let sendResult;

    try {
      sendResult = await sendWithResend({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        replyTo: contact.email,
        ...emailContent,
      });
    } catch (error) {
      console.error("Resend email request failed", {
        name: error?.name || "Error",
      });
      return respond(request, 502, genericError);
    }

    if (!sendResult.ok) {
      console.error("Resend email failed", {
        providerStatus: sendResult.error.status,
        providerName: sendResult.error.name,
      });

      return respond(request, 502, genericError);
    }

    return respond(request, 200, { ok: true });
  },
};
