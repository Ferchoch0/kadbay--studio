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

  return (
    <section id="contacto" className="py-24 lg:py-32 bg-[#F4ECE4] w-full overflow-hidden">
      <div className="w-full space-y-14">

        {/* ── Cabecera ── */}
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
                    <a href={`mailto:${business.email}`} className="hover:text-[#77530a] transition-colors">
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
