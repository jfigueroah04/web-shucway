export const WHATSAPP_PHONE = import.meta.env.REACT_APP_WHATSAPP_PHONE || '50256252922';

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
