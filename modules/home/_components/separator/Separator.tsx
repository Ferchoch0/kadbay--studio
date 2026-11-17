'use client';

import { FiInstagram } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Studio from '@/assets/images/studio.jpg';
import { Business, formatInstagramUrl } from '@/services/business.service';

interface SeparatorProps {
  business?: Business | null;
}

export function SeparatorA({ business }: SeparatorProps) {
  const instagramUrl = formatInstagramUrl(business?.instagram);

  return (
    <section className="w-full py-8 sm:py-14 md:py-16 flex items-center justify-center gap-4 sm:gap-12 md:gap-32 lg:gap-48 px-4 sm:px-12 md:px-24 bg-[#cac4b4] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="font-smooth font-bold text-lg sm:text-2xl md:text-3xl tracking-widest text-white text-center sm:text-left">
          Siguenos en{' '}
          <span className="font-script text-xl sm:text-3xl md:text-4xl text-[#77530a] tracking-normal font-normal p-1 sm:p-2">
            Instagram
          </span>{' '}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="flex items-center shrink-0"
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Perfil de Instagram"
          className="p-2 sm:p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors backdrop-blur-sm"
        >
          <FiInstagram className="w-5 h-5 sm:w-8 sm:h-8 text-[#77530a]" />
        </a>
      </motion.div>
    </section>
  );
}

export function SeparatorB() {
  return (
    <section className="w-full flex flex-col md:flex-row items-stretch bg-[#cac4b4] overflow-hidden">
      {/* Mitad Izquierda (Texto y Botón) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full md:w-1/2 flex flex-col px-6 sm:px-12 lg:px-24 py-8 sm:py-12 md:py-16 justify-between gap-6 sm:gap-8 order-2 md:order-1"
      >
        <div className="my-auto space-y-3 sm:space-y-6 flex flex-col items-center text-center">
          <h2 className="font-smooth font-bold text-2xl sm:text-4xl lg:text-5xl tracking-widest text-white leading-tight">
            Conoce nuestra <br />
            <span className="font-script text-3xl sm:text-5xl lg:text-7xl text-[#77530a] tracking-normal font-normal block mt-1">
              experiencia
            </span>
          </h2>

          <p className="font-serif text-sm sm:text-lg text-white/95 leading-relaxed max-w-md">
            Disfruta de un ambiente de lujo sereno. Nuestros tratamientos están diseñados para brindarte tranquilidad mientras resaltamos tu belleza única.
          </p>
        </div>

        <Link
          href="/appointments/new"
          style={{
            '--btn-hover-bg': 'white',
            '--btn-text': 'white',
            '--btn-hover-text': '#77530a',
            '--btn-border': '2px solid white'
          } as React.CSSProperties}
          className="btn-skew-transparent self-center mt-auto px-6 sm:px-12 py-3 sm:py-4 font-smooth font-bold text-base sm:text-2xl tracking-wider rounded-full shadow-lg shrink-0 inline-flex items-center justify-center text-center"
        >
          <span>Hace tu Reserva</span>
        </Link>
      </motion.div>

      {/* Mitad Derecha (Imagen en mobile arriba con altura compacta para no frenar el scroll) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full md:w-1/2 relative h-48 sm:h-72 md:h-auto min-h-[190px] md:min-h-[500px] overflow-hidden order-1 md:order-2"
      >
        <Image 
          src={Studio}
          alt="Studio"
          fill
          className="object-cover blur-xs scale-105 transform"
        />
      </motion.div>
    </section>
  );
}
