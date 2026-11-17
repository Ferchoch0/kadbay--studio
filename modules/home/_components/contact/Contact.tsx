'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiInstagram, FiPhone, FiMapPin, FiClock, FiArrowRight, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { BsDiamondFill } from 'react-icons/bs';
import ContactTitle from '@/assets/images/contact-title.png';
import { Business, formatInstagramUrl, formatScheduleDays } from '@/services/business.service';

interface ContactProps {
  business: Business | null;
}

export default function Contact({ business }: ContactProps) {
  const address = business?.address || 'Av. Santa Fe 1845, CABA';
  const instagramUrl = formatInstagramUrl(business?.instagram);
  const cleanWa = business?.whatsapp ? business.whatsapp.replace(/[^0-9]/g, '') : '';
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section id="contacto" className="py-10 sm:py-20 lg:py-28 bg-[#F4ECE4] w-full overflow-hidden">
      <div className="w-full space-y-8 sm:space-y-12">

        {/* ── Cabecera ── */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 sm:space-y-3"
        >
          <div className='flex justify-center'>
            <Image
              src={ContactTitle}
              alt="Contacto"
              className="w-full max-w-[75vw] sm:max-w-[450px] lg:max-w-[500px] object-contain"
            />
          </div>

          {/* Separador dorado */}
          <div className="flex items-center justify-center gap-3 pt-0.5 sm:pt-1">
            <div
              className="h-[1.5px] w-12 sm:w-28"
              style={{ background: 'linear-gradient(to right, transparent, #77530a, #ffd277, #77530a)' }}
            />
            <BsDiamondFill className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#845f15] drop-shadow-[0_0_4px_rgba(255,210,119,0.8)]" />
            <div
              className="h-[1.5px] w-12 sm:w-28"
              style={{ background: 'linear-gradient(to left, transparent, #77530a, #ffd277, #77530a)' }}
            />
          </div>

          <p className="text-xs sm:text-lg text-[#523B2D] font-serif tracking-wide max-w-xl mx-auto pt-0.5 sm:pt-1 px-4">
            Reservá tu turno y viví una experiencia de{' '}
            <span className="font-script text-lg sm:text-3xl text-[#77530a] tracking-normal font-normal p-1 sm:p-2">
              lujo sereno
            </span>
          </p>
        </motion.div>

        {/* ── Mobile Layout (Rework visual de lujo con tarjetas táctiles) ── */}
        <div className="block lg:hidden max-w-xl mx-auto px-4 space-y-3.5">
          {/* Card 1: Ubicación & Mapa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#EAD7BC]/40 flex items-center justify-center text-[#77530a]">
                  <FiMapPin className="w-3.5 h-3.5" />
                </div>
                <span className="font-smooth font-bold text-xs tracking-[0.2em] uppercase text-[#77530a]">
                  Ubicación
                </span>
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-smooth font-semibold uppercase tracking-wider text-[#77530a] hover:text-[#24150E] flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span>Abrir en Maps</span>
                <FiArrowRight className="w-3 h-3" />
              </a>
            </div>

            <p className="font-serif text-sm sm:text-base text-[#24150E] font-medium leading-snug">
              {address}
            </p>

            {/* Mapa de preview contenido */}
            <div className="w-full h-36 rounded-xl overflow-hidden relative border border-[#EAD7BC]/60 shadow-inner">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'sepia(20%) saturate(80%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa ${business?.name || 'Kad Bay Studio'}`}
              />
            </div>
          </motion.div>

          {/* Card 2: Contacto Rápido e Interactivo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-4 sm:p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EAD7BC]/40 flex items-center justify-center text-[#77530a]">
                <FiPhone className="w-3.5 h-3.5" />
              </div>
              <span className="font-smooth font-bold text-xs tracking-[0.2em] uppercase text-[#77530a]">
                Atención Directa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {cleanWa && (
                <a
                  href={`https://wa.me/${cleanWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#1B7F3E] hover:bg-[#25D366]/20 transition-all text-xs font-semibold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </span>
                  <FiArrowRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}

              {business?.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#EAD7BC] text-[#24150E] hover:bg-[#FAF4EC] transition-all text-xs font-semibold uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <FiPhone className="w-3.5 h-3.5 text-[#77530a]" />
                    <span>Llamar</span>
                  </span>
                  <FiArrowRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              )}

              {business?.email && (
                <a
                  href={`mailto:${business.email}`}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white border border-[#EAD7BC] text-[#24150E] hover:bg-[#FAF4EC] transition-all text-xs font-medium tracking-wide sm:col-span-2"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FiMail className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                    <span className="truncate">{business.email}</span>
                  </span>
                  <FiArrowRight className="w-3.5 h-3.5 opacity-70 shrink-0 ml-2" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Card 3: Horarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-4 sm:p-5 shadow-xs space-y-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#EAD7BC]/40 flex items-center justify-center text-[#77530a]">
                <FiClock className="w-3.5 h-3.5" />
              </div>
              <span className="font-smooth font-bold text-xs tracking-[0.2em] uppercase text-[#77530a]">
                Días y Horarios
              </span>
            </div>

            <div className="font-serif text-xs sm:text-sm text-[#523B2D] space-y-1.5 pt-1">
              <div className="flex items-center justify-between py-1 border-b border-[#EAD7BC]/50">
                <span className="font-medium text-[#24150E]">{formatScheduleDays(business?.schedule_days)}</span>
                <span className="font-semibold text-[#77530a]">
                  {business?.schedule_open?.substring(0, 5) || '09:00'} a {business?.schedule_close?.substring(0, 5) || '20:00'} hs
                </span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-[#24150E]">Domingos</span>
                <span className="font-script text-base text-[#77530a]">Cerrado</span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Instagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-4 sm:p-5 shadow-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#fd5949] to-[#d6249f] flex items-center justify-center text-white shadow-xs shrink-0">
                <FiInstagram className="w-4 h-4" />
              </div>
              <div>
                <p className="font-smooth font-bold text-xs uppercase tracking-wider text-[#24150E]">
                  Instagram
                </p>
                <p className="font-serif text-[11px] text-[#77530a] truncate max-w-[150px]">
                  {business?.instagram ? `@${business.instagram.replace(/^@/, '')}` : '@kadbaystudio'}
                </p>
              </div>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#24150E] text-[#24150E] text-[11px] font-semibold uppercase tracking-wider hover:bg-[#24150E] hover:text-[#FAF7F2] active:scale-95 transition-all shrink-0"
            >
              <span>Seguir</span>
              <FiArrowRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>

        {/* ── Desktop Layout (Diseño editorial de 2 columnas original intacto) ── */}
        <div className="hidden lg:grid max-w-7xl mx-auto px-6 lg:px-8 grid-cols-2 gap-16 items-stretch">

          {/* Columna Izquierda: Información */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col justify-between space-y-8"
          >

            {/* Bloque: Ubicación */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <FiMapPin className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Donde nos encontrás
                </span>
              </div>
              <p className="font-serif text-lg text-[#523B2D] pl-8 leading-relaxed">
                {address}
              </p>
            </div>

            {/* Bloque: Contacto directo (Teléfono, WhatsApp & Email) */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <FiPhone className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Comunicate con nosotros
                </span>
              </div>
              <div className="font-serif text-lg text-[#523B2D] pl-8 space-y-2">
                {business?.phone && (
                  <p>
                    <a href={`tel:${business.phone}`} className="hover:text-[#77530a] transition-colors">
                      Tel: {business.phone}
                    </a>
                  </p>
                )}
                {cleanWa && (
                  <p>
                    <a
                      href={`https://wa.me/${cleanWa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 hover:text-[#77530a] transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4 text-[#25D366] shrink-0" />
                      <span>WhatsApp: {business?.whatsapp}</span>
                    </a>
                  </p>
                )}
                {business?.email && (
                  <p className="flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-[#77530a] shrink-0" />
                    <a href={`mailto:${business.email}`} className="hover:text-[#77530a] transition-colors break-all">
                      {business.email}
                    </a>
                  </p>
                )}
                {!business?.phone && !cleanWa && !business?.email && (
                  <p className="text-sm opacity-70">Contactanos por nuestras redes sociales.</p>
                )}
              </div>
            </div>

            {/* Línea separadora */}
            <div
              className="h-[1px] w-full"
              style={{ background: 'linear-gradient(to right, #77530a33, #ffd27766, transparent)' }}
            />

            {/* Bloque: Horarios */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <FiClock className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Horarios
                </span>
              </div>
              <div className="font-serif text-lg text-[#523B2D] pl-8 space-y-1.5 leading-relaxed">
                <p>
                  <span className="text-[#24150E] font-medium">{formatScheduleDays(business?.schedule_days)}</span> / {business?.schedule_open?.substring(0,5) || '09:00'} a {business?.schedule_close?.substring(0,5) || '20:00'}hs
                </p>
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
              <div className="flex items-center gap-3 mb-2">
                <FiInstagram className="w-5 h-5 text-[#77530a] shrink-0" />
                <span className="font-smooth font-bold text-xl tracking-widest text-[#24150E] uppercase">
                  Seguinos en redes
                </span>
              </div>
              <div className="flex gap-4">
                <a
                  href={instagramUrl}
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
                  Instagram
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
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'sepia(20%) saturate(80%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Ubicación ${business?.name || 'Kad Bay Studio'}`}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
