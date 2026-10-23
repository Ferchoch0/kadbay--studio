'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiArrowRight, FiCheckCircle, FiSun, FiMoon, FiImage } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';


interface StepDateTimeProps {
  selectedService: ServiceItem;
  selectedDate: string | null;
  selectedTime: string | null;
  employeeId: number;
  slots: string[];
  loadingSlots: boolean;
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  onSelectDate: (date: string) => void;
  getAvailabilityForDate: (date: string) => Promise<string[]>;
  onSelectTime: (time: string) => void;
  onUpdateClientInfo: (fields: { clientName?: string; clientPhone?: string; clientNotes?: string }) => void;
  onConfirmBooking: () => void;
  isConfirmed: boolean;
  onFinish: () => void;
}

const MONTHS_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function StepDateTime({ selectedService, selectedDate, selectedTime, employeeId, slots, loadingSlots, clientName, clientPhone, getAvailabilityForDate, onSelectDate, onSelectTime, onUpdateClientInfo, onConfirmBooking, isConfirmed, onFinish }: StepDateTimeProps) {
  const today = new Date();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const getNext14Days = () => {
    const days = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      days.push({ date, dateString, dayOfWeek: DAYS_SHORT_ES[date.getDay()], dayOfMonth: date.getDate(), month: MONTHS_ES[date.getMonth()], isToday: i === 0 });
    }
    return days;
  };

  const [availableDays, setAvailableDays] = useState(() => getNext14Days().filter((day) => day.date.getDay() !== 0));

  useEffect(() => {
    let active = true;
    Promise.all(getNext14Days().filter((day) => day.date.getDay() !== 0).map(async (day) => ({ day, slots: await getAvailabilityForDate(day.dateString) })))
      .then((results) => { if (active) setAvailableDays(results.filter(({ slots }) => slots.length > 0).map(({ day }) => day)); })
      .catch(() => { if (active) setAvailableDays([]); });
    return () => { active = false; };
  }, [getAvailabilityForDate, selectedService.id, employeeId]);
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  const formatSelectedDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleConfirm = () => {
    if (!selectedTime) { setErrorMsg('Por favor selecciona un horario disponible.'); return; }
    if (!clientName.trim()) { setErrorMsg('Por favor ingresa tu nombre completo.'); return; }
    if (!clientPhone.trim()) { setErrorMsg('Por favor ingresa un número de teléfono de contacto.'); return; }
    setErrorMsg('');
    onConfirmBooking();
  };

  if (isConfirmed) {
    return (
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-8 sm:p-12 border border-[var(--accent-border)] shadow-[0_20px_50px_rgba(36,21,14,0.08)] text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] border-2 border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-6 shadow-inner">
            <FiCheckCircle className="w-10 h-10" />
          </div>
          <span className="text-xs font-smooth uppercase tracking-[0.3em] text-[var(--accent)] font-bold">¡Reserva Exitosa!</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[var(--text-primary)] mt-2">Tu cita ha sido guardada</h2>
          <p className="text-sm font-sans text-[var(--text-secondary)] mt-2 max-w-md">
            Hemos guardado tu reserva para <span className="font-serif font-medium text-[var(--text-primary)]">{selectedService.title}</span> el día <span className="font-serif font-medium text-[var(--text-primary)] capitalize">{selectedDate && formatSelectedDate(selectedDate)}</span> a las <span className="font-serif font-medium text-[var(--text-primary)]">{selectedTime} hs</span>.
          </p>
          <div className="mt-8 pt-6 border-t border-[var(--accent-border)] w-full flex flex-col gap-3">
            <p className="text-sm text-[var(--text-secondary)]">Puedes confirmarla desde la sección «Tus reservas».</p><button onClick={onFinish} type="button" className="w-full px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md">Ir a mis reservas</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
      <div className="mb-6 sm:mb-8">
        <span className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] font-smooth flex items-center gap-1.5"><BsStars className="w-3.5 h-3.5" />Paso 2 de 2</span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--text-primary)] mt-2 font-normal">Fecha y Horario</h1>
        <p className="text-sm sm:text-base font-sans text-[var(--text-secondary)] mt-2">Selecciona el día y la hora que mejor se ajuste a tu agenda.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
            <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-serif font-medium text-[var(--text-primary)]">Selecciona una Fecha</h2></div>
            <div className="relative flex items-center gap-2">
              <button type="button" onClick={() => handleScroll('left')} className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all"><FiChevronLeft className="w-4 h-4" /></button>
              <div ref={scrollContainerRef} className="flex-1 flex items-center gap-3 overflow-x-auto scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none' }}>
                {availableDays.map((day) => {
                  const isSelected = selectedDate === day.dateString;
                  return (
                    <button key={day.dateString} type="button" onClick={() => onSelectDate(day.dateString)} className={`shrink-0 flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all min-w-[80px] ${isSelected ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-md' : 'border-[var(--accent-border)] bg-white hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]'}`}>
                      <span className={`text-xs font-smooth font-bold uppercase tracking-[0.3em] ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{day.dayOfWeek}</span>
                      <span className={`text-2xl font-serif font-bold ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>{day.dayOfMonth}</span>
                      <span className={`text-xs font-sans ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{day.month.slice(0, 3)}</span>
                      {day.isToday && <span className="text-[9px] font-smooth font-bold uppercase tracking-[0.3em] text-[var(--accent)] mt-1">Hoy</span>}
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => handleScroll('right')} className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-lg bg-[var(--surface-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-all"><FiChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          {selectedDate && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
              <h3 className="text-lg font-serif font-medium text-[var(--text-primary)] mb-4">Horarios Disponibles</h3>
              {slots.filter((time) => Number(time.slice(0, 2)) < 14).length > 0 && <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiSun className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-smooth font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Mañana</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(loadingSlots ? [] : slots.filter((time) => Number(time.slice(0, 2)) < 14)).map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button key={time} type="button" onClick={() => onSelectTime(time)} className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${isSelected ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] border border-[var(--accent-border)]'}`}>{time}</button>
                    );
                  })}
                </div>
              </div>}
              {slots.filter((time) => Number(time.slice(0, 2)) >= 14).length > 0 && <div>
                <div className="flex items-center gap-2 mb-3">
                  <FiMoon className="w-4 h-4 text-[var(--accent)]" />
                  <span className="text-sm font-smooth font-bold text-[var(--text-secondary)] uppercase tracking-[0.3em]">Tarde</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(loadingSlots ? [] : slots.filter((time) => Number(time.slice(0, 2)) >= 14)).map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <button key={time} type="button" onClick={() => onSelectTime(time)} className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${isSelected ? 'bg-[var(--accent)] text-white shadow-md' : 'bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] border border-[var(--accent-border)]'}`}>{time}</button>
                    );
                  })}
                </div>
              </div>}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-[var(--accent-border)] shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
            <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-[var(--accent)] font-smooth mb-4">Detalles de tu Cita</h3>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/30 mb-4">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                {selectedService.imageUrl ? (
                  <Image src={selectedService.imageUrl} alt={selectedService.title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FiImage className="w-5 h-5" aria-label="Servicio sin imagen" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif font-medium text-[var(--text-primary)] text-sm">{selectedService.title}</p>
                <p className="text-xs font-sans text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                  <FiClock className="w-3.5 h-3.5" />
                  {selectedService.duration || '60 min'}
                </p>
                {selectedService.price !== undefined && selectedService.price !== null && (
                  <p className="text-sm font-semibold text-[var(--accent)] mt-1">${selectedService.price}</p>
                )}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-[var(--accent-border)] bg-white mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] font-smooth mb-2">
                <FiCalendar className="w-4 h-4 text-[var(--accent)]" />
                <span>Fecha</span>
              </div>
              {selectedDate ? (
                <p className="text-sm font-serif font-medium text-[var(--text-primary)] capitalize">{formatSelectedDate(selectedDate)}</p>
              ) : (
                <p className="text-xs font-sans text-[var(--text-secondary)] italic">Selecciona una fecha</p>
              )}
            </div>
            {selectedTime && (
              <div className="p-4 rounded-xl border border-[var(--accent-border)] bg-white mb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[var(--text-secondary)] font-smooth mb-2">
                  <FiClock className="w-4 h-4 text-[var(--accent)]" />
                  <span>Horario</span>
                </div>
                <p className="text-sm font-serif font-medium text-[var(--text-primary)]">{selectedTime} hs</p>
              </div>
            )}
            <div className="space-y-3 mb-4">
              <input type="tel" value={clientPhone} onChange={(e) => onUpdateClientInfo({ clientPhone: e.target.value })} placeholder="Número de teléfono o WhatsApp" className="w-full px-4 py-3 rounded-xl border border-[var(--accent-border)] text-sm focus:outline-none focus:border-[var(--accent)]" />
            </div>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-sans text-red-600">{errorMsg}</p>
              </div>
            )}
            {selectedDate && selectedTime && (
              <button onClick={handleConfirm} type="button" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-sans font-semibold shadow-md">
                <span>Continuar</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
