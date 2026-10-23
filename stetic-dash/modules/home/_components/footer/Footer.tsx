'use client';

import { FiInstagram, FiMapPin, FiPhone, FiClock } from 'react-icons/fi';
import { BsDiamondFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import Image from 'next/image';
import HeroLogo from '@/assets/images/hero-title.png';

export default function Footer() {
  const navLinks = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Servicios', href: '#servicios' },
    { label: 'Nosotros', href: '#nosotros' },
    { label: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer className="bg-[#18110B] text-[#FAF7F2] w-full">

      {/* ── Cuerpo principal ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1: Marca */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-1 flex flex-col space-y-5"
          >
            <div>
              <Image
                src={HeroLogo}
                alt="Hero Logo"
                width={200}
                height={200}
                className="object-contain"
              />
              <div className='w-full flex justify-end pr-[15%]'>
                <span className="font-script text-3xl text-[#C59A45] tracking-normal">
                  Studio
                </span>
              </div>
            </div>
            <p className="font-serif text-sm text-[#9C8B7E] leading-relaxed max-w-xs">
              Un espacio de lujo sereno dedicado a resaltar tu belleza natural con técnicas innovadoras y atención personalizada.
            </p>
            {/* Separador dorado */}
            <div className="flex items-center gap-3 pt-1">
              <BsDiamondFill className="w-2 h-2 text-[#C59A45]" />
              <div
                className="h-[1px] w-24"
                style={{ background: 'linear-gradient(to right, #77530a, #ffd277, transparent)' }}
              />
            </div>
          </motion.div>

          {/* Col 2: Navegación */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col space-y-5"
          >
            <h4 className="font-smooth font-bold text-xs tracking-[0.3em] uppercase text-[#C59A45]">
              Navegación
            </h4>
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-serif text-sm text-[#9C8B7E] hover:text-[#FAF7F2] transition-colors duration-200 tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Col 3: Horarios */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col space-y-5"
          >
            <h4 className="font-smooth font-bold text-xs tracking-[0.3em] uppercase text-[#C59A45]">
              Horarios
            </h4>
            <div className="flex flex-col space-y-2.5 font-serif text-sm text-[#9C8B7E] leading-relaxed">
              <div className="flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                <span><span className="text-[#FAF7F2]/80">Lunes</span> / 12 a 19hs</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                <span><span className="text-[#FAF7F2]/80">Mar – Sáb</span> / 9 a 19hs</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                <span><span className="text-[#FAF7F2]/80">Domingos</span> /{' '}
                  <span className="font-script text-lg text-[#77530a]">Cerrado</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Col 4: Contacto y Redes */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col space-y-5"
          >
            <h4 className="font-smooth font-bold text-xs tracking-[0.3em] uppercase text-[#C59A45]">
              Contacto
            </h4>
            <div className="flex flex-col space-y-3 font-serif text-sm text-[#9C8B7E]">
              <a href="tel:1134233686" className="flex items-center gap-2 hover:text-[#FAF7F2] transition-colors duration-200">
                <FiPhone className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                <span>1134233686</span>
              </a>
              <div className="flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 text-[#77530a] shrink-0 mt-0.5" />
                <span>Cajaravilla 4324</span>
              </div>
            </div>

            <h4 className="font-smooth font-bold text-xs tracking-[0.3em] uppercase text-[#C59A45] pt-2">
              Redes
            </h4>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-serif text-[#9C8B7E] hover:text-[#E1306C] transition-colors duration-200 group"
            >
              <span className="w-7 h-7 rounded-full border border-[#9C8B7E]/30 group-hover:border-[#E1306C]/50 flex items-center justify-center transition-colors duration-200">
                <FiInstagram className="w-3.5 h-3.5" />
              </span>
              Instagram
            </a>
          </motion.div>

        </div>
      </div>

      {/* ── Línea dorada divisoria ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div
          className="h-[1px] w-full"
          style={{ background: 'linear-gradient(to right, transparent, #77530a40, #ffd27750, #77530a40, transparent)' }}
        />
      </div>

      {/* ── Copyright ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs font-serif text-[#5C4C42] tracking-wide">
          © {new Date().getFullYear()} KAD BAY Studio. Todos los derechos reservados.
        </p>
        <p className="text-xs font-serif text-[#5C4C42] tracking-wide">
          Diseñado con{' '}
          <span className="font-script text-base text-[#C59A45]">amor</span> {' '}
          por{' '}
          <a href="https://otter-ly.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-smooth text-base text-[#81679f] ml-1 hover:text-[#a07fc0] transition-colors duration-200">otterly</a>
        </p>
      </div>

    </footer>
  );
}
