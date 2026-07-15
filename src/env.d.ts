/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_EMAIL?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly PUBLIC_LEGAL_NAME?: string;
  readonly PUBLIC_BUSINESS_REGISTRATION?: string;
  readonly PUBLIC_POSTAL_ADDRESS?: string;
  readonly PUBLIC_PRIVACY_RETENTION?: string;
  readonly PUBLIC_PORTRAIT_IMAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
