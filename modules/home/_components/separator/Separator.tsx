'use client';

import { FiInstagram } from 'react-icons/fi';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Studio from '@/assets/images/studio.jpg';

export function SeparatorA() {
  return (
    <section className="w-full py-16 flex items-center justify-center gap-150 px-20 sm:px-22 md:px-24 lg:px-32 bg-[#cac4b4] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="font-smooth font-bold text-3xl tracking-widest text-white">Siguenos en {' '}
            <span className="font-script text-4xl sm:text-4xl text-[#77530a] tracking-normal font-normal p-2">
              Instagram
            </span>{' '}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "backOut" }}
        className="flex items-center"
      >
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/20 rounded-full hover:bg-white/40 transition-colors backdrop-blur-sm">
          <FiInstagram className="w-8 h-8 text-[#77530a]" />
        </a>
      </motion.div>
      
    </section>
  );
}

export function SeparatorB() {
  return (
    <section className="w-full h-[600px] flex items-stretch bg-[#cac4b4] overflow-hidden">
      {/* Mitad Izquierda (Texto y Botón) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-1/2 flex flex-col px-16 lg:px-24 py-16"
      >
        <div className="my-auto space-y-6 flex flex-col items-center text-center">
          <h1 className="font-smooth font-bold text-4xl lg:text-5xl tracking-widest text-white leading-tight">
            Conoce nuestra <br />
            <span className="font-script text-5xl lg:text-7xl text-[#77530a] tracking-normal font-normal block mt-1">
              experiencia
            </span>
          </h1>

          <p className="font-serif text-lg text-white/95 leading-relaxed max-w-md">
            Disfruta de un ambiente de lujo sereno. Nuestros tratamientos están diseñados para brindarte tranquilidad mientras resaltamos tu belleza única.
          </p>
        </div>

        <button 
          style={{
            '--btn-hover-bg': 'white',
            '--btn-text': 'white',
            '--btn-hover-text': '#77530a',
            '--btn-border': '2px solid white'
          } as React.CSSProperties}
          className="btn-skew-transparent self-center mt-auto px-12 py-4 font-smooth font-bold text-2xl tracking-wider rounded-full shadow-lg shrink-0"
        >
          <span>Hace tu Reserva</span>
        </button>
      </motion.div>

      {/* Mitad Derecha (Imagen 50% de ancho, 100% de alto) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-1/2 relative overflow-hidden"
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
