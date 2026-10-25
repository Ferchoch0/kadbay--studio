'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ServiceItem } from '@/data/services.mock';
import { BookingStep, BookingState } from './types';
import { StepNavbar } from './components/StepNavbar';
import { StepServices } from './components/StepServices';
import { StepDateTime } from './components/StepDateTime';
import { StepEmployee } from './components/StepEmployee';
import { useServices } from '@/hooks/useServices';
import { useAppointments } from '@/hooks/useAppointments';
import { getStoredClient } from '@/modules/auth/auth.service';

interface AppointmentSheetProps {
  isModal?: boolean;
}

export function AppointmentSheet({ isModal = true }: AppointmentSheetProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const { employees, hasMultipleEmployees, slots, slotsLoading, loadAvailability, checkAvailability, createAppointment } = useAppointments();
  const [clientId, setClientId] = useState<number | null>(null);

  useEffect(() => {
    if (employees.length === 1) {
      setState((prev) => ({ ...prev, selectedEmployee: employees[0] }));
    }
    const client = getStoredClient();
    if (client) { setClientId(client.id); setState((prev) => ({ ...prev, clientName: client.name, clientPhone: client.phone ?? '' })); }
  }, [employees]);

  const [state, setState] = useState<BookingState>({
    step: 1,
    selectedService: null,
    selectedEmployee: null,
    selectedDate: null,
    selectedTime: null,
    clientName: '',
    clientPhone: '',
    clientNotes: '',
    isConfirmed: false,
  });

  useEffect(() => {
    if (!state.selectedService || !state.selectedDate || !state.selectedEmployee) return;
    loadAvailability(
      state.selectedService.id,
      state.selectedDate,
      Number(state.selectedEmployee.id),
    );
  }, [state.selectedService, state.selectedDate, state.selectedEmployee, loadAvailability]);

  useEffect(() => {
    // Activar animación al montar
    const timer = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Interceptar wheel en la fase de captura:
  // - Si el target está dentro del contenedor scrollable del modal → dejar pasar (scroll interno).
  // - Si está fuera (en el home de fondo) → cancelar para que el home no se mueva.
  // Evitamos lenis.stop() porque agrega overflow:clip al <html> y rompe el scroll interno.
  useEffect(() => {
    if (!isModal) return;

    const preventBehindScroll = (e: WheelEvent) => {
      const scrollContainer = document.getElementById('appointment-scroll');
      if (scrollContainer && scrollContainer.contains(e.target as Node)) return;
      e.preventDefault();
    };

    window.addEventListener('wheel', preventBehindScroll, { passive: false, capture: true });
    return () => {
      window.removeEventListener('wheel', preventBehindScroll, { capture: true });
    };
  }, [isModal]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      router.back();
    }, 320);
  };

  const handleFinish = () => {
    setIsOpen(false);
    setTimeout(() => router.push('/appointments'), 320);
  };

  const handleStepBack = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: (prev.step - 1) as BookingStep }));
    } else {
      handleClose();
    }
  };

  const employeeStep = hasMultipleEmployees;
  const dateStep = employeeStep ? 3 : 2;
  const canNavigateToStep = (targetStep: BookingStep): boolean => {
    if (targetStep === 1) return true;
    if (employeeStep && targetStep === 2) return !!state.selectedService;
    if (targetStep === dateStep) return !!state.selectedService && !!state.selectedEmployee;
    return false;
  };

  const handleSelectService = (service: ServiceItem) => {
    setState((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  const handleSelectDate = (date: string) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleSelectTime = (time: string) => {
    setState((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  const handleUpdateClientInfo = (fields: {
    clientName?: string;
    clientPhone?: string;
    clientNotes?: string;
  }) => {
    setState((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const handleConfirmBooking = async () => {
    if (!clientId || !state.selectedService || !state.selectedDate || !state.selectedTime || !state.selectedEmployee) return;
    const scheduledAt = `${state.selectedDate} ${state.selectedTime}:00`;
    await createAppointment({ client_id: clientId, service_id: Number(state.selectedService.id), employee_id: Number(state.selectedEmployee.id), scheduled_at: scheduledAt, price: state.selectedService.price, phone_number: state.clientPhone, notes: state.clientNotes });
    setState((prev) => ({ ...prev, isConfirmed: true }));
  };

  const content = (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? '0%' : '100%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className={`bg-[#FAF7F2] w-full flex flex-col ${
        isModal
          ? 'fixed top-20 inset-x-0 bottom-0 z-40 border-t border-[#EAD7BC]/60 shadow-[0_-12px_40px_rgba(36,21,14,0.08)]'
          : 'min-h-[calc(100vh-80px)] pt-20'
      }`}
    >
      {/* Segundo Navbar: Línea de pasos interactiva justo debajo del Navbar principal */}
      <StepNavbar
        currentStep={state.step}
        onStepChange={(step) => setState((prev) => ({ ...prev, step }))}
        onBack={handleStepBack}
        canNavigateToStep={canNavigateToStep}
      />

      {/* Contenido dinámico según el paso actual */}
      <div id="appointment-scroll" className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <AnimatePresence mode="wait">
          {state.step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <StepServices
                services={services}
                loading={servicesLoading}
                error={servicesError}
                selectedService={state.selectedService}
                onSelectService={handleSelectService}
                onNext={() => setState((prev) => ({ ...prev, step: (employeeStep ? 2 : dateStep) as BookingStep }))}
              />
            </motion.div>
          )}

          {employeeStep && state.step === 2 && state.selectedService && (
            <StepEmployee employees={employees} selectedEmployee={state.selectedEmployee} onSelect={(employee) => setState((prev) => ({ ...prev, selectedEmployee: employee }))} onNext={() => setState((prev) => ({ ...prev, step: 3 }))} />
          )}

          {state.step === dateStep && state.selectedService && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <StepDateTime
                selectedService={state.selectedService}
                employeeId={Number(state.selectedEmployee?.id)}
                slots={slots.map((slot) => slot.time)}
                loadingSlots={slotsLoading}
                selectedDate={state.selectedDate}
                selectedTime={state.selectedTime}
                clientName={state.clientName}
                clientPhone={state.clientPhone}
                clientNotes={state.clientNotes}
                getAvailabilityForDate={async (date) => (await checkAvailability(state.selectedService!.id, date, Number(state.selectedEmployee!.id))).map((slot) => slot.time)}
                onSelectDate={(date) => { handleSelectDate(date); if (state.selectedService && state.selectedEmployee) loadAvailability(state.selectedService.id, date, Number(state.selectedEmployee.id)); }}
                onSelectTime={handleSelectTime}
                onUpdateClientInfo={handleUpdateClientInfo}
                onConfirmBooking={handleConfirmBooking}
                isConfirmed={state.isConfirmed}
                onFinish={handleFinish}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fondo oscuro translúcido opcional para el área restante */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 z-30 pointer-events-auto"
          />
          {content}
        </>
      )}
    </AnimatePresence>
  );
}
