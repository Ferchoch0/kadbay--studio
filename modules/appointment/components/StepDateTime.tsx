'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiSun,
  FiMoon,
  FiImage,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';

interface StepDateTimeProps {
  selectedService: ServiceItem;
  selectedDate: string | null;
  selectedTime: string | null;
  employeeId: number;
  employeeName?: string;
  workingDays?: number[];
  slots: string[];
  loadingSlots: boolean;
  checkedDaysStatus?: Record<string, 'available' | 'full'>;
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  onSelectDate: (date: string) => void;
  getAvailabilityForDate?: (date: string) => Promise<string[]>;
  onSelectTime: (time: string) => void;
  onUpdateClientInfo: (fields: { clientName?: string; clientPhone?: string; clientNotes?: string }) => void;
  onConfirmBooking: () => void;
  isConfirmed: boolean;
  onFinish: () => void;
  isSubmitting?: boolean;
}

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function StepDateTime({
  selectedService,
  selectedDate,
  selectedTime,
  employeeId,
  employeeName,
  workingDays,
  slots,
  loadingSlots,
  checkedDaysStatus,
  clientName,
  clientPhone,
  clientNotes,
  onSelectDate,
  onSelectTime,
  onUpdateClientInfo,
  onConfirmBooking,
  isConfirmed,
  onFinish,
  isSubmitting = false,
}: StepDateTimeProps) {
  const today = new Date();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const mobilePhoneInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  // Días laborables del profesional: 1 (Lunes) a 7 (Domingo). Por defecto Lunes a Sábado si no hay horario configurado.
  const activeWorkingDays = workingDays && workingDays.length > 0 ? workingDays : [1, 2, 3, 4, 5, 6];

  const availableDays = (() => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const jsDay = date.getDay(); // 0 (Dom) a 6 (Sáb)
      const isoDay = jsDay === 0 ? 7 : jsDay; // 1 (Lun) a 7 (Dom)

      // Si el profesional no trabaja este día de la semana, no se muestra
      if (!activeWorkingDays.includes(isoDay)) {
        continue;
      }

      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({
        date,
        dateString,
        dayOfWeek: DAYS_SHORT_ES[jsDay],
        dayOfMonth: date.getDate(),
        month: MONTHS_ES[date.getMonth()],
        isToday: i === 0,
      });
    }
    return days;
  })();

  // Seleccionar automáticamente el primer día disponible si no hay uno seleccionado
  useEffect(() => {
    if (!selectedDate && availableDays.length > 0) {
      onSelectDate(availableDays[0].dateString);
    }
  }, [selectedDate, availableDays, onSelectDate]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -260 : 260,
        behavior: 'smooth',
      });
    }
  };

  const formatSelectedDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleConfirm = () => {
    if (!selectedTime) {
      setErrorMsg('Por favor selecciona un horario disponible.');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMsg('Por favor ingresa un número de teléfono de contacto.');
      if (showMobileSheet) {
        mobilePhoneInputRef.current?.focus();
      } else {
        phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneInputRef.current?.focus();
      }
      return;
    }
    setErrorMsg('');
    onConfirmBooking();
  };

  if (isConfirmed) {
    return (
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-12 border border-[var(--accent-border)] shadow-[0_20px_50px_rgba(36,21,14,0.08)] text-center flex flex-col items-center w-full"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--accent-soft)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-5 sm:mb-6 shadow-inner">
            <FiCheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <span className="text-xs font-smooth uppercase tracking-[0.3em] text-[var(--accent)] font-bold">
            ¡Reserva Exitosa!
          </span>
          <h2 className="text-xl sm:text-3xl font-serif font-medium text-[var(--text-primary)] mt-2">
            Tu cita ha sido guardada
          </h2>
          <p className="text-xs sm:text-sm font-sans text-[var(--text-secondary)] mt-2 max-w-md">
            Hemos guardado tu reserva para{' '}
            <span className="font-serif font-medium text-[var(--text-primary)]">{selectedService.title}</span> el día{' '}
            <span className="font-serif font-medium text-[var(--text-primary)] capitalize">
              {selectedDate && formatSelectedDate(selectedDate)}
            </span>{' '}
            a las <span className="font-serif font-medium text-[var(--text-primary)]">{selectedTime} hs</span>.
          </p>
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[var(--accent-border)] w-full flex flex-col gap-3">
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Podés confirmarla y consultarla desde «Mis reservas».
            </p>
            <button
              onClick={onFinish}
              type="button"
              className="w-full px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer"
            >
              Ir a mis reservas
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-36 lg:pb-24">
      <div className="mb-5 sm:mb-8">
        <span className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] font-smooth flex items-center gap-1.5">
          <BsStars className="w-3.5 h-3.5" />
          Paso 2 de 2
        </span>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[var(--text-primary)] mt-1.5 font-normal">
          Fecha y Horario
        </h1>
        <p className="text-xs sm:text-base font-sans text-[var(--text-secondary)] mt-1.5">
          Selecciona el día y la hora que mejor se ajuste a tu agenda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Columna Izquierda: Selector de Fechas y Horarios */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-serif font-medium text-[var(--text-primary)]">
                Selecciona una Fecha
              </h2>
            </div>
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all cursor-pointer"
                aria-label="Desplazar fechas a la izquierda"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex-1 flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-1"
                style={{ scrollbarWidth: 'none' }}
              >
                {availableDays.map((day) => {
                  const isSelected = selectedDate === day.dateString;
                  const isFull = checkedDaysStatus?.[day.dateString] === 'full';
                  return (
                    <button
                      key={day.dateString}
                      type="button"
                      onClick={() => onSelectDate(day.dateString)}
                      className={`shrink-0 flex flex-col items-center gap-0.5 sm:gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all min-w-[70px] sm:min-w-[80px] cursor-pointer ${
                        isSelected
                          ? isFull
                            ? 'border-neutral-400 bg-neutral-100 shadow-md'
                            : 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-md'
                          : isFull
                            ? 'border-dashed border-neutral-300 bg-neutral-50/90 hover:border-neutral-400 text-neutral-400'
                            : 'border-[var(--accent-border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      }`}
                    >
                      <span
                        className={`text-[10px] sm:text-xs font-smooth font-bold uppercase tracking-wider ${
                          isSelected
                            ? isFull ? 'text-neutral-600' : 'text-[var(--accent)]'
                            : isFull ? 'text-neutral-400' : 'text-[var(--text-secondary)]'
                        }`}
                      >
                        {day.dayOfWeek}
                      </span>
                      <span
                        className={`text-xl sm:text-2xl font-serif font-bold ${
                          isSelected
                            ? isFull ? 'text-neutral-700' : 'text-[var(--accent)]'
                            : isFull ? 'text-neutral-400 line-through' : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {day.dayOfMonth}
                      </span>
                      <span className={`text-[11px] sm:text-xs font-sans ${
                        isSelected
                          ? isFull ? 'text-neutral-600' : 'text-[var(--accent)]'
                          : isFull ? 'text-neutral-400' : 'text-[var(--text-secondary)]'
                      }`}>
                        {day.month.slice(0, 3)}
                      </span>
                      {isFull ? (
                        <span className="text-[8px] font-smooth font-bold uppercase tracking-wider text-neutral-500 mt-0.5">
                          Lleno
                        </span>
                      ) : day.isToday ? (
                        <span className="text-[9px] font-smooth font-bold uppercase tracking-wider text-[var(--accent)] mt-0.5">
                          Hoy
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-[var(--surface-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all cursor-pointer"
                aria-label="Desplazar fechas a la derecha"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]"
            >
              <h3 className="text-base sm:text-lg font-serif font-medium text-[var(--text-primary)] mb-3 sm:mb-4">
                Horarios Disponibles
              </h3>

              {loadingSlots && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-4 rounded bg-[var(--accent-border)]/40" />
                      <div className="h-4 w-16 rounded bg-[var(--accent-border)]/40" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-10 sm:h-11 rounded-xl bg-[var(--surface-secondary)] animate-pulse border border-[var(--accent-border)]/50"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!loadingSlots && slots.filter((time) => Number(time.slice(0, 2)) < 14).length > 0 && (
                <div className="mb-5 sm:mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FiSun className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-xs sm:text-sm font-smooth font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                      Mañana
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {slots
                      .filter((time) => Number(time.slice(0, 2)) < 14)
                      .map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              onSelectTime(time);
                              setErrorMsg('');
                            }}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white shadow-md font-semibold'
                                : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] border border-[var(--accent-border)]'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {!loadingSlots && slots.filter((time) => Number(time.slice(0, 2)) >= 14).length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiMoon className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-xs sm:text-sm font-smooth font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">
                      Tarde
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {slots
                      .filter((time) => Number(time.slice(0, 2)) >= 14)
                      .map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              onSelectTime(time);
                              setErrorMsg('');
                            }}
                            className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[var(--accent)] text-white shadow-md font-semibold'
                                : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] border border-[var(--accent-border)]'
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {!loadingSlots && slots.length === 0 && (
                <div className="text-center py-6 sm:py-8 space-y-1">
                  <p className="text-sm font-serif font-medium text-[var(--text-primary)]">
                    No hay horarios disponibles para esta fecha
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Todos los turnos de este día ya están reservados. Por favor, selecciona otra fecha en el calendario.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Columna Derecha Desktop: Oculta en Mobile para evitar scroll */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl p-5 sm:p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
            <h3 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-[var(--accent)] font-smooth mb-3 sm:mb-4">
              Detalles de tu Cita
            </h3>

            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/30 mb-3.5">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
                {selectedService.imageUrl ? (
                  <Image src={selectedService.imageUrl} alt={selectedService.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] font-serif font-bold">
                    {selectedService.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-medium text-[var(--text-primary)] text-sm truncate">{selectedService.title}</p>
                <p className="text-xs font-sans text-[var(--text-secondary)] flex items-center gap-1.5 mt-0.5">
                  <FiClock className="w-3.5 h-3.5" />
                  {selectedService.duration || '60 min'}
                </p>
                {selectedService.price !== undefined && selectedService.price !== null && (
                  <p className="text-sm font-semibold text-[var(--accent)] mt-0.5">${selectedService.price}</p>
                )}
              </div>
            </div>

            {employeeName && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--accent-border)]/60 bg-[var(--surface-cream,#faf8f5)] mb-3 text-xs">
                <FiUser className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span className="text-[var(--text-secondary)]">Profesional:</span>
                <span className="font-semibold text-[var(--text-primary)]">{employeeName}</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl border border-[var(--accent-border)] bg-white mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-smooth mb-1.5">
                <FiCalendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Fecha</span>
              </div>
              {selectedDate ? (
                <p className="text-xs sm:text-sm font-serif font-medium text-[var(--text-primary)] capitalize">
                  {formatSelectedDate(selectedDate)}
                </p>
              ) : (
                <p className="text-xs font-sans text-[var(--text-secondary)] italic">Selecciona una fecha</p>
              )}
            </div>

            {selectedTime && (
              <div className="p-3.5 rounded-xl border border-[var(--accent-border)] bg-white mb-3.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] font-smooth mb-1.5">
                  <FiClock className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Horario</span>
                </div>
                <p className="text-xs sm:text-sm font-serif font-medium text-[var(--text-primary)]">{selectedTime} hs</p>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  WhatsApp de contacto <span className="text-red-500">*</span>
                </label>
                <input
                  ref={phoneInputRef}
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => onUpdateClientInfo({ clientPhone: e.target.value })}
                  placeholder="Ej. +54 9 11 2345-6789"
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-[var(--accent-border)] text-xs sm:text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                  Notas o preferencias (opcional)
                </label>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => onUpdateClientInfo({ clientNotes: e.target.value })}
                  placeholder="Ej. Preferencias de estilo..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--accent-border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {clientName && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Reservando como <strong>{clientName}</strong></span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-sans text-red-600">{errorMsg}</p>
              </div>
            )}

            {selectedDate && selectedTime && (
              <button
                onClick={handleConfirm}
                type="button"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-sans font-semibold shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Confirmando...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar reserva</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Barra Fija Inferior en Mobile & Tablet (< lg) cuando fecha y hora están seleccionadas */}
      <AnimatePresence>
        {selectedDate && selectedTime && (
          <motion.aside
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            aria-label="Confirmación de cita móvil"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--accent-border)] shadow-[0_-8px_24px_rgba(36,21,14,0.12)] px-4 py-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-semibold uppercase tracking-wider truncate">
                  <FiCalendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{selectedDate}</span>
                  <span>•</span>
                  <span className="shrink-0">{selectedTime} hs</span>
                </div>
                <p className="font-serif font-medium text-xs sm:text-sm text-[var(--text-primary)] truncate mt-0.5">
                  {selectedService.title}
                </p>
              </div>

              <button
                onClick={() => {
                  setErrorMsg('');
                  setShowMobileSheet(true);
                }}
                type="button"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer"
              >
                <span>Siguiente</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bottom Sheet Drawer que se levanta en Mobile al hacer clic en 'Siguiente' */}
      <AnimatePresence>
        {showMobileSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
            {/* Fondo desenfocado */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSheet(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Hoja desplegable hacia arriba */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 290 }}
              className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl p-5 sm:p-6 shadow-2xl border-t border-[var(--accent-border)] max-h-[90vh] overflow-y-auto flex flex-col"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
            >
              {/* Tirador para arrastre en pantalla táctil */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-3 shrink-0" />

              <div className="flex items-center justify-between pb-3 border-b border-[var(--accent-border)]/60 shrink-0">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">Paso Final</span>
                  <h3 className="text-base font-serif font-medium text-[var(--text-primary)]">
                    Detalles y Confirmación
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMobileSheet(false)}
                  className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
                  aria-label="Cerrar confirmación"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 pt-3 flex-1">
                {/* Resumen del Servicio */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent)]/30">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white text-[var(--accent)] border border-[var(--accent)]/20 shadow-xs font-serif font-bold text-lg">
                    {selectedService.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-[var(--text-primary)] text-sm truncate">
                      {selectedService.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-0.5">
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" />
                        {selectedService.duration || '60 min'}
                      </span>
                      {selectedService.price !== undefined && selectedService.price !== null && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-[var(--accent)]">${selectedService.price}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fecha y Horario destacados */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl border border-[var(--accent-border)] bg-[var(--surface-cream,#faf8f5)]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                      <FiCalendar className="w-3 h-3 text-[var(--accent)]" />
                      <span>Fecha</span>
                    </div>
                    <p className="text-xs font-serif font-medium text-[var(--text-primary)] capitalize truncate">
                      {selectedDate && formatSelectedDate(selectedDate)}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl border border-[var(--accent-border)] bg-[var(--surface-cream,#faf8f5)]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-0.5">
                      <FiClock className="w-3 h-3 text-[var(--accent)]" />
                      <span>Horario</span>
                    </div>
                    <p className="text-xs font-serif font-medium text-[var(--text-primary)]">
                      {selectedTime} hs
                    </p>
                  </div>
                </div>

                {employeeName && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--accent-border)]/60 bg-white text-xs">
                    <FiUser className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                    <span className="text-[var(--text-secondary)]">Profesional:</span>
                    <span className="font-semibold text-[var(--text-primary)] font-serif truncate">{employeeName}</span>
                  </div>
                )}

                {/* Input de WhatsApp */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider">
                    WhatsApp de contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={mobilePhoneInputRef}
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => onUpdateClientInfo({ clientPhone: e.target.value })}
                    placeholder="Ej. +54 9 11 2345-6789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--accent-border)] text-sm focus:outline-none focus:border-[var(--accent)] transition-colors bg-white shadow-xs"
                  />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Recibirás la confirmación y avisos en este número.
                  </p>
                </div>

                {/* Notas adicionales */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    Notas o preferencias (opcional)
                  </label>
                  <input
                    type="text"
                    value={clientNotes}
                    onChange={(e) => onUpdateClientInfo({ clientNotes: e.target.value })}
                    placeholder="Ej. Preferencias de estilo..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[var(--accent-border)] text-xs focus:outline-none focus:border-[var(--accent)] transition-colors bg-white"
                  />
                </div>

                {clientName && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-emerald-50/80 border border-emerald-200/80 p-2.5 rounded-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">Confirmando como <strong>{clientName}</strong></span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-xs font-sans text-red-600">{errorMsg}</p>
                  </div>
                )}

                {/* Botón Principal */}
                <button
                  onClick={handleConfirm}
                  type="button"
                  disabled={isSubmitting}
                  className="w-full mt-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirmar reserva</span>
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
