'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/modules/home/_components/navbar/Navbar';
import { ClientAppointment, appointmentService } from '@/services/appointment.service';
import { FiAlertTriangle, FiCalendar, FiMapPin, FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';

const appointmentStatusLabels: Record<ClientAppointment['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
  no_show: 'No asistió',
};

function getAppointmentStatusLabel(status: ClientAppointment['status']): string {
  return appointmentStatusLabels[status] ?? status;
}

function getAppointmentStatusClass(status: ClientAppointment['status']): string {
  const classes: Record<ClientAppointment['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
  };

  return classes[status] ?? 'bg-gray-100 text-gray-800';
}

function AppointmentModal({
  appointment,
  onClose,
  onUpdate,
  showActions,
}: {
  appointment: ClientAppointment;
  onClose: () => void;
  onUpdate: (status: 'confirmed' | 'cancelled') => void;
  showActions: boolean;
}) {
  const date = new Date(appointment.scheduled_at);
  const isPending = String(appointment.status).toLowerCase() === 'pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        data-lenis-prevent
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl bg-[#FAF7F2] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl text-[#24150E]">Reserva</h2>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-full p-2 text-[#24150E] transition-colors hover:bg-[#EAD7BC]/50" aria-label="Cerrar reserva">
            <FiX />
          </button>
        </div>

        <div className="mt-6 space-y-2 text-sm text-[#7C604F]">
          <p>{date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p>Estado: <strong>{getAppointmentStatusLabel(appointment.status)}</strong></p>
          <p>Profesional: <strong>{appointment.employee_name}</strong></p>
          <p>Horario: <strong>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.ends_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong></p>
        </div>

        <section className="mt-6 border-t border-[#EAD7BC] pt-5">
          <div className="flex justify-between">
            <h3 className="font-serif text-xl">Resumen</h3>
            <span>{date.toLocaleDateString('es-ES')}</span>
          </div>
          <p className="mt-3 font-semibold">{appointment.service_name}</p>
          <p>Profesional: {appointment.employee_name}</p>
          <div className="mt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span>{appointment.service_price !== undefined && appointment.service_price !== null ? `$${appointment.service_price}` : 'A confirmar'}</span>
          </div>
        </section>

        <div className="mt-5 flex gap-3 rounded-xl bg-[#EAD7BC]/40 p-3 text-sm">
          <FiAlertTriangle className="shrink-0" />El precio puede variar según el servicio realizado.
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" disabled className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#EAD7BC] p-3 text-left text-sm opacity-60">
            <FiCalendar />Agregar al calendario
          </button>
          <button type="button" className="cursor-pointer flex items-center gap-2 rounded-xl border border-[#EAD7BC] p-3 text-left text-sm transition-colors hover:bg-[#EAD7BC]/40">
            <FiMapPin />Ver mapa
          </button>
        </div>

        {showActions && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => onUpdate('cancelled')}
              className="btn-skew-transparent cursor-pointer flex-1 rounded-full border border-red-300 py-3 text-red-700 hover:bg-red-50 transition-colors"
              style={{ '--btn-hover-bg': '#FEE2E2', '--btn-hover-text': '#B91C1C' } as React.CSSProperties}
            >
              <span>Cancelar cita</span>
            </button>
            {isPending && (
              <button
                type="button"
                onClick={() => onUpdate('confirmed')}
                className="btn-skew-anim cursor-pointer flex-1 rounded-full"
                style={{ '--btn-bg': '#24150E', '--btn-hover-bg': '#C59A45', '--btn-text': '#FAF7F2', '--btn-hover-text': '#FAF7F2' } as React.CSSProperties}
              >
                <span>Confirmar cita</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function AppointmentsPage({ isModal = false }: { isModal?: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ClientAppointment | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setLoading(true);
    appointmentService
      .getClientAppointments()
      .then(setAppointments)
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const lenisInstance = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
    lenisInstance?.stop();

    return () => {
      document.body.style.overflow = originalOverflow;
      lenisInstance?.start();
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      if (isModal) {
        router.back();
      } else {
        router.push('/');
      }
    }, 320);
  };

  const visible = appointments.filter((a) =>
    tab === 'upcoming' ? !['completed', 'cancelled'].includes(a.status) : ['completed', 'cancelled'].includes(a.status)
  );

  const update = async (status: 'confirmed' | 'cancelled') => {
    if (!selected) return;
    try {
      const updated = await appointmentService.updateClientAppointmentStatus(selected.id, status);
      setAppointments((all) => all.map((a) => (a.id === selected.id ? updated : a)));
      setSelected(null);
    } catch {
      // Mantener el modal abierto para que el usuario pueda reintentar.
    }
  };

  const content = (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? '0%' : '100%' }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      data-lenis-prevent
      className={`bg-[#FAF7F2] w-full flex flex-col ${
        isModal
          ? 'fixed top-20 inset-x-0 bottom-0 z-40 border-t border-[#EAD7BC]/60 shadow-[0_-12px_40px_rgba(36,21,14,0.08)]'
          : 'min-h-[calc(100vh-80px)] pt-20'
      }`}
    >
      {/* Navbar propio debajo del global */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAD7BC]/70 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto h-16 sm:h-18 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-2 px-3 py-2 -ml-2 rounded-full text-[#24150E]/80 hover:text-[#24150E] hover:bg-[#EAD7BC]/30 active:scale-95 transition-all text-sm font-medium tracking-wide focus:outline-none cursor-pointer"
            title="Volver"
          >
            <FiArrowLeft className="w-5 h-5 shrink-0 text-[#24150E]" />
            <span className="font-sans text-xs uppercase tracking-wider font-semibold">
              Volver
            </span>
          </button>

          <h2 className="font-serif text-lg text-[#24150E]">Mis reservas</h2>

          <button
            type="button"
            onClick={() => router.push('/appointments/new')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#24150E] text-[#24150E] text-xs font-semibold uppercase tracking-wider hover:bg-[#C59A45] hover:text-[#FAF7F2] hover:border-[#C59A45] active:scale-95 transition-all cursor-pointer shadow-xs"
            aria-label="Nueva reserva"
            title="Nueva reserva"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva reserva</span>
          </button>
        </div>
      </header>

      {/* Contenedor scrolleable de las reservas */}
      <div
        id="appointments-scroll"
        data-lenis-prevent
        className="flex-1 overflow-y-auto overflow-x-hidden relative overscroll-contain"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Título */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#24150E]">
              Tus reservas
            </h1>
            <p className="text-sm sm:text-base text-[#7C604F] mt-1.5">
              Consulta tus citas agendadas o tu historial en el estudio.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#EAD7BC]">
            <button
              type="button"
              onClick={() => setTab('upcoming')}
              className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors hover:text-[#C59A45] ${
                tab === 'upcoming'
                  ? 'border-[#C59A45] text-[#C59A45] font-semibold'
                  : 'border-transparent text-[#7C604F]'
              }`}
            >
              Próximas
            </button>
            <button
              type="button"
              onClick={() => setTab('history')}
              className={`cursor-pointer border-b-2 pb-3 text-sm font-medium transition-colors hover:text-[#C59A45] ${
                tab === 'history'
                  ? 'border-[#C59A45] text-[#C59A45] font-semibold'
                  : 'border-transparent text-[#7C604F]'
              }`}
            >
              Historial
            </button>
          </div>

          {/* Lista de reservas */}
          <div className="mt-6 space-y-3.5">
            {loading && (
              <div className="space-y-3.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full rounded-2xl bg-white border border-[#EAD7BC]/70 p-4 sm:p-5 shadow-xs animate-pulse">
                    <div className="flex justify-between items-start gap-2">
                      <div className="h-5 w-40 rounded-lg bg-[#EAD7BC]/60" />
                      <div className="h-6 w-20 rounded-full bg-[#EAD7BC]/60" />
                    </div>
                    <div className="mt-3 h-4 w-56 rounded bg-[#EAD7BC]/40" />
                    <div className="mt-2 h-4 w-24 rounded bg-[#EAD7BC]/40" />
                  </div>
                ))}
              </div>
            )}

            {!loading && visible.map((a) => (
              <button
                type="button"
                key={a.id}
                onClick={() => setSelected(a)}
                className="w-full cursor-pointer rounded-2xl bg-white border border-[#EAD7BC]/70 p-4 sm:p-5 text-left shadow-xs transition-all hover:border-[#C59A45]/50 hover:shadow-md"
              >
                <div className="flex justify-between items-start gap-2">
                  <strong className="text-base sm:text-lg text-[#24150E]">{a.service_name}</strong>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getAppointmentStatusClass(a.status)}`}>
                    {getAppointmentStatusLabel(a.status)}
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-[#7C604F]">
                  {new Date(a.scheduled_at).toLocaleString('es-ES', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  · {a.employee_name}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-[#C59A45]">
                  {a.service_price !== undefined && a.service_price !== null
                    ? `$${a.service_price}`
                    : 'Precio a confirmar'}
                </p>
              </button>
            ))}

            {!loading && visible.length === 0 && (
              <div className="py-16 text-center">
                <FiCalendar className="mx-auto h-10 w-10 text-[#7C604F]/40 mb-3" />
                <p className="text-sm text-[#7C604F]">No tienes reservas en esta sección.</p>
                <button
                  type="button"
                  onClick={() => router.push('/appointments/new')}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24150E] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#C59A45] transition-colors cursor-pointer"
                >
                  Agendar una cita
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selected && (
        <AppointmentModal
          appointment={selected}
          onClose={() => setSelected(null)}
          onUpdate={update}
          showActions={tab === 'upcoming' && !['completed', 'cancelled'].includes(selected.status)}
        />
      )}
    </motion.div>
  );

  if (isModal) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              data-lenis-prevent
              className="fixed inset-0 bg-black/20 z-30 pointer-events-auto"
            />
            {content}
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <Navbar />
      {content}
    </main>
  );
}
