'use client';

import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiScissors, FiCalendar, FiUser } from 'react-icons/fi';
import { BookingStep } from '../types';

interface StepNavbarProps {
  currentStep: BookingStep;
  totalSteps?: number;
  onStepChange: (step: BookingStep) => void;
  onBack: () => void;
  canNavigateToStep: (step: BookingStep) => boolean;
  backLabel?: string;
}

const ALL_STEPS = [
  { step: 1 as BookingStep, title: 'Seleccionar Servicio', shortTitle: 'Servicio', icon: FiScissors },
  { step: 2 as BookingStep, title: 'Elegir empleado', shortTitle: 'Empleado', icon: FiUser },
  { step: 3 as BookingStep, title: 'Fecha y Horario', shortTitle: 'Fecha/Hora', icon: FiCalendar },
];

export function StepNavbar({
  currentStep,
  totalSteps = 3,
  onStepChange,
  onBack,
  canNavigateToStep,
  backLabel,
}: StepNavbarProps) {
  const resolvedBackText = backLabel || 'Volver';
  const steps = totalSteps === 2
    ? [
        { step: 1 as BookingStep, title: 'Seleccionar Servicio', shortTitle: 'Servicio', icon: FiScissors },
        { step: 2 as BookingStep, title: 'Fecha y Horario', shortTitle: 'Fecha/Hora', icon: FiCalendar },
      ]
    : ALL_STEPS;

  const progressWidth = totalSteps === 2
    ? (currentStep === 1 ? '0%' : '70%')
    : (currentStep === 1 ? '0%' : currentStep === 2 ? '35%' : '70%');

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAD7BC]/70 px-3 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto h-14 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Botón Volver */}
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 -ml-1 sm:-ml-2 rounded-full text-[#24150E]/80 hover:text-[#24150E] hover:bg-[#EAD7BC]/30 active:scale-95 transition-all text-sm font-medium tracking-wide focus:outline-none cursor-pointer shrink-0"
          title={resolvedBackText}
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[#24150E]" />
          <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider font-semibold hidden sm:inline">
            {resolvedBackText}
          </span>
        </button>

        {/* Línea de pasos interactiva */}
        <nav className="flex-1 max-w-2xl mx-auto flex items-center justify-center min-w-0">
          <ol className="w-full flex items-center justify-between relative">
            {/* Barra de progreso de fondo */}
            <div className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[2px] bg-[#EAD7BC]/60 z-0 pointer-events-none" />

            {/* Barra de progreso activa animada */}
            <motion.div
              className="absolute left-[15%] top-1/2 -translate-y-1/2 h-[2px] bg-[#C59A45] z-0 pointer-events-none origin-left"
              initial={false}
              animate={{
                width: progressWidth,
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />

            {steps.map((s, index) => {
              const displayStepNumber = index + 1;
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
                    className={`group flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-200 focus:outline-none ${
                      isAccessible ? 'cursor-pointer hover:bg-white/70' : 'cursor-not-allowed opacity-60'
                    }`}
                  >
                    {/* Badge del número/icono */}
                    <div
                      className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 shadow-xs ${
                        isCompleted
                          ? 'bg-[#77530a] text-white'
                          : isCurrent
                          ? 'bg-[#C59A45] text-white ring-2 sm:ring-4 ring-[#C59A45]/20 scale-105'
                          : 'bg-[#FAF7F2] border border-[#EAD7BC] text-[#8C7A6B]'
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                      ) : (
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
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
                            : 'text-[#8C7A6B]/70'
                        }`}
                      >
                        {displayStepNumber}. {s.title}
                      </span>
                    </div>

                    {/* Versión móvil corta */}
                    <span
                      className={`md:hidden text-[10px] sm:text-[11px] font-semibold tracking-tight truncate max-w-[65px] sm:max-w-none ${
                        isCurrent ? 'text-[#24150E]' : 'text-[#8C7A6B]'
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
        <div className="hidden sm:flex items-center justify-end w-16">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C7A6B] bg-[#EAD7BC]/40 px-3 py-1 rounded-full border border-[#EAD7BC]/60">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>
    </header>
  );
}
