'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiMessageSquare, FiCalendar, FiUser, FiLogOut } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import heroLogo from '@/assets/images/hero-title.png';
import { getStoredClient } from '@/modules/auth/auth.service';

export default function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAppointments = pathname ? pathname.includes('/appointments') : false;

  useEffect(() => {
    const storedClient = getStoredClient();
    setClientName(storedClient?.name ?? null);

    const handleStorage = () => {
      const client = getStoredClient();
      setClientName(client?.name ?? null);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Distancia en píxeles para completar la transición hacia el navbar
          const threshold = 300;
          const progress = Math.min(1, Math.max(0, scrollY / threshold));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // En rutas de appointments el logo siempre está en su estado pequeño docked
  const effectiveProgress = isAppointments ? 1 : scrollProgress;

  const isScrolled = effectiveProgress > 0.2;
  const isDockedInNav = effectiveProgress >= 0.9;
  const isPastHero = effectiveProgress > 0.08;

  const scrollToSection = (targetId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    const lenis = (
      window as unknown as {
        lenis?: { scrollTo: (target: string | number | HTMLElement, options?: Record<string, unknown>) => void };
      }
    ).lenis;

    if (targetId === 'inicio') {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    if (lenis) {
      lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
    } else {
      const navHeight = 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* Barra de Navegación Fija */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAD7BC]/60 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Navegación Izquierda */}
          <nav className="flex items-center gap-6">
            <Link
              href="#inicio"
              onClick={(e) => scrollToSection('inicio', e)}
              className={`inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <FiHome className="w-4 h-4 opacity-85 shrink-0" />
              <span>Inicio</span>
            </Link>
            <Link
              href="#servicios"
              onClick={(e) => scrollToSection('servicios', e)}
              className={`inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <BsStars className="w-4 h-4 opacity-85 shrink-0" />
              <span>Servicios</span>
            </Link>
            <Link
              href="#nosotros"
              onClick={(e) => scrollToSection('nosotros', e)}
              className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <FiUsers className="w-4 h-4 opacity-85 shrink-0" />
              <span>Nosotras</span>
            </Link>
          </nav>

          {/* Espacio reservado central para el logo cuando aterriza en el navbar */}
          <div className="w-36 h-12 flex items-center justify-center pointer-events-none" />

          {/* Navegación Derecha & CTA */}
          <div className="flex items-center gap-6">
            <Link
              href="#contacto"
              onClick={(e) => scrollToSection('contacto', e)}
              className={`hidden sm:inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <FiMessageSquare className="w-4 h-4 opacity-85 shrink-0" />
              <span>Contacto</span>
            </Link>
            {clientName ? (
              <div className="relative hidden sm:block">
                <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="btn-skew-anim inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs">
                  <FiUser className="w-3.5 h-3.5 shrink-0" /><span>{clientName.slice(0, 10)}</span>
                </button>
                {isMenuOpen && <div className="absolute right-0 mt-2 w-44 rounded-xl border border-[#EAD7BC] bg-[#FAF7F2] p-2 shadow-xl z-50">
                  <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#EAD7BC]/40">Perfil</Link>
                  <Link href="/appointments" className="block rounded-lg px-3 py-2 text-sm hover:bg-[#EAD7BC]/40">Reservas</Link>
                  <div className="my-1 border-t border-[#EAD7BC]" />
                  <button type="button" onClick={() => { localStorage.removeItem('stetic_access_token'); localStorage.removeItem('stetic_refresh_token'); localStorage.removeItem('stetic_client'); setClientName(null); setIsMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"><FiLogOut />Salir</button>
                </div>}
              </div>
            ) : <Link
              href="/auth"
              style={{
                '--btn-bg': isScrolled ? '#C59A45' : '#FAF7F2',
                '--btn-hover-bg': isScrolled ? '#24150E' : '#C59A45',
                '--btn-text': isScrolled ? '#24150E' : '#24150E',
                '--btn-hover-text': '#FAF7F2'
              } as React.CSSProperties}
              className="btn-skew-anim hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs"
            >
              <FiUser className="w-3.5 h-3.5 shrink-0" />
              <span>{clientName ? clientName.slice(0, 10) : 'Ingresar'}</span>
            </Link>}
            <Link
              href={process.env.NEXT_PUBLIC_APPOINTMENT_URL || "/appointments/new"}
              style={{
                '--btn-bg': isScrolled ? '#24150E' : '#FAF7F2',
                '--btn-hover-bg': '#C59A45',
                '--btn-text': isScrolled ? '#FAF7F2' : '#24150E',
                '--btn-hover-text': '#FAF7F2'
              } as React.CSSProperties}
              className="btn-skew-anim inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs"
            >
              <FiCalendar className="w-3.5 h-3.5 shrink-0" />
              <span>Reservar</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Logo que viaja y se achica desde la parte superior del Hero hasta el Navbar */}
      {/* En appointments siempre aparece en su modo pequeño docked */}
      <div
        onClick={isDockedInNav ? (e) => scrollToSection('inicio', e) : undefined}
        style={{
          top: `calc(${20 * (1 - effectiveProgress)}vh + ${40 * effectiveProgress}px)`,
          left: '50%',
          transform: `translate(-50%, -50%) scale(${1 - 0.78 * effectiveProgress})`,
          transformOrigin: 'center center',
          willChange: 'top, transform',
        }}
        className={`fixed ${
          isPastHero ? 'z-50' : 'z-20'
        } transition-transform duration-75 select-none ${
          isDockedInNav ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'
        }`}
        title={isDockedInNav ? 'Volver al inicio' : undefined}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter: `invert(${Math.min(0.9, Math.max(0, effectiveProgress * 2.5))})`,
            }}
            className="relative w-[490px] sm:w-[600px] md:w-[720px] lg:w-[820px] flex items-center justify-center transition-[filter] duration-75"
          >
            {/* Borde superior solo en modo grande */}
            <div
              style={{ opacity: Math.max(0, 1 - effectiveProgress * 3) }}
              className="absolute -top-1 sm:-top-2 inset-x-0 h-[1px] bg-[#fcfdf5] pointer-events-none transition-opacity duration-150"
            />

            <Image
              src={heroLogo}
              alt="Hero Logo"
              priority
              className="w-full h-auto object-contain scale-x-120"
            />

            {/* Borde inferior solo en modo grande */}
            <div
              style={{ opacity: Math.max(0, 1 - effectiveProgress * 3) }}
              className="absolute -bottom-1 sm:-bottom-2 inset-x-0 h-[1px] bg-[#fcfdf5] pointer-events-none transition-opacity duration-150"
            />
          </motion.div>
        </div>
    </>
  );
}
