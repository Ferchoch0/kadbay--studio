'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiCheckCircle, FiUser, FiPhone, FiCheck, FiSun, FiMoon, FiImage } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';

interface StepTimeProps {
  selectedService: ServiceItem;
  selectedDate: string;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  onSelectTime: (time: string) => void;
  onUpdateClientInfo: (fields: { clientName?: string; clientPhone?: string; clientNotes?: string }) => void;
  onConfirmBooking: () => void;
  isConfirmed: boolean;
  onFinish: () => void;
}

const MORNING_SLOTS = ['09:00', '10:00', '11:00', '12:00'];
const AFTERNOON_SLOTS = ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

export function StepTime({
  selectedService,
  selectedDate,
  selectedTime,
  clientName,
  clientPhone,
  clientNotes,
  onSelectTime,
  onUpdateClientInfo,
  onConfirmBooking,
  isConfirmed,
  onFinish,
}: StepTimeProps) {
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleConfirm = () => {
    if (!selectedTime) {
      setErrorMsg('Por favor selecciona un horario disponible.');
      return;
    }
    if (!clientName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMsg('Por favor ingresa un número de teléfono o WhatsApp de contacto.');
      return;
    }

    setErrorMsg('');
    onConfirmBooking();
  };

  if (isConfirmed) {
    return (
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAD7BC] shadow-[0_20px_50px_rgba(36,21,14,0.08)] text-center flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#FAF7F2] border-2 border-[#C59A45] flex items-center justify-center text-[#C59A45] mb-6 shadow-inner">
            <FiCheckCircle className="w-10 h-10" />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-[#C59A45] font-semibold">
            ¡Reserva Exitosa!
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#24150E] mt-2">
            Tu cita ha sido guardada
          </h2>
          <p className="text-sm text-[#7C604F] mt-2 max-w-md">
            Hemos guardado tu reserva para <span className="font-semibold text-[#24150E]">{selectedService.title}</span> el día <span className="font-semibold text-[#24150E] capitalize">{formatSelectedDate(selectedDate)}</span> a las <span className="font-semibold text-[#24150E]">{selectedTime} hs</span>.
          </p>

          <div className="mt-8 pt-6 border-t border-[#EAD7BC]/60 w-full flex flex-col gap-3">
            <button
              onClick={onFinish}
              type="button"
              className="w-full py-3.5 rounded-full bg-[#24150E] text-[#FAF7F2] hover:bg-[#C59A45] active:scale-95 transition-all text-xs uppercase tracking-widest font-semibold shadow-md"
            >
              Ir a mis reservas
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Encabezado */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <span className="text-xs uppercase tracking-widest font-semibold text-[#C59A45] font-sans flex items-center gap-1.5 justify-center sm:justify-start">
          <BsStars className="w-3.5 h-3.5" />
          Paso 3 de 3
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#24150E] mt-1 font-normal">
          Selecciona el Horario & Tus Datos
        </h1>
        <p className="text-sm text-[#7C604F] mt-1">
          Escoge la hora que mejor se acomode a tu agenda y completa tus datos de contacto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 pb-32">
        {/* Selección de Horarios */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Turno Mañana */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD7BC]/60 shadow-[0_10px_30px_rgba(36,21,14,0.04)]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EAD7BC]/40 text-sm font-semibold uppercase tracking-wider text-[#523B2D]">
              <FiSun className="w-4 h-4 text-[#C59A45]" />
              <span>Turno Mañana</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MORNING_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      onSelectTime(slot);
                      setErrorMsg('');
                    }}
                    className={`py-3 px-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 border flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#C59A45] text-white border-[#C59A45] shadow-md ring-2 ring-[#C59A45]/20 scale-105'
                        : 'bg-[#FAF7F2] text-[#24150E] border-[#EAD7BC]/60 hover:bg-white hover:border-[#C59A45]'
                    }`}
                  >
                    <FiClock className="w-3.5 h-3.5 opacity-75" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Turno Tarde */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD7BC]/60 shadow-[0_10px_30px_rgba(36,21,14,0.04)]">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EAD7BC]/40 text-sm font-semibold uppercase tracking-wider text-[#523B2D]">
              <FiMoon className="w-4 h-4 text-[#C59A45]" />
              <span>Turno Tarde</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AFTERNOON_SLOTS.map((slot) => {
                const isSelected = selectedTime === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      onSelectTime(slot);
                      setErrorMsg('');
                    }}
                    className={`py-3 px-4 rounded-2xl text-sm font-semibold tracking-wide transition-all duration-200 border flex items-center justify-center gap-2 ${
                      isSelected
                        ? 'bg-[#C59A45] text-white border-[#C59A45] shadow-md ring-2 ring-[#C59A45]/20 scale-105'
                        : 'bg-[#FAF7F2] text-[#24150E] border-[#EAD7BC]/60 hover:bg-white hover:border-[#C59A45]'
                    }`}
                  >
                    <FiClock className="w-3.5 h-3.5 opacity-75" />
                    <span>{slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario de Datos del Cliente */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD7BC]/60 shadow-[0_10px_30px_rgba(36,21,14,0.04)]">
            <h3 className="text-base font-serif font-medium text-[#24150E] mb-4">
              Información de Contacto
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7C604F] mb-1.5">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C604F]/60 w-4 h-4" />
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => onUpdateClientInfo({ clientName: e.target.value })}
                    placeholder="Ej. Valeria Gómez"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAD7BC]/70 focus:outline-none focus:border-[#C59A45] focus:bg-white text-sm text-[#24150E] placeholder:text-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7C604F] mb-1.5">
                  Teléfono / WhatsApp *
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C604F]/60 w-4 h-4" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => onUpdateClientInfo({ clientPhone: e.target.value })}
                    placeholder="Ej. +54 9 11 2345-6789"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAD7BC]/70 focus:outline-none focus:border-[#C59A45] focus:bg-white text-sm text-[#24150E] placeholder:text-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7C604F] mb-1.5">
                  Notas o comentarios especiales
                </label>
                <textarea
                  value={clientNotes}
                  onChange={(e) => onUpdateClientInfo({ clientNotes: e.target.value })}
                  placeholder="Detalles sobre tus uñas, alergias o preferencias..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAD7BC]/70 focus:outline-none focus:border-[#C59A45] focus:bg-white text-sm text-[#24150E] placeholder:text-gray-400 transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Final de Reserva */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAD7BC]/60 shadow-[0_12px_35px_rgba(36,21,14,0.05)] sticky top-24">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#C59A45]">
              Resumen Final
            </span>

            {/* Servicio */}
            <div className="mt-4 flex gap-3.5 items-center p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAD7BC]/40">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                {selectedService.imageUrl ? (
                  <Image
                    src={selectedService.imageUrl}
                    alt={selectedService.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FiImage className="w-6 h-6" aria-label="Servicio sin imagen" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-serif font-medium text-[#24150E] text-sm">
                  {selectedService.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-[#7C604F]">
                  <FiClock className="w-3 h-3 text-[#C59A45]" />
                  <span>{selectedService.duration || '60 min'}</span>
                </div>
              </div>
            </div>

            {/* Fecha y Horario */}
            <div className="mt-4 space-y-2.5">
              <div className="p-3 rounded-2xl bg-[#FAF7F2]/60 border border-[#EAD7BC]/30 flex items-center justify-between text-xs">
                <span className="text-[#7C604F] flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-[#C59A45]" />
                  Fecha:
                </span>
                <span className="font-semibold text-[#24150E] capitalize">
                  {formatSelectedDate(selectedDate)}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7F2]/60 border border-[#EAD7BC]/30 flex items-center justify-between text-xs">
                <span className="text-[#7C604F] flex items-center gap-1.5">
                  <FiClock className="w-3.5 h-3.5 text-[#C59A45]" />
                  Horario:
                </span>
                <span className={`font-semibold ${selectedTime ? 'text-[#24150E]' : 'text-gray-400 italic'}`}>
                  {selectedTime ? `${selectedTime} hs` : 'Sin seleccionar'}
                </span>
              </div>
            </div>

            {errorMsg && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {errorMsg}
              </p>
            )}

            <div className="mt-6 pt-5 border-t border-[#EAD7BC]/50">
              <button
                onClick={handleConfirm}
                type="button"
                className="w-full py-3.5 rounded-full bg-[#24150E] text-[#FAF7F2] hover:bg-[#C59A45] active:scale-95 transition-all text-xs uppercase tracking-widest font-semibold shadow-md flex items-center justify-center gap-2"
              >
                <FiCheck className="w-4 h-4" />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
