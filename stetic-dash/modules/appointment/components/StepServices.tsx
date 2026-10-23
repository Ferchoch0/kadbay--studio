'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiClock, FiArrowRight, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';
import { ServiceCategoryKey } from '../types';

interface StepServicesProps {
  services: ServiceItem[];
  loading: boolean;
  error: string | null;
  selectedService: ServiceItem | null;
  onSelectService: (service: ServiceItem) => void;
  onNext: () => void;
}

const CATEGORIES: { key: ServiceCategoryKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'nails', label: 'Manicura' },
  { key: 'eyes', label: 'Mirada' },
  { key: 'spa', label: 'Spa' },
];

export function StepServices({
  services,
  loading,
  error,
  selectedService,
  onSelectService,
  onNext,
}: StepServicesProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryKey>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const getCategoryCount = (key: ServiceCategoryKey) => {
    if (key === 'all') return services.length;
    return services.filter((s) => s.category === key).length;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24">
      <div className="mb-6 sm:mb-8">
        <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] font-sans flex items-center gap-1.5">
          <BsStars className="w-3.5 h-3.5" />
          Paso 1 de 2
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[var(--text-primary)] mt-2 font-normal">
          Selecciona tu Servicio
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
          Elige la experiencia de belleza y cuidado diseñada para realzar tu estilo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-white border border-[var(--accent-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <div ref={scrollContainerRef} className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                const count = getCategoryCount(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]'
                        : 'bg-white text-[var(--text-muted)] border border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-[var(--accent)]/20' : 'bg-[var(--surface-cream)]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-white border border-[var(--accent-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div layout className="space-y-3">
            <AnimatePresence mode="sync">
              {filteredServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                const initial = service.title.charAt(0).toUpperCase();

                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => onSelectService(service)}
                    className={`group relative flex items-center gap-4 p-5 bg-white rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--accent)] shadow-[0_4px_20px_rgba(197,154,69,0.15)]'
                        : 'border-[var(--accent-border)] hover:border-[var(--accent)] hover:shadow-[0_2px_12px_rgba(36,21,14,0.06)]'
                    }`}
                  >
                    <div
                      className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-xl font-serif font-semibold transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white'
                      }`}
                    >
                      {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-serif font-medium transition-colors ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'}`}>
                        {service.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                          <FiClock className="w-4 h-4" />
                          <span>{service.duration || '60 min'}</span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">•</span>
                        <span className="text-sm text-[var(--text-secondary)] capitalize">
                          {service.category === 'nails' ? 'Manicura' : service.category === 'eyes' ? 'Mirada' : 'Spa'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-sm"
                      >
                        <FiCheck className="w-5 h-5 text-white stroke-[3]" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-[var(--accent-border)] p-6 shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
            <h3 className="text-sm uppercase tracking-widest font-semibold text-[var(--accent)] mb-4">
              Tu Selección
            </h3>
            
            {selectedService ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/30">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-medium text-[var(--text-primary)] text-sm">
                      {selectedService.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5 mt-1">
                      <FiClock className="w-3.5 h-3.5" />
                      {selectedService.duration || '60 min'}
                    </p>
                    {selectedService.price !== undefined && selectedService.price !== null && (
                      <p className="text-sm font-semibold text-[var(--accent)] mt-1">${selectedService.price}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={onNext}
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md"
                >
                  <span>Continuar</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-secondary)] text-center py-8">
                Selecciona un servicio para continuar
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
