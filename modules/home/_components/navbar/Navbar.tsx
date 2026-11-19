'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiMessageSquare, FiCalendar, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import heroLogo from '@/assets/images/hero-title.png';
import { getStoredClient } from '@/modules/auth/auth.service';

export default function Navbar() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [clientName, setClientName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSubpage = Boolean(pathname && (pathname.includes('/appointments') || pathname.includes('/profile') || pathname.includes('/auth')));

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
          // Distancia en píxeles para completar la transición hacia el navbar (más ágil en mobile/tablet <990px)
          const isMobile = window.innerWidth < 990;
          const threshold = isMobile ? 180 : 300;
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

  // En rutas secundarias el logo siempre está en su estado pequeño docked
  const effectiveProgress = isSubpage ? 1 : scrollProgress;

  const isScrolled = effectiveProgress > 0.2;
  const isDockedInNav = effectiveProgress >= 0.9;
  const isPastHero = effectiveProgress > 0.08;

  const navigateWithModalClose = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);

    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    if (isExternal) {
      window.location.href = href;
      return;
    }

    if (pathname === href) {
      return;
    }

    const isModalOpen = Boolean(typeof document !== 'undefined' && document.querySelector('[data-appointment-modal]'));
    if (isModalOpen) {
      window.dispatchEvent(new CustomEvent('close-appointment-modal'));
      setTimeout(() => {
        router.push(href);
      }, 300);
      return;
    }

    router.push(href);
  };

  const scrollToSection = (targetId: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);

    const isModalOpen = Boolean(typeof document !== 'undefined' && document.querySelector('[data-appointment-modal]'));
    if (isModalOpen) {
      window.dispatchEvent(new CustomEvent('close-appointment-modal'));
      setTimeout(() => {
        router.push(`/#${targetId}`);
      }, 300);
      return;
    }

    if (pathname && pathname !== '/') {
      window.location.href = `/#${targetId}`;
      return;
    }

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

  const handleLogout = () => {
    localStorage.removeItem('stetic_access_token');
    localStorage.removeItem('stetic_refresh_token');
    localStorage.removeItem('stetic_client');
    setClientName(null);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);

    const isModalOpen = Boolean(typeof document !== 'undefined' && document.querySelector('[data-appointment-modal]'));
    if (isModalOpen) {
      window.dispatchEvent(new CustomEvent('close-appointment-modal'));
      setTimeout(() => {
        router.push('/');
      }, 300);
    } else if (pathname?.includes('/profile') || pathname?.includes('/appointments')) {
      router.push('/');
    }
  };

  return (
    <>
      {/* Barra de Navegación Fija */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAD7BC]/60 shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-2.5 min-[380px]:px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Navegación Izquierda (Desktop >= 990px) */}
          <nav className="hidden min-[990px]:flex items-center gap-6">
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
              className={`inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <FiUsers className="w-4 h-4 opacity-85 shrink-0" />
              <span>Nosotras</span>
            </Link>
          </nav>

          {/* Botón Hamburger Móvil y Tablet (Izquierda en < 990px) */}
          <div className="flex min-[990px]:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Abrir menú"
              className={`p-1.5 min-[380px]:p-2 rounded-lg transition-colors ${
                isScrolled || isMobileMenuOpen
                  ? 'text-[#24150E] hover:bg-[#EAD7BC]/40'
                  : 'text-[#FAF7F2] hover:bg-black/10'
              }`}
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

          {/* Espacio reservado central para el logo cuando aterriza en el navbar */}
          <div className="w-16 min-[380px]:w-28 sm:w-36 h-12 flex items-center justify-center pointer-events-none" />

          {/* Navegación Derecha & CTA */}
          <div className="flex items-center gap-2 min-[380px]:gap-3 sm:gap-6">
            <Link
              href="#contacto"
              onClick={(e) => scrollToSection('contacto', e)}
              className={`hidden min-[990px]:inline-flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-300 ${
                isScrolled
                  ? 'text-[#24150E]/85 hover:text-[#C59A45]'
                  : 'text-[#FAF7F2] hover:text-[#C59A45]'
              }`}
            >
              <FiMessageSquare className="w-4 h-4 opacity-85 shrink-0" />
              <span>Contacto</span>
            </Link>

            {clientName ? (
              <div className="relative hidden min-[990px]:block">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen((open) => !open)}
                  className="btn-skew-anim inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs"
                >
                  <FiUser className="w-3.5 h-3.5 shrink-0" />
                  <span>{clientName.slice(0, 10)}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#EAD7BC] bg-[#FAF7F2] p-2 shadow-xl z-50">
                    <div className="px-3 py-1.5 border-b border-[#EAD7BC]/60 mb-1">
                      <p className="text-xs text-[#523B2D]/70">Hola,</p>
                      <p className="text-sm font-bold text-[#24150E] truncate">{clientName}</p>
                    </div>
                    <Link
                      href="/appointments"
                      onClick={(e) => navigateWithModalClose('/appointments', e)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[#24150E] hover:bg-[#EAD7BC]/40"
                    >
                      Mis Reservas
                    </Link>
                    <Link
                      href="/profile"
                      onClick={(e) => navigateWithModalClose('/profile', e)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-[#24150E] hover:bg-[#EAD7BC]/40"
                    >
                      Mi Perfil
                    </Link>
                    <div className="my-1 border-t border-[#EAD7BC]" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={(e) => navigateWithModalClose('/auth', e)}
                style={{
                  '--btn-bg': isScrolled ? '#C59A45' : '#FAF7F2',
                  '--btn-hover-bg': isScrolled ? '#24150E' : '#C59A45',
                  '--btn-text': '#24150E',
                  '--btn-hover-text': '#FAF7F2'
                } as React.CSSProperties}
                className="btn-skew-anim hidden min-[990px]:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs"
              >
                <FiUser className="w-3.5 h-3.5 shrink-0" />
                <span>Ingresar</span>
              </Link>
            )}

            <Link
              href={process.env.NEXT_PUBLIC_APPOINTMENT_URL || "/appointments/new"}
              onClick={(e) => navigateWithModalClose(process.env.NEXT_PUBLIC_APPOINTMENT_URL || "/appointments/new", e)}
              style={{
                '--btn-bg': isScrolled ? '#24150E' : '#FAF7F2',
                '--btn-hover-bg': '#C59A45',
                '--btn-text': isScrolled ? '#FAF7F2' : '#24150E',
                '--btn-hover-text': '#FAF7F2'
              } as React.CSSProperties}
              aria-label="Reservar cita"
              title="Reservar cita"
              className="btn-skew-anim inline-flex items-center justify-center gap-1.5 p-2 min-[380px]:px-3.5 sm:px-4 min-[380px]:py-2 text-xs uppercase tracking-widest font-semibold rounded-full active:scale-95 shadow-xs shrink-0"
            >
              <FiCalendar className="w-4 h-4 shrink-0" />
              <span className="hidden min-[380px]:inline">Reservar</span>
            </Link>
          </div>
        </div>

        {/* Mobile & Tablet Menu Slide-down Drawer (< 990px) */}
        {isMobileMenuOpen && (
          <div className="min-[990px]:hidden bg-[#FAF7F2] border-b border-[#EAD7BC] px-6 py-6 shadow-2xl flex flex-col space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3">
              <Link
                href="#inicio"
                onClick={(e) => scrollToSection('inicio', e)}
                className="flex items-center gap-3 text-base font-medium text-[#24150E] py-2 border-b border-[#EAD7BC]/40"
              >
                <FiHome className="w-5 h-5 text-[#77530a]" />
                <span>Inicio</span>
              </Link>
              <Link
                href="#servicios"
                onClick={(e) => scrollToSection('servicios', e)}
                className="flex items-center gap-3 text-base font-medium text-[#24150E] py-2 border-b border-[#EAD7BC]/40"
              >
                <BsStars className="w-5 h-5 text-[#77530a]" />
                <span>Servicios</span>
              </Link>
              <Link
                href="#nosotros"
                onClick={(e) => scrollToSection('nosotros', e)}
                className="flex items-center gap-3 text-base font-medium text-[#24150E] py-2 border-b border-[#EAD7BC]/40"
              >
                <FiUsers className="w-5 h-5 text-[#77530a]" />
                <span>Nosotras</span>
              </Link>
              <Link
                href="#contacto"
                onClick={(e) => scrollToSection('contacto', e)}
                className="flex items-center gap-3 text-base font-medium text-[#24150E] py-2 border-b border-[#EAD7BC]/40"
              >
                <FiMessageSquare className="w-5 h-5 text-[#77530a]" />
                <span>Contacto</span>
              </Link>
            </nav>

            <div className="pt-2 flex flex-col space-y-2.5">
              {clientName ? (
                <>
                  <div className="px-3 py-2 bg-[#F4ECE4] rounded-lg">
                    <p className="text-xs text-[#523B2D]/70">Sesión iniciada como</p>
                    <p className="text-sm font-bold text-[#24150E]">{clientName}</p>
                  </div>
                  <Link
                    href="/appointments"
                    onClick={(e) => navigateWithModalClose('/appointments', e)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#24150E] rounded-lg hover:bg-[#EAD7BC]/40"
                  >
                    <FiCalendar className="w-4 h-4 text-[#77530a]" />
                    <span>Mis Reservas</span>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={(e) => navigateWithModalClose('/profile', e)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#24150E] rounded-lg hover:bg-[#EAD7BC]/40"
                  >
                    <FiUser className="w-4 h-4 text-[#77530a]" />
                    <span>Mi Perfil</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-red-700 rounded-lg hover:bg-red-50 text-left"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={(e) => navigateWithModalClose('/auth', e)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-[#24150E] text-xs font-semibold uppercase tracking-widest text-[#24150E] hover:bg-[#24150E] hover:text-[#FAF7F2] transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </Link>
              )}
            </div>
          </div>
        )}
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
          className="relative w-[85vw] max-[989px]:max-w-[490px] min-[990px]:w-[490px] md:w-[720px] lg:w-[820px] flex items-center justify-center transition-[filter] duration-75"
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
