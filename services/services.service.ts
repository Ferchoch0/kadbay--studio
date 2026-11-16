import type { ServiceItem } from '@/data/services.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const BUSINESS_SLUG = process.env.NEXT_PUBLIC_BUSINESS_SLUG || '';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface ApiService {
  id: number | string;
  name: string;
  category: string | null;
  image_url: string | null;
  price: number | string | null;
  duration?: number | null;
  description?: string | null;
  is_featured?: number | boolean | null;
  featured_order?: number | null;
}

const ICON_BY_CATEGORY: Record<string, ServiceItem['iconType']> = {
  manos: 'nail',
  pies: 'spa',
  extras: 'nail',
  cejas: 'eye',
  pestañas: 'eye',
  spa: 'spa',
};

function formatServiceImageUrl(path: string | null): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  // Si la ruta ya empieza con /uploads, solo anteponemos API_URL
  if (path.startsWith('/uploads/')) {
    return `${API_URL}${path}`;
  }
  if (path.startsWith('uploads/')) {
    return `${API_URL}/${path}`;
  }
  // Para rutas relativas como services/xyz.jpg
  return `${API_URL}/uploads/${path.replace(/^\/+/, '')}`;
}

function toServiceItem(row: ApiService): ServiceItem {
  const cat = (row.category ?? '').toLowerCase();
  return {
    id: String(row.id),
    title: row.name,
    imageUrl: formatServiceImageUrl(row.image_url),
    iconType: ICON_BY_CATEGORY[cat] ?? 'nail',
    category: ['cejas', 'pestañas'].includes(cat) ? 'eyes' : ['pies', 'spa'].includes(cat) ? 'spa' : 'nails',
    description: row.description ?? undefined,
    duration: row.duration ? `${row.duration} min` : undefined,
    price: row.price ?? undefined,
  };
}

async function request<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API_URL}${path}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Error ${response.status} al consultar ${path}`);

  const json = (await response.json()) as ApiResponse<T>;
  return json.data;
}

/**
 * Servicio de datos para la gestión de servicios estéticos.
 */
export const servicesService = {
  /**
   * Obtiene la lista completa de servicios del estudio, filtrada por negocio.
   */
  async getServices(): Promise<ServiceItem[]> {
    const params = new URLSearchParams();
    if (BUSINESS_SLUG) params.set('business_slug', BUSINESS_SLUG);
    const qs = params.toString() ? `?${params}` : '';
    const rows = await request<ApiService[]>(`/api/services${qs}`);
    return (rows ?? []).map(toServiceItem);
  },

  /**
   * Obtiene un servicio por su identificador único, validando negocio.
   */
  async getServiceById(id: string): Promise<ServiceItem | null> {
    const params = new URLSearchParams();
    if (BUSINESS_SLUG) params.set('business_slug', BUSINESS_SLUG);
    const qs = params.toString() ? `?${params}` : '';
    const row = await request<ApiService>(`/api/services/${encodeURIComponent(id)}${qs}`);
    return row ? toServiceItem(row) : null;
  },
};
