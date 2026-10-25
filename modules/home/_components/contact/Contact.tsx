'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiInstagram, FiPhone, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { BsDiamondFill } from 'react-icons/bs';
import ContactTitle from '@/assets/images/contact-title.png';

export default function Contact() {
  return (
    <section id="contacto" className="py-24 lg:py-32 bg-[#F4ECE4] w-full overflow-hidden">
      <div className="w-full space-y-14">

        {/* ── Cabecera (mismo esquema que Servicios) ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3"
        >
          <div className='flex justify-center'>
            <Image
              src={ContactTitle}
              alt="Contacto"
              className="w-[500px] object-contain"
            />
          </div>

          {/* Separador dorado */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div
              className="h-[1.5px] w-16 sm:w-28"
              style={{ background: 'linear-gradient(to right, transparent, #77530a, #ffd277, #77530a)' }}
            />
            <BsDiamondFill className="w-2.5 h-2.5 text-[#845f15] drop-shadow-[0_0_4px_rgba(255,210,119,0.8)]" />
            <div
              className="h-[1.5px] w-16 sm:w-28"
              style={{ background: 'linear-gradient(to left, transparent, #77530a, #ffd277, #77530a)' }}
            />
          </div>

          <p className="text-base sm:text-lg text-[#523B2D] font-serif tracking-wide max-w-xl mx-auto pt-1">
            Reservá tu turno y viví una experiencia de{' '}
            <span className="font-script text-2xl sm:text-3xl text-[#77530a] tracking-normal font-normal p-2">
              lujo sereno
            </span>
          </p>
        </motion.div>

        {/* ── Cuerpo: Info + Mapa ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">

          {/* Columna Izquierda: Información */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col justify-between space-y-10"
          >

            {/* Bloque: Ubicación */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <FiMapPin className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Donde nos encontrás
                </span>
              </div>
              <p className="font-serif text-lg text-[#523B2D] pl-8 leading-relaxed">
                Cajaravilla 4324
              </p>
            </div>

            {/* Línea separadora */}
            <div
              className="h-[1px] w-full"
              style={{ background: 'linear-gradient(to right, #77530a33, #ffd27766, transparent)' }}
            />

            {/* Bloque: Contacto */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <FiPhone className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Contacto
                </span>
              </div>
              <p className="font-serif text-lg text-[#523B2D] pl-8">
                Teléfono:{' '}
                <a
                  href="tel:1134233686"
                  className="text-[#77530a] hover:text-[#C59A45] transition-colors"
                >
                  1134233686
                </a>
              </p>
            </div>

            {/* Línea separadora */}
            <div
              className="h-[1px] w-full"
              style={{ background: 'linear-gradient(to right, #77530a33, #ffd27766, transparent)' }}
            />

            {/* Bloque: Horarios */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <FiClock className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Horarios
                </span>
              </div>
              <div className="font-serif text-base text-[#523B2D] pl-8 space-y-1.5 leading-relaxed">
                <p><span className="text-[#24150E] font-medium">Lunes</span> / 12 a 19hs</p>
                <p><span className="text-[#24150E] font-medium">Martes a Sábados</span> / 9 a 19hs</p>
                <p>
                  <span className="text-[#24150E] font-medium">Domingos</span>{' '}
                  <span className="font-script text-xl text-[#77530a]">Cerrado</span>
                </p>
              </div>
            </div>

            {/* Línea separadora */}
            <div
              className="h-[1px] w-full"
              style={{ background: 'linear-gradient(to right, #77530a33, #ffd27766, transparent)' }}
            />

            {/* Bloque: Redes */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <FiInstagram className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Seguinos en redes
                </span>
              </div>
              <div>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    '--btn-hover-bg': '#E1306C',
                    '--btn-text': '#24150E',
                    '--btn-hover-text': 'white',
                    '--btn-border': '2px solid #24150E'
                  } as React.CSSProperties}
                  className="btn-skew-transparent ml-8 inline-flex items-center gap-2.5 px-7 py-3 font-smooth font-semibold text-lg tracking-wide rounded-full shadow-sm"
                >
                  <FiArrowRight className="w-5 h-5 shrink-0" />
                </a>
              </div>
            </div>

          </motion.div>

          {/* Columna Derecha: Mapa */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="w-full h-[420px] lg:h-full min-h-[380px] rounded-sm overflow-hidden shadow-lg border border-[#EAD7BC]/50"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3283.748!2d-58.4537!3d-34.5874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM1JzE0LjYiUyA1OMKwMjcnMTMuMyJX!5e0!3m2!1ses!2sar!4v1680000000000!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'sepia(20%) saturate(80%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Kad Bay Studio"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
