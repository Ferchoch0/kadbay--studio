'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  appointmentService,
  type AvailabilitySlot,
  type Employee,
} from '@/services/appointment.service';

export interface AppointmentSlot {
  time: string;
  start: string;
  end: string;
  employeeId: number;
}

export function useAppointments(serviceId?: string | number | null) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [checkedDaysStatus, setCheckedDaysStatus] = useState<Record<string, 'available' | 'full'>>({});
  const cacheRef = useRef<Record<string, AppointmentSlot[]>>({});

  useEffect(() => {
    // Al cambiar de servicio, limpiar caché y estado de días previos
    cacheRef.current = {};
    setCheckedDaysStatus({});
    setSlots([]);
    let mounted = true;
    setEmployeesLoading(true);
    appointmentService.getEmployees(serviceId ?? undefined)
      .then((data) => { if (mounted) { setEmployees(data); setEmployeesError(null); } })
      .catch((error: unknown) => { if (mounted) setEmployeesError(error instanceof Error ? error.message : 'Error al cargar empleados'); })
      .finally(() => { if (mounted) setEmployeesLoading(false); });
    return () => { mounted = false; };
  }, [serviceId]);

  const checkAvailability = useCallback(async (serviceId: string, date: string, employeeId: number) => {
    const data: AvailabilitySlot[] = await appointmentService.getAvailability(serviceId, date, employeeId);
    return data.map((slot) => ({
      time: slot.start.slice(11, 16),
      start: slot.start,
      end: slot.end,
      employeeId: slot.employee_id,
    }));
  }, []);

  const loadAvailability = useCallback(async (serviceId: string, date: string, employeeId: number) => {
    const cacheKey = `${serviceId}_${date}_${employeeId}`;
    if (cacheRef.current[cacheKey]) {
      const cached = cacheRef.current[cacheKey];
      setSlots(cached);
      setCheckedDaysStatus((prev) => ({
        ...prev,
        [date]: cached.length > 0 ? 'available' : 'full',
      }));
      setSlotsLoading(false);
      return cached;
    }

    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const data = await checkAvailability(serviceId, date, employeeId);
      cacheRef.current[cacheKey] = data;
      setSlots(data);
      setCheckedDaysStatus((prev) => ({
        ...prev,
        [date]: data.length > 0 ? 'available' : 'full',
      }));
      return data;
    } catch (error: unknown) {
      setSlots([]);
      setSlotsError(error instanceof Error ? error.message : 'Error al cargar horarios');
      return [];
    } finally {
      setSlotsLoading(false);
    }
  }, [checkAvailability]);

  const createAppointment = useCallback(async (data: Record<string, unknown>) => {
    setBookingLoading(true);
    try { return await appointmentService.createAppointment(data); }
    finally { setBookingLoading(false); }
  }, []);

  return {
    employees,
    employeesLoading,
    employeesError,
    hasMultipleEmployees: employees.length > 1,
    slots,
    slotsLoading,
    slotsError,
    checkedDaysStatus,
    loadAvailability,
    checkAvailability,
    createAppointment,
    bookingLoading,
  };
}
