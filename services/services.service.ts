import type { ServiceItem } from '@/data/services.mock';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
}

const ICON_BY_CATEGORY: Record<string, ServiceItem['iconType']> = {
  manos: 'nail',
  pies: 'spa',
  extras: 'nail',
  cejas: 'eye',
  pestañas: 'eye',
};

function toServiceItem(row: ApiService): ServiceItem {
  return {
    id: String(row.id),
    title: row.name,
    imageUrl: row.image_url ? `${API_URL}/uploads/${row.image_url}` : '',
    iconType: ICON_BY_CATEGORY[(row.category ?? '').toLowerCase()] ?? 'nail',
    category: ['cejas', 'pestañas'].includes((row.category ?? '').toLowerCase()) ? 'eyes' : ['pies'].includes((row.category ?? '').toLowerCase()) ? 'spa' : 'nails',
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
   * Obtiene la lista completa de servicios del estudio.
   */
  async getServices(): Promise<ServiceItem[]> {
    const rows = await request<ApiService[]>('/api/services');
    return (rows ?? []).map(toServiceItem);
  },

  /**
   * Obtiene un servicio por su identificador único.
   */
  async getServiceById(id: string): Promise<ServiceItem | null> {
    const row = await request<ApiService>(`/api/services/${encodeURIComponent(id)}`);
    return row ? toServiceItem(row) : null;
  },
};