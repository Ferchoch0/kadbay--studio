'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiArrowRight, FiImage } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';

interface StepDateProps {
  selectedService: ServiceItem;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onNext: () => void;
}

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAYS_HEADER_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function StepDate({
  selectedService,
  selectedDate,
  onSelectDate,
  onNext,
}: StepDateProps) {
  // Inicializamos con la fecha actual
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Cálculo de días para el calendario
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  // Ajustar día de la semana para que Lunes sea 0 y Domingo sea 6
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays: Array<{ day: number; dateString: string; isPast: boolean; isSunday: boolean } | null> = [];

  // Espacios vacíos antes del primer día del mes
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(currentYear, currentMonth, d);
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // Comparar con hoy (sin horas)
    const isPast = new Date(currentYear, currentMonth, d, 23, 59, 59) < today;
    const isSunday = dateObj.getDay() === 0;

    calendarDays.push({
      day: d,
      dateString,
      isPast,
      isSunday,
    });
  }

  // Formato legible de fecha seleccionada
  const formatSelectedDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Encabezado */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A45] font-sans flex items-center gap-1.5 justify-center sm:justify-start">
          <BsStars className="w-3.5 h-3.5" />
          Paso 2 de 3
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#24150E] mt-1 font-normal">
          Selecciona la Fecha
        </h1>
        <p className="text-sm text-[#7C604F] mt-1">
          Escoge el día en que deseas asistir a tu cita de belleza.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-28">
        {/* Calendario Principal */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-[#EAD7BC]/60 shadow-[0_12px_35px_rgba(36,21,14,0.05)]">
          {/* Navegación del Mes */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#EAD7BC]/40">
            <h2 className="text-lg sm:text-xl font-serif font-medium text-[#24150E]">
              {MONTHS_ES[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#24150E] active:scale-95 transition-all"
                title="Mes anterior"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-[#FAF7F2] text-[#24150E] active:scale-95 transition-all"
                title="Mes siguiente"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {DAYS_HEADER_ES.map((day) => (
              <span key={day} className="text-xs font-semibold uppercase tracking-wider text-[#7C604F]/70 py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Matriz del Calendario */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarDays.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="h-10 sm:h-12" />;
              }

              const isSelected = selectedDate === item.dateString;
              const isDisabled = item.isPast;

              return (
                <button
                  key={item.dateString}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectDate(item.dateString)}
                  className={`h-10 sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition-all relative ${
                    isDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-[#C59A45] text-white shadow-md scale-105 font-semibold ring-2 ring-[#C59A45]/30'
                      : 'hover:bg-[#FAF7F2] hover:border-[#EAD7BC] text-[#24150E] border border-transparent'
                  }`}
                >
                  <span>{item.day}</span>
                  {!isDisabled && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#C59A45]/60 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAD7BC]/40 flex items-center justify-between text-xs text-[#7C604F]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C59A45]" />
              <span>Día Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <span>No Disponible</span>
            </div>
          </div>
        </div>

        {/* Resumen del Servicio & Fecha */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD7BC]/60 shadow-[0_12px_35px_rgba(36,21,14,0.05)]">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#C59A45]">
              Detalles de tu Cita
            </span>

            {/* Servicio seleccionado */}
            <div className="mt-4 flex gap-4 items-center p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAD7BC]/40">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                {selectedService.imageUrl ? (
                  <Image
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FiImage className="w-7 h-7" aria-label="Servicio sin imagen" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-serif font-medium text-[#24150E] text-base leading-tight">
                  {selectedService.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#7C604F]">
                  <FiClock className="w-3.5 h-3.5 text-[#C59A45]" />
                  <span>{selectedService.duration || '60 min'}</span>
                </div>
              </div>
            </div>

            {/* Fecha seleccionada */}
            <div className="mt-5 p-4 rounded-2xl border border-[#EAD7BC]/50 bg-white">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#523B2D]">
                <FiCalendar className="w-4 h-4 text-[#C59A45]" />
                <span>Fecha Elegida</span>
              </div>
              {selectedDate ? (
                <p className="mt-2 text-sm sm:text-base font-serif font-medium text-[#24150E] capitalize">
                  {formatSelectedDate(selectedDate)}
                </p>
              ) : (
                <p className="mt-2 text-xs text-[#7C604F]/70 italic">
                  Por favor selecciona un día en el calendario de la izquierda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de acción inferior */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#EAD7BC] py-3.5 px-4 sm:px-8 z-30 shadow-[0_-8px_25px_rgba(36,21,14,0.08)]"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#C59A45] font-semibold">
                Fecha confirmada
              </span>
              <p className="text-sm font-serif font-medium text-[#24150E] capitalize">
                {formatSelectedDate(selectedDate)}
              </p>
            </div>

            <button
              onClick={onNext}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#24150E] text-[#FAF7F2] hover:bg-[#C59A45] active:scale-95 transition-all text-xs uppercase tracking-widest font-semibold shadow-md"
            >
              <span>Continuar a Horario</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
