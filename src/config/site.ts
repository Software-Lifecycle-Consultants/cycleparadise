// Single source of truth for the public domain and contact details.
// Hardcoded (not import.meta.env) because PUBLIC_* vars are inlined at build time,
// and production only sets them at container runtime.
export const SITE_URL = 'https://cycleparadise.bike';

export const CONTACT = {
  email: 'info@cycleparadise.bike',
  phone: '+94712834561',
  phoneDisplay: '+94 71 283 4561',
  whatsappUrl: 'https://wa.me/94712834561',
};

// Set to a YouTube video ID to show the highlights video on the homepage.
export const HOMEPAGE_VIDEO_ID = '';

export const whatsappLink = (message?: string) =>
  message ? `${CONTACT.whatsappUrl}?text=${encodeURIComponent(message)}` : CONTACT.whatsappUrl;
