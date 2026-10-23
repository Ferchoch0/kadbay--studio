'use client';

import { useState, useEffect } from 'react';
import { ServiceItem } from '@/data/services.mock';
import { servicesService } from '@/services/services.service';

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setLoading(true);
        const data = await servicesService.getServices();
        if (isMounted) {
          setServices(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error inesperado al cargar servicios');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, loading, error };
}
