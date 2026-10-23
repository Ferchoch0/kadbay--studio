'use client';

import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiScissors, FiCalendar, FiUser } from 'react-icons/fi';
import { BookingStep } from '../types';

interface StepNavbarProps {
  currentStep: BookingStep;
  onStepChange: (step: BookingStep) => void;
  onBack: () => void;
  canNavigateToStep: (step: BookingStep) => boolean;
}

const STEPS = [
  { step: 1 as BookingStep, title: 'Seleccionar Servicio', shortTitle: 'Servicio', icon: FiScissors },
  { step: 2 as BookingStep, title: 'Elegir empleado', shortTitle: 'Empleado', icon: FiUser },
  { step: 3 as BookingStep, title: 'Fecha y Horario', shortTitle: 'Fecha/Hora', icon: FiCalendar },
];

export function StepNavbar({
  currentStep,
  onStepChange,
  onBack,
  canNavigateToStep,
}: StepNavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAD7BC]/70 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-2 -ml-2 rounded-full text-[#24150E]/80 hover:text-[#24150E] hover:bg-[#EAD7BC]/30 active:scale-95 transition-all text-sm font-medium tracking-wide focus:outline-none"
          title={currentStep > 1 ? 'Paso anterior' : 'Cerrar y volver'}
        >
          <FiArrowLeft className="w-5 h-5 shrink-0 text-[#24150E]" />
          <span className="hidden sm:inline font-sans text-xs uppercase tracking-wider font-semibold">
            {currentStep > 1 ? 'Volver' : 'Cerrar'}
          </span>
        </button>

        {/* Línea de pasos interactiva */}
        <nav className="flex-1 max-w-2xl mx-auto flex items-center justify-center">
          <ol className="w-full flex items-center justify-between relative">
            {/* Barra de progreso de fondo */}
            <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[2px] bg-[#EAD7BC]/60 z-0 pointer-events-none" />

            {/* Barra de progreso activa animada */}
            <motion.div
              className="absolute left-[15%] top-1/2 -translate-y-1/2 h-[2px] bg-[#C59A45] z-0 pointer-events-none origin-left"
              initial={false}
              animate={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '35%' : '70%',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />

            {STEPS.map((s) => {
              const isCurrent = currentStep === s.step;
              const isCompleted = currentStep > s.step;
              const isAccessible = canNavigateToStep(s.step);
              const Icon = s.icon;

              return (
                <li key={s.step} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    disabled={!isAccessible}
                    onClick={() => isAccessible && onStepChange(s.step)}
                    className={`group flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full transition-all duration-200 focus:outline-none ${
                      isAccessible ? 'cursor-pointer hover:bg-white/70' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    {/* Badge del número/icono */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shadow-xs ${
                        isCompleted
                          ? 'bg-[#24150E] text-[#FAF7F2]'
                          : isCurrent
                          ? 'bg-[#C59A45] text-white ring-4 ring-[#C59A45]/20 scale-105'
                          : 'bg-[#FAF7F2] border border-[#EAD7BC] text-[#7C604F]'
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </div>

                    {/* Texto del paso */}
                    <div className="hidden md:flex flex-col text-left">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                          isCurrent
                            ? 'text-[#24150E]'
                            : isCompleted
                            ? 'text-[#523B2D]'
                            : 'text-[#7C604F]/70'
                        }`}
                      >
                        {s.step}. {s.title}
                      </span>
                    </div>

                    {/* Versión móvil corta */}
                    <span
                      className={`md:hidden text-[11px] font-semibold tracking-tight ${
                        isCurrent ? 'text-[#24150E]' : 'text-[#7C604F]/80'
                      }`}
                    >
                      {s.shortTitle}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Indicador de paso actual */}
        <div className="hidden sm:flex items-center">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#7C604F] bg-[#EAD7BC]/40 px-3 py-1 rounded-full border border-[#EAD7BC]/60">
            Paso {currentStep} de 3
          </span>
        </div>
      </div>
    </header>
  );
}
