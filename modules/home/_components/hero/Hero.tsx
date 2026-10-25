'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiUserPlus } from 'react-icons/fi';
import { getStoredClient } from '@/modules/auth/auth.service';
import { useEffect, useState } from 'react';
import heroBack from '@/assets/images/hero-back.png';
import heroNails from '@/assets/images/hero-nails.png';

export default function Hero() {
  const { scrollY } = useScroll();
  const [clientName, setClientName] = useState<string | null>(null);

  useEffect(() => {
    setClientName(getStoredClient()?.name ?? null);
  }, []);
  // Al scrollear se contrae suavemente hacia 0.86
  const nailScale = useTransform(scrollY, [0, 500], [1, 0.66]);

  return (
    <section
      id="inicio"
      className="relative bg-[#cbc5b9] w-full h-[95vh] flex items-center justify-center overflow-hidden"
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

      {/* Imagen Nail emergiendo desde abajo y achicándose al scrollear */}
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ scale: nailScale }}
        className="absolute inset-0 flex justify-center items-end pointer-events-none z-30 origin-bottom"
      >
        <Image
          src={heroNails}
          alt="Hero Nails"
          priority
          className="w-[87%] h-[87%] max-w-3xl max-h-[88vh] object-contain select-none"
        />
      </motion.div>

      {/* Contenido lateral entrando desde los lados una vez llega la mano */}
      <div className="absolute inset-0 z-35 flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex justify-between items-center">
          {/* Bloque Izquierdo: entra desde la izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] sm:w-[300px] md:w-[340px] flex flex-col items-start justify-center text-left pointer-events-auto space-y-4"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#FAF7F2] font-medium leading-snug drop-shadow-sm">
              Manicura y diseños personalizados
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
            className="w-[260px] sm:w-[300px] md:w-[340px] flex flex-col items-end justify-center text-right pointer-events-auto space-y-3"
          >
            <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#FAF7F2] leading-relaxed drop-shadow-sm">
              “La belleza comienza en el momento en que decides cuidar de ti misma.”
            </p>
            <Link href="/auth" className="inline-flex items-center gap-2 rounded-full border border-[#FAF7F2] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] transition-colors hover:bg-[#FAF7F2] hover:text-[#24150E]">
              <FiUserPlus className="h-4 w-4" /> {clientName ?? 'Ingresar'}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
