'use client';

import { useState, useEffect, useRef } from 'react';
import { useServices } from '@/hooks/useServices';
import { ServiceItem } from '@/data/services.mock';
import { BsDiamondFill } from 'react-icons/bs';
import { GiFingernail, GiLotus } from 'react-icons/gi';
import { FaRegEye } from 'react-icons/fa6';
import { FiImage } from 'react-icons/fi';

import { motion } from 'framer-motion';
import Image from 'next/image';
import serviciosTitle from '@/assets/images/servicios-title.png';

/**
 * Renderiza el icono correspondiente a la categoría del servicio
 */
function ServiceIcon({ type }: { type: ServiceItem['iconType'] }) {
  const iconClass = 'w-4 h-4 text-[#77530a] shrink-0';

  switch (type) {
    case 'nail':
      return <GiFingernail className={iconClass} title="Manicura" />;
    case 'eye':
      return <FaRegEye className={iconClass} title="Mirada y Cejas" />;
    case 'spa':
      return <GiLotus className={iconClass} title="Spa y Bienestar" />;
    default:
      return <GiFingernail className={iconClass} />;
  }
}

export default function OurServices() {
  const { services, loading, error } = useServices();

  // Referencias para el movimiento de apretar y arrastrar (drag-to-scroll)
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Eventos de arrastre con mouse (MouseDown / MouseMove / MouseUp)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDownRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDownRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasDraggedRef.current = true;
    }
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
  };

  return (
    <section id="servicios" className="py-24 lg:py-32 bg-[#f9f4ee] w-full overflow-hidden max-h-[100vh]">
      <div className="w-full space-y-12">
        {/* Cabecera con Título en Mayúsculas y Palabras Clave en Cursiva */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3"
        >
          <div className='flex justify-center'>
            <Image
              src={serviciosTitle}
              alt="Nuestros Servicios"
              className="w-[800px] object-contain invert-[0.9]"
            />
          </div>

          {/* Separador de Oro Premium Metálico con Diamante */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div
              className="h-[1.5px] w-16 sm:w-28"
              style={{
                background:
                  'linear-gradient(to right, transparent, #77530a, #ffd277, #77530a)',
              }}
            />
            <BsDiamondFill className="w-2.5 h-2.5 text-[#845f15] drop-shadow-[0_0_4px_rgba(255,210,119,0.8)]" />
            <div
              className="h-[1.5px] w-16 sm:w-28"
              style={{
                background:
                  'linear-gradient(to left, transparent, #77530a, #ffd277, #77530a)',
              }}
            />
          </div>

          <p className="text-base sm:text-lg text-[#523B2D] font-serif tracking-wide max-w-xl mx-auto pt-1">
            El arte de la{' '}
            <span className="font-script text-2xl sm:text-3xl text-[#77530a] tracking-normal font-normal p-2">
              precisión
            </span>{' '}
            y el cuidado{' '}
            <span className="font-script text-2xl sm:text-3xl text-[#77530a] tracking-normal font-normal p-2">
              consciente
            </span>
          </p>
        </motion.div>

        {/* Galería Deslizable a lo ancho de toda la pantalla (Full-Width Edge-to-Edge) */}
        <div className="relative w-full">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="flex gap-8 sm:gap-10 overflow-x-auto scrollbar-none py-6 px-6 sm:px-12 md:px-16 lg:px-24 cursor-grab active:cursor-grabbing select-none scroll-smooth touch-pan-x w-full"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {loading ? (
              <div className="flex gap-8 sm:gap-10 w-full px-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div
                    key={n}
                    className="shrink-0 w-[320px] h-[480px] rounded-none p-[2.5px] animate-pulse"
                    style={{
                      background:
                        'linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a)',
                    }}
                  >
                    <div className="bg-[#FAF7F2] h-full w-full rounded-none" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="w-full text-center font-serif text-[#523B2D] px-6">
                No pudimos cargar los servicios en este momento. Intentá de nuevo más tarde.
              </p>
            ) : (
              services.map((service, index) => (
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  key={service.id}
                  data-service-card
                  className="shrink-0 w-[320px] rounded-none p-[2.5px] shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{
                    background:
                      'linear-gradient(to right, #77530a, #ffd277, #77530a, #77530a, #ffd277, #77530a)',
                  }}
                >
                  {/* Paspartú interior de galería de arte */}
                  <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-none flex flex-col items-center h-full">
                    {/* Lienzo del cuadro alargado (imagen contenida sin escalado) */}
                    <div className="w-full aspect-[3/4] p-1.5 bg-[#F3EDE4] border border-[#C59A45]/30 rounded-none shadow-inner overflow-hidden flex items-center justify-center">
                      <div className="w-full h-full overflow-hidden relative">
                        {service.imageUrl ? (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            loading="lazy"
                            draggable={false}
                            className="w-full h-full object-cover rounded-none pointer-events-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#F3EDE4] text-[#77530a]">
                            <FiImage className="w-12 h-12" aria-label="Servicio sin imagen" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Placa inferior del cuadro: Icono + Título */}
                    <div className="pt-4 pb-1 w-full flex flex-col items-center text-center space-y-1.5">
                      <div className="flex items-center justify-center gap-2">
                        <ServiceIcon type={service.iconType} />
                        <span className="font-script text-base text-[#77530a] tracking-wide">
                          Kad Bay
                        </span>
                      </div>
                      <h3 className="font-serif text-sm sm:text-base text-[#24150E] tracking-wider uppercase font-medium leading-snug">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
