const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ClientSession {
  token: string;
  refresh_token: string;
  client: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

function clearSession(): void {
  localStorage.removeItem('stetic_access_token');
  localStorage.removeItem('stetic_refresh_token');
  localStorage.removeItem('stetic_client');
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) as { exp?: number };
    return typeof payload.exp === 'number' && payload.exp <= Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

export function getStoredClient(): ClientSession['client'] | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('stetic_access_token');
  const storedClient = localStorage.getItem('stetic_client');
  if (!token || !storedClient || isTokenExpired(token)) {
    clearSession();
    return null;
  }

  try {
    return JSON.parse(storedClient) as ClientSession['client'];
  } catch {
    clearSession();
    return null;
  }
}

export async function loginWithGoogle(credential: string): Promise<ClientSession> {
  const response = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  const json = (await response.json()) as ApiResponse<ClientSession>;
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? 'No pudimos iniciar sesión con Google.');
  }

  localStorage.setItem('stetic_access_token', json.data.token);
  localStorage.setItem('stetic_refresh_token', json.data.refresh_token);
  localStorage.setItem('stetic_client', JSON.stringify(json.data.client));
  return json.data;
}
