const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// Slug del negocio — se resuelve a business_id en la API vía la tabla `businesses`
// Para cambiar de negocio, editar NEXT_PUBLIC_BUSINESS_SLUG en .env
const BUSINESS_SLUG = process.env.NEXT_PUBLIC_BUSINESS_SLUG || '';

interface ApiResponse<T> { success: boolean; message?: string; data: T; }

export interface Employee { id: number | string; name: string; image_url?: string | null; working_days?: number[]; }
export interface AvailabilitySlot { start: string; end: string; employee_id: number; }
export interface ClientAppointment { id: number; scheduled_at: string; ends_at: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'; service_name: string; employee_name: string; service_price?: number | string; }
export interface ClosedDaysResponse { business_id: number; skip_holidays: boolean; schedule_days?: string; business_working_days?: number[]; closed_dates: string[]; }

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, options);
  const json = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !json.success) throw new Error(json.message ?? `Error ${response.status}`);
  return json.data;
}

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('stetic_access_token') : null;
  if (!token) {
    throw new Error('Debes iniciar sesión antes de confirmar la reserva.');
  }
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export const appointmentService = {
  async getEmployees(serviceId?: string | number): Promise<Employee[]> {
    const params = new URLSearchParams();
    if (BUSINESS_SLUG) params.set('business_slug', BUSINESS_SLUG);
    if (serviceId)     params.set('service_id', encodeURIComponent(String(serviceId)));
    const qs = params.toString() ? `?${params}` : '';
    return (await request<Employee[]>(`/api/employees${qs}`)) ?? [];
  },
  async getAvailability(serviceId: string, date: string, employeeId?: number): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams({ service_id: serviceId, date });
    if (employeeId) params.set('employee_id', String(employeeId));
    return (await request<AvailabilitySlot[]>(`/api/availability?${params}`)) ?? [];
  },
  async createAppointment(data: Record<string, unknown>) {
    return request<Record<string, unknown>>('/api/appointments', {
      method: 'POST', headers: authHeaders(), body: JSON.stringify(data),
    });
  },
  async getClientAppointments(businessSlug = BUSINESS_SLUG): Promise<ClientAppointment[]> {
    const params = new URLSearchParams();
    if (businessSlug) params.set('business_slug', businessSlug);
    const qs = params.toString() ? `?${params}` : '';
    return (await request<ClientAppointment[]>(`/api/client/appointments${qs}`, { headers: authHeaders() })) ?? [];
  },
  async updateClientAppointmentStatus(id: number, status: 'confirmed' | 'cancelled') {
    return request<ClientAppointment>(`/api/client/appointments/${id}/status`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) });
  },
  async getClosedDays(businessSlug = BUSINESS_SLUG): Promise<ClosedDaysResponse> {
    const params = new URLSearchParams();
    if (businessSlug) params.set('business_slug', businessSlug);
    const qs = params.toString() ? `?${params}` : '';
    return await request<ClosedDaysResponse>(`/api/closed-days${qs}`);
  },
};
