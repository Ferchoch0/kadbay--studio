'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiUserPlus } from 'react-icons/fi';
import { getStoredClient } from '@/modules/auth/auth.service';
import { useEffect, useState } from 'react';
import heroBack from '@/assets/images/hero-back.png';
import heroNails from '@/assets/images/hero-nails.png';
import { Business } from '@/services/business.service';

interface HeroProps {
  business?: Business | null;
}

export default function Hero({ business }: HeroProps) {
  const { scrollY } = useScroll();
  const [clientName, setClientName] = useState<string | null>(null);

  useEffect(() => {
    setClientName(getStoredClient()?.name ?? null);
  }, []);

  // Al scrollear la mano se contrae suavemente anclada al piso
  const nailScale = useTransform(scrollY, [0, 500], [1, 0.66]);
  // En mobile el subtítulo se desvanece de inmediato con el scroll
  const mobileTextOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  const heroQuote = business?.footer_text || '“La belleza comienza en el momento en que decides cuidar de ti misma.”';

  return (
    <section
      id="inicio"
      className="relative bg-[#cbc5b9] w-full h-[54vh] sm:h-[64vh] min-[990px]:h-[95vh] min-h-[380px] min-[990px]:min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Imagen de fondo con zoom sutil */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={heroBack}
          alt="Hero Background"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Imagen Nail emergiendo desde abajo y PEGADA AL PISO siempre en mobile y desktop */}
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: nailScale }}
        className="absolute bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none z-20 origin-bottom"
      >
        <Image
          src={heroNails}
          alt="Hero Nails"
          priority
          className="w-auto h-[42vh] sm:h-[50vh] min-[990px]:h-[88vh] max-h-[88vh] max-w-full object-contain object-bottom select-none block"
        />
      </motion.div>

      {/* Subtítulo editorial encima del logo exclusivo para mobile y tablets (< 990px) */}
      <motion.div
        style={{ opacity: mobileTextOpacity }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.85 }}
        className="absolute top-[9.5vh] sm:top-[11vh] inset-x-0 z-25 flex min-[990px]:hidden flex-col items-center justify-center text-center px-4 pointer-events-none space-y-1"
      >
        <span className="font-smooth tracking-[0.26em] uppercase text-[10px] sm:text-xs text-[#FAF7F2] font-semibold">
          {business?.title || 'Estudio de Manicura & Diseño'}
        </span>
        <div className="h-[1px] w-14 bg-gradient-to-r from-transparent via-[#ffd277]/90 to-transparent" />
      </motion.div>

      {/* Contenido lateral completo en desktop (>= 990px): Título, frase y botones devueltos tal como estaban */}
      <div className="absolute inset-0 z-30 hidden min-[990px]:flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex justify-between items-center">
          {/* Bloque Izquierdo: entra desde la izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] sm:w-[300px] min-[990px]:w-[340px] flex flex-col items-start justify-center text-left pointer-events-auto space-y-4"
          >
            <h3 className="text-xl sm:text-2xl min-[990px]:text-3xl font-serif text-[#FAF7F2] font-medium leading-snug drop-shadow-sm">
              {business?.title || 'Manicura y diseños personalizados'}
            </h3>
            <Link
              href="#servicios"
              style={{
                '--btn-hover-bg': '#FAF7F2',
                '--btn-text': '#FAF7F2',
                '--btn-hover-text': '#24150E',
                '--btn-border': '1px solid #FAF7F2'
              } as React.CSSProperties}
              className="btn-skew-transparent inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg active:scale-95"
            >
              <span>Ver servicios</span>
            </Link>
          </motion.div>

          {/* Bloque Derecho: entra desde la derecha */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] sm:w-[300px] min-[990px]:w-[340px] flex flex-col items-end justify-center text-right pointer-events-auto space-y-3"
          >
            <p className="text-base sm:text-lg min-[990px]:text-xl font-serif italic text-[#FAF7F2] leading-relaxed drop-shadow-sm">
              {heroQuote}
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-[#FAF7F2] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#FAF7F2] hover:text-[#24150E]"
            >
              <FiUserPlus className="h-4 w-4" /> {clientName ?? 'Ingresar'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
