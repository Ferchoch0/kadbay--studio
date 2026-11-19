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

/** Detecta si el viewport es desktop (>=990px). Retorna null hasta que el cliente monta. */
function useIsDesktop(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 990);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isDesktop;
}

// ─────────────────────────────────────────────
// DESKTOP >=990px — diseño original intacto
// ─────────────────────────────────────────────
function HeroDesktop({ business, clientName }: { business?: Business | null; clientName: string | null }) {
  const { scrollY } = useScroll();
  const nailScale = useTransform(scrollY, [0, 500], [1, 0.66]);
  const heroQuote = business?.footer_text || '\u201cLa belleza comienza en el momento en que decides cuidar de ti misma.\u201d';

  return (
    <section
      id="inicio"
      className="relative bg-[#cbc5b9] w-full h-[95vh] flex items-center justify-center overflow-hidden"
    >
      {/* Fondo */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full"
      >
        <Image src={heroBack} alt="Hero Background" fill priority className="object-cover" />
      </motion.div>

      {/* Imagen de uñas */}
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

      {/* Contenido lateral */}
      <div className="absolute inset-0 z-35 flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 flex justify-between items-center">
          {/* Izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] sm:w-[300px] md:w-[340px] flex flex-col items-start justify-center text-left pointer-events-auto space-y-4"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#FAF7F2] font-medium leading-snug drop-shadow-sm">
              {business?.title || 'Manicura y diseños personalizados'}
            </h3>
            <Link
              href="#servicios"
              style={{
                '--btn-hover-bg': '#FAF7F2',
                '--btn-text': '#FAF7F2',
                '--btn-hover-text': '#24150E',
                '--btn-border': '1px solid #FAF7F2',
              } as React.CSSProperties}
              className="btn-skew-transparent inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg active:scale-95"
            >
              <span>Ver servicios</span>
            </Link>
          </motion.div>

          {/* Derecha */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.85, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-[260px] sm:w-[300px] md:w-[340px] flex flex-col items-end justify-center text-right pointer-events-auto space-y-3"
          >
            <p className="text-base sm:text-lg md:text-xl font-serif italic text-[#FAF7F2] leading-relaxed drop-shadow-sm">
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

// ─────────────────────────────────────────────
// MOBILE <990px — diseño compacto con fade
// ─────────────────────────────────────────────
function HeroMobile({ business, clientName }: { business?: Business | null; clientName: string | null }) {
  const { scrollY } = useScroll();
  const nailScale = useTransform(scrollY, [0, 500], [1, 0.66]);
  const mobileTextOpacity = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <section
      id="inicio"
      className="relative bg-[#cbc5b9] w-full h-[54vh] sm:h-[64vh] min-h-[380px] flex items-center justify-center overflow-hidden"
    >
      {/* Fondo */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full"
      >
        <Image src={heroBack} alt="Hero Background" fill priority className="object-cover" />
      </motion.div>

      {/* Imagen de uñas pegada al piso */}
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
          className="w-auto h-[42vh] sm:h-[50vh] max-h-[88vh] max-w-full object-contain object-bottom select-none block"
        />
      </motion.div>

      {/* Subtítulo que desaparece al scrollear */}
      <motion.div
        style={{ opacity: mobileTextOpacity }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.85 }}
        className="absolute top-[9.5vh] sm:top-[11vh] inset-x-0 z-25 flex flex-col items-center justify-center text-center px-4 pointer-events-none space-y-1"
      >
        <span className="font-smooth tracking-[0.26em] uppercase text-[10px] sm:text-xs text-[#FAF7F2] font-semibold">
          {business?.title || 'Estudio de Manicura & Diseño'}
        </span>
        <div className="h-[1px] w-14 bg-gradient-to-r from-transparent via-[#ffd277]/90 to-transparent" />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────
// ENTRY POINT — elige componente según viewport
// ─────────────────────────────────────────────
export default function Hero({ business }: HeroProps) {
  const [clientName, setClientName] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  useEffect(() => {
    setClientName(getStoredClient()?.name ?? null);
  }, []);

  // Mientras detecta el tamaño de pantalla, muestra solo el fondo
  if (isDesktop === null) {
    return (
      <section id="inicio" className="relative bg-[#cbc5b9] w-full h-[95vh] overflow-hidden">
        <Image src={heroBack} alt="Hero Background" fill priority className="object-cover" />
      </section>
    );
  }

  return isDesktop
    ? <HeroDesktop business={business} clientName={clientName} />
    : <HeroMobile business={business} clientName={clientName} />;
}
