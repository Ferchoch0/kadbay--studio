'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCheck,
  FiClock,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiInfo,
  FiX,
  FiMapPin,
  FiExternalLink,
  FiPhone,
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { ServiceItem } from '@/data/services.mock';
import { ServiceCategoryKey } from '../types';
import { businessService, Business, getFullImageUrl } from '@/services/business.service';

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

function formatTimeOnly(timeStr?: string | null): string {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  return `${parts[0]}:${parts[1] || '00'}`;
}

export function StepServices({
  services,
  loading,
  error,
  selectedService,
  onSelectService,
  onNext,
}: StepServicesProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategoryKey>('all');
  const [business, setBusiness] = useState<Business | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    businessService
      .getBySlug(process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay')
      .then((b) => b && setBusiness(b))
      .catch(() => {});
  }, []);

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

  // Horario del negocio
  const openTimeStr = business?.schedule_open || '09:00:00';
  const closeTimeStr = business?.schedule_close || '20:00:00';
  const formattedOpen = formatTimeOnly(openTimeStr);
  const formattedClose = formatTimeOnly(closeTimeStr);

  const [scheduleStatus, setScheduleStatus] = useState({
    isOpen: true,
    statusLabel: 'Horario habitual',
    subText: `Cierra a las ${formattedClose} hs`,
    rangeText: `${formattedOpen} - ${formattedClose} hs`,
  });

  useEffect(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openH, openM] = openTimeStr.split(':').map(Number);
    const [closeH, closeM] = closeTimeStr.split(':').map(Number);
    const openMinutes = (openH || 9) * 60 + (openM || 0);
    const closeMinutes = (closeH || 20) * 60 + (closeM || 0);

    const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;

    setScheduleStatus({
      isOpen,
      statusLabel: isOpen ? 'Abierto ahora' : 'Cerrado en este momento',
      subText: isOpen ? `Cierra a las ${formattedClose} hs` : `Abre a las ${formattedOpen} hs`,
      rangeText: `${formattedOpen} - ${formattedClose} hs`,
    });
  }, [openTimeStr, closeTimeStr, formattedOpen, formattedClose]);

  const mapsUrl = business?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
    : null;

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-36 lg:pb-24">
      {/* Encabezado del Paso + Botón Horarios e Info móvil */}
      <div className="mb-5 sm:mb-8">
        <div className="flex items-center justify-between gap-3 mb-1.5 flex-wrap">
          <span className="text-xs uppercase tracking-widest font-semibold text-[var(--accent)] font-sans flex items-center gap-1.5">
            <BsStars className="w-3.5 h-3.5" />
            Paso 1 de 2
          </span>

          {/* Botón informativo exclusivo para móviles y tablets (< lg) */}
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[var(--accent-border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95 transition-all text-xs font-medium shadow-xs cursor-pointer"
            aria-label="Ver horarios e información del estudio"
          >
            <FiInfo className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="font-semibold text-xs">Horarios & Info</span>
            <span
              className={`w-2 h-2 rounded-full ${
                scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[var(--text-primary)] mt-1 font-normal">
          Selecciona tu Servicio
        </h1>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] mt-1.5">
          Elige la experiencia de belleza y cuidado diseñada para realzar tu estilo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="relative flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-white border border-[var(--accent-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer"
              aria-label="Desplazar categorías a la izquierda"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <div ref={scrollContainerRef} className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth pb-1" style={{ scrollbarWidth: 'none' }}>
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.key;
                const count = getCategoryCount(cat.key);
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)] font-semibold shadow-xs'
                        : 'bg-white text-[var(--text-muted)] border border-[var(--accent-border)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-semibold ${isActive ? 'bg-[var(--accent)]/20' : 'bg-[var(--surface-cream)]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              className="hidden sm:flex shrink-0 w-9 h-9 items-center justify-center rounded-xl bg-white border border-[var(--accent-border)] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all cursor-pointer"
              aria-label="Desplazar categorías a la derecha"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <motion.div layout className="space-y-2.5 sm:space-y-3">
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
                    className={`group relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--accent)] shadow-[0_4px_20px_rgba(197,154,69,0.15)] bg-[var(--accent-soft)]/20'
                        : 'border-[var(--accent-border)] hover:border-[var(--accent)] hover:shadow-xs'
                    }`}
                  >
                    <div
                      className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-xl font-serif font-semibold transition-all ${
                        isSelected
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white'
                      }`}
                    >
                      {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-base sm:text-lg font-serif font-medium truncate transition-colors ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-primary)] group-hover:text-[var(--accent)]'}`}>
                          {service.title}
                        </h3>
                        {service.price !== undefined && service.price !== null && (
                          <span className="text-sm sm:text-base font-serif font-bold text-[var(--accent)] shrink-0">
                            ${service.price}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                          <FiClock className="w-3.5 h-3.5" />
                          <span>{service.duration || '60 min'}</span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)]">•</span>
                        <span className="text-xs sm:text-sm text-[var(--text-secondary)] capitalize truncate">
                          {service.category === 'nails' ? 'Manicura' : service.category === 'eyes' ? 'Mirada' : 'Spa'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-xs"
                      >
                        <FiCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[3]" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Columna Derecha Desktop: Oculta en Mobile/Tablet */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="sticky top-24 space-y-5">
            <div className="bg-white rounded-2xl border border-[var(--accent-border)] p-6 shadow-[0_4px_16px_rgba(36,21,14,0.04)]">
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
                      <p className="font-serif font-medium text-[var(--text-primary)] text-sm truncate">
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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer"
                  >
                    <span className="max-[360px]:hidden">Continuar</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)] text-center py-8">
                  Selecciona un servicio para continuar
                </p>
              )}
            </div>

            {/* Tarjeta de Información del Negocio */}
            <div className="bg-white rounded-2xl border border-[var(--accent-border)] p-6 shadow-[0_4px_16px_rgba(36,21,14,0.04)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--accent-border)]/60">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[var(--text-primary)]">
                  Estudio & Horarios
                </h4>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    scheduleStatus.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  {scheduleStatus.statusLabel}
                </span>
              </div>

              {/* Franja horaria */}
              <div className="flex items-start gap-3 text-sm">
                <FiClock className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-medium text-[var(--text-primary)]">
                    {business?.schedule_days || 'Lunes a Sábado'}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {scheduleStatus.rangeText} · {scheduleStatus.subText}
                  </p>
                </div>
              </div>

              {/* Dirección */}
              {business?.address && (
                <div className="flex items-start gap-3 text-sm pt-2 border-t border-[var(--accent-border)]/40">
                  <FiMapPin className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Ubicación</p>
                    <p className="font-normal text-[var(--text-primary)] text-xs sm:text-sm">
                      {business.address}
                    </p>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline pt-0.5 font-medium"
                      >
                        Ver en Google Maps
                        <FiExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Contacto telefónico */}
              {business?.phone && (
                <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--accent-border)]/40">
                  <FiPhone className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <a href={`tel:${business.phone}`} className="hover:underline">
                    {business.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Barra Fija Inferior en Mobile & Tablet (< lg) cuando hay un servicio seleccionado */}
      <AnimatePresence>
        {selectedService && (
          <motion.aside
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            aria-label="Resumen de servicio seleccionado"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[var(--accent-border)] shadow-[0_-8px_24px_rgba(36,21,14,0.12)] px-4 py-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 shadow-xs font-serif font-bold text-lg">
                  {selectedService.title.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif font-medium text-[var(--text-primary)] text-sm truncate">
                    {selectedService.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-3 h-3 text-[var(--accent)]" />
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

              <button
                onClick={onNext}
                type="button"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 min-[361px]:px-5 py-2.5 rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:scale-95 transition-all text-sm font-semibold shadow-md cursor-pointer"
              >
                <span className="max-[360px]:hidden">Continuar</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Modal / Bottom Sheet de Estudio & Horarios para Mobile & Tablet */}
      <AnimatePresence>
        {showInfoModal && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-[var(--accent-border)] max-h-[85vh] overflow-y-auto"
            >
              {/* Indicador de arrastre en móvil */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between pb-3 border-b border-[var(--accent-border)]/60">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-medium text-[var(--text-primary)]">
                    Estudio & Horarios
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-colors cursor-pointer"
                  aria-label="Cerrar ventana de información"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 pt-4">
                {/* Estado Abierto/Cerrado */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20">
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Estado actual</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      scheduleStatus.isOpen
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`}
                    />
                    {scheduleStatus.statusLabel}
                  </span>
                </div>

                {/* Franja horaria */}
                <div className="flex items-start gap-3 text-sm p-3 rounded-xl bg-white border border-[var(--accent-border)]/60">
                  <FiClock className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-[var(--text-primary)]">
                      {business?.schedule_days || 'Lunes a Sábado'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {scheduleStatus.rangeText} · {scheduleStatus.subText}
                    </p>
                  </div>
                </div>

                {/* Dirección */}
                {business?.address && (
                  <div className="flex items-start gap-3 text-sm p-3 rounded-xl bg-white border border-[var(--accent-border)]/60">
                    <FiMapPin className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs text-[var(--text-secondary)] font-medium">Ubicación</p>
                      <p className="font-normal text-[var(--text-primary)] text-xs sm:text-sm">
                        {business.address}
                      </p>
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline pt-1 font-semibold"
                        >
                          Ver en Google Maps
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Contacto telefónico */}
                {business?.phone && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[var(--accent-border)]/60">
                    <div className="flex items-center gap-3 text-sm">
                      <FiPhone className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="font-medium text-[var(--text-primary)] text-xs sm:text-sm">{business.phone}</span>
                    </div>
                    <a
                      href={`tel:${business.phone}`}
                      className="px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-semibold hover:bg-[var(--accent)] hover:text-white transition-colors"
                    >
                      Llamar
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="w-full mt-2 py-3 rounded-full bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
