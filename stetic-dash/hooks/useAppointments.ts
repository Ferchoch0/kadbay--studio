'use client';

import { useCallback, useEffect, useState } from 'react';
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

export function useAppointments() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    appointmentService.getEmployees()
      .then((data) => { if (mounted) { setEmployees(data); setEmployeesError(null); } })
      .catch((error: unknown) => { if (mounted) setEmployeesError(error instanceof Error ? error.message : 'Error al cargar empleados'); })
      .finally(() => { if (mounted) setEmployeesLoading(false); });
    return () => { mounted = false; };
  }, []);

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
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const data = await checkAvailability(serviceId, date, employeeId);
      setSlots(data);
    } catch (error: unknown) {
      setSlots([]);
      setSlotsError(error instanceof Error ? error.message : 'Error al cargar horarios');
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
    loadAvailability,
    checkAvailability,
    createAppointment,
    bookingLoading,
  };
}
