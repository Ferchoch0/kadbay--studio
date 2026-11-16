import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

export interface Business {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  footer_text?: string | null;
  logo_url: string | null;
  banner_url: string | null;
  address: string;
  phone: string;
  email?: string | null;
  whatsapp: string;
  instagram: string;
  schedule_days: string;
  schedule_open: string;
  schedule_close: string;
  is_active: number;
  site_type?: string;
  custom_domain?: string | null;
}

export function formatScheduleDays(rawDays: string | null | undefined): string {
  if (!rawDays) return 'Lunes a Sábado';
  const trimmed = rawDays.trim();
  if (/\b(a|al|-)\b/i.test(trimmed)) {
    return trimmed;
  }

  const daysList = trimmed
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  if (daysList.length <= 1) {
    return daysList[0] || 'Lunes a Sábado';
  }

  const hasMonday = daysList.some((d) => /^lun/i.test(d));
  const hasSaturday = daysList.some((d) => /^s[aá]b/i.test(d));
  const hasSunday = daysList.some((d) => /^dom/i.test(d));
  const hasFriday = daysList.some((d) => /^vie/i.test(d));

  if (hasMonday && hasSunday && daysList.length >= 7) {
    return 'Lunes a Domingo';
  }
  if (hasMonday && hasSaturday && !hasSunday && daysList.length >= 6) {
    return 'Lunes a Sábado';
  }
  if (hasMonday && hasFriday && !hasSaturday && !hasSunday && daysList.length >= 5) {
    return 'Lunes a Viernes';
  }

  if (daysList.length === 2) {
    return `${daysList[0]} y ${daysList[1]}`;
  }

  return `${daysList[0]} a ${daysList[daysList.length - 1]}`;
}

export function formatInstagramUrl(instagram: string | null | undefined): string {
  if (!instagram) return 'https://instagram.com';
  const clean = instagram.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  const handle = clean.replace(/^@/, '');
  return `https://instagram.com/${handle}`;
}

export function getFullImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const businessService = {
  /**
   * Obtiene la información del negocio por su slug público.
   */
  async getBySlug(slug: string = process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay'): Promise<Business> {
    const response = await api.get(`/api/business/slug/${encodeURIComponent(slug)}`);
    const data = response.data?.data || response.data;

    if (!data) {
      throw new Error(`No se pudo obtener la información del negocio con slug: ${slug}`);
    }

    return data as Business;
  },

  /**
   * Obtiene la información del negocio principal activo desde la API.
   * Con fallback automático a getBySlug si la ruta requiere autenticación o falla.
   */
  async getPrimary(): Promise<Business> {
    const slug = process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay';
    try {
      const response = await api.get('/api/business');
      const data = response.data?.data || response.data;
      if (data) {
        return data as Business;
      }
    } catch {
      // Fallback a getBySlug con el slug configurado
      return this.getBySlug(slug);
    }

    return this.getBySlug(slug);
  },
};
