'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiArrowRight } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import type { Employee } from '@/services/appointment.service';

interface Props {
  employees: Employee[];
  selectedEmployee: Employee | null;
  onSelect: (employee: Employee) => void;
  onNext: () => void;
}

export function StepEmployee({ employees, selectedEmployee, onSelect, onNext }: Props) {
  const loading = employees.length === 0;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 pb-32 sm:pb-16">
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold flex items-center justify-center gap-1.5">
          <BsStars className="w-3.5 h-3.5" />
          Paso 2
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif mt-2 text-[var(--text-primary)]">Elegir profesional</h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5">Selecciona quién realizará tu servicio.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border-2 border-[var(--accent-border)]/50 bg-white animate-pulse">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-border)]/40 mb-3" />
              <div className="h-5 w-28 rounded-lg bg-[var(--accent-border)]/50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {employees.map((employee) => {
            const isSelected = selectedEmployee?.id === employee.id;
            return (
              <button
                key={employee.id}
                type="button"
                onClick={() => onSelect(employee)}
                className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center sm:flex-col sm:items-start gap-3.5 sm:gap-0 ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-md'
                    : 'border-[var(--accent-border)] bg-white hover:border-[var(--accent)] hover:shadow-xs'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center sm:mb-3 shrink-0 ${
                    isSelected ? 'bg-[var(--accent)] text-white' : 'bg-[var(--accent-soft)] text-[var(--accent)]'
                  }`}
                >
                  <FiUser className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-serif text-base sm:text-lg block truncate text-[var(--text-primary)]">
                    {employee.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] block mt-0.5">Especialista</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Botón clásico para desktop */}
      <button
        type="button"
        disabled={!selectedEmployee}
        onClick={onNext}
        className="hidden lg:block mt-8 w-full py-3.5 rounded-full bg-[var(--accent)] text-white font-medium disabled:opacity-50 cursor-pointer hover:bg-[var(--accent-hover)] transition-colors shadow-md text-sm"
      >
        Continuar
      </button>

      {/* Barra fija inferior en Mobile (< lg) */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.aside
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            aria-label="Confirmar profesional"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--accent-border)] shadow-[0_-8px_24px_rgba(36,21,14,0.12)] px-4 py-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0 border border-[var(--accent)]/20 shadow-xs">
                  <FiUser className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                    Profesional
                  </p>
                  <p className="font-serif font-medium text-sm text-[var(--text-primary)] truncate">
                    {selectedEmployee.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onNext}
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 min-[361px]:px-5 py-2.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer"
              >
                <span className="max-[360px]:hidden">Continuar</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
