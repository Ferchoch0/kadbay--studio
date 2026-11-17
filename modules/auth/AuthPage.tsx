'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheck, FiLoader, FiCalendar, FiClock, FiShield } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { loginWithGoogle } from './auth.service';
import { businessService, Business, getFullImageUrl } from '@/services/business.service';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
        };
      };
    };
  }
}

export default function AuthPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const googleButton = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

  const homeHref = '/';
  const studioName = business?.name || 'Kad Bay Studio';

  useEffect(() => {
    businessService
      .getBySlug(process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay')
      .then((b) => b && setBusiness(b))
      .catch(() => {});
  }, []);

  const logoUrl = getFullImageUrl(business?.logo_url);
  const bannerUrl = getFullImageUrl(business?.banner_url);
  const showLogo = Boolean(logoUrl && !logoError);
  const showBanner = Boolean(bannerUrl && !bannerError);

  const getButtonWidth = useCallback(() => {
    if (typeof window === 'undefined') return 280;
    const w = window.innerWidth;
    if (w <= 330) return 220;
    if (w <= 360) return 240;
    if (w <= 400) return 260;
    return 280;
  }, []);

  const renderGoogleButton = useCallback(() => {
    if (!window.google || !googleButton.current || !googleClientId) return;
    googleButton.current.innerHTML = '';

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      callback: async ({ credential }) => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
          await loginWithGoogle(credential);
          setSuccess('Sesión iniciada correctamente. Redirigiendo...');
          window.setTimeout(() => {
            window.location.href = homeHref;
          }, 1000);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : 'No pudimos conectar con Google.');
        } finally {
          setLoading(false);
        }
      },
    });

    window.google.accounts.id.renderButton(googleButton.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      width: getButtonWidth(),
      locale: 'es',
    });
  }, [googleClientId, getButtonWidth, homeHref]);

  useEffect(() => {
    if (!googleClientId) return;

    if (window.google) {
      renderGoogleButton();
    } else {
      const script = document.getElementById('google-identity-script');
      script?.addEventListener('load', renderGoogleButton, { once: true });
    }

    const handleResize = () => {
      renderGoogleButton();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [googleClientId, renderGoogleButton]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] px-3 sm:px-6 py-4 sm:py-10 text-[#24150E] flex items-center justify-center relative overflow-x-hidden">
      {/* Luces ambientales de fondo */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#C59A45]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#77530a]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10">
        <div className="grid w-full overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-[#EAD7BC] bg-white shadow-[0_20px_60px_rgba(45,27,24,0.08)] md:grid-cols-[1fr_1.1fr]">
          
          {/* Panel Lateral Decorativo (Desktop y Tablet) */}
          <div className="hidden md:flex relative flex-col justify-between p-8 lg:p-12 text-white overflow-hidden bg-[#24150E]">
            {showBanner ? (
              <>
                <Image
                  src={bannerUrl!}
                  alt={studioName}
                  fill
                  onError={() => setBannerError(true)}
                  className="object-cover opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C0F0A] via-[#24150E]/85 to-[#24150E]/60" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B18] via-[#3E231D] to-[#1E110F]" />
            )}

            <div className="relative z-10">
              <Link
                href={homeHref}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/80 hover:text-white transition-colors group cursor-pointer"
              >
                <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>Volver al inicio</span>
              </Link>
            </div>

            <div className="relative z-10 my-8 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wider border border-white/15 text-white/95">
                <BsStars className="w-3.5 h-3.5 text-[#C59A45]" />
                <span>{studioName}</span>
              </div>

              <div className="space-y-2">
                <p className="font-serif italic text-2xl text-[#C59A45] font-light">Tu momento de belleza</p>
                <h1 className="font-serif text-3xl lg:text-4xl leading-tight font-normal">
                  Cuidarte también es una forma de quererte.
                </h1>
              </div>

              <p className="text-sm text-white/75 leading-relaxed max-w-sm font-serif">
                Inicia sesión para confirmar tus reservas, consultar tus próximos turnos y acceder a tu tarjeta de fidelidad.
              </p>

              {/* Beneficios */}
              <div className="space-y-3 pt-2 text-xs text-white/85">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C59A45]">
                    <FiCalendar className="w-3.5 h-3.5" />
                  </div>
                  <span>Gestiona todas tus reservas desde cualquier dispositivo.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C59A45]">
                    <FiClock className="w-3.5 h-3.5" />
                  </div>
                  <span>Reserva en un solo clic sin volver a cargar tus datos.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#C59A45]">
                    <FiShield className="w-3.5 h-3.5" />
                  </div>
                  <span>Acceso rápido y 100% seguro con tu cuenta de Google.</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/50 tracking-wider uppercase font-mono">
              <span>{studioName}</span>
              <span>Reservas Online</span>
            </div>
          </div>

          {/* Panel de Login (Mobile y Columna Derecha Desktop) */}
          <div className="flex flex-col justify-center p-4 sm:p-8 lg:p-12 bg-white w-full">
            {/* Botón de volver para pantallas móviles */}
            <div className="md:hidden mb-4 sm:mb-6">
              <Link
                href={homeHref}
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-[#523B2D] hover:text-[#24150E] transition-colors group cursor-pointer"
              >
                <FiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                <span>Volver al inicio</span>
              </Link>
            </div>

            <div className="w-full max-w-sm mx-auto text-center flex flex-col items-center">
              {/* Logo o Icono del Estudio */}
              {showLogo ? (
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#EAD7BC] mb-3 sm:mb-4 shadow-xs">
                  <Image
                    src={logoUrl!}
                    alt={studioName}
                    fill
                    onError={() => setLogoError(true)}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#FAF4EC] flex items-center justify-center text-[#77530a] mb-3 sm:mb-4 border border-[#EAD7BC] shadow-xs">
                  <BsStars className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
              )}

              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#77530a] font-semibold mb-0.5 sm:mb-1">
                {studioName}
              </span>
              <h2 className="text-xl sm:text-3xl font-serif text-[#24150E] font-medium">
                Inicia Sesión
              </h2>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#523B2D] leading-relaxed px-1 font-serif">
                Accede con tu cuenta de Google para confirmar tu turno y tener siempre a mano el detalle de tus citas.
              </p>

              {/* Contenedor del Botón de Google */}
              <div className="mt-5 sm:mt-8 w-full flex flex-col items-center justify-center min-h-[46px] relative">
                <div
                  ref={googleButton}
                  style={{ minHeight: '44px' }}
                  className={`w-full flex flex-col items-center justify-center overflow-hidden [&>*]:!mx-auto [&>iframe]:!mx-auto transition-opacity duration-200 ${
                    loading ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                />

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 z-20 rounded-full">
                    <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-[#FAF4EC] text-[#77530a] font-medium text-xs sm:text-sm border border-[#EAD7BC] animate-pulse shadow-xs">
                      <FiLoader className="w-3.5 h-3.5 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  </div>
                )}
              </div>

              {!googleClientId && (
                <p className="mt-4 text-center text-[11px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200 w-full">
                  Falta configurar NEXT_PUBLIC_GOOGLE_CLIENT_ID.
                </p>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 w-full flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-[11px] sm:text-xs text-emerald-800 text-left"
                >
                  <FiCheck className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                  <span>{success}</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 w-full rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-[11px] sm:text-xs text-red-700 text-left"
                >
                  {error}
                </motion.div>
              )}

              {/* Aclaración sobre primera vez */}
              <p className="mt-4 sm:mt-6 text-[10px] sm:text-[11px] text-[#523B2D] leading-normal px-1 font-serif">
                Si es tu primera vez en <strong>{studioName}</strong>, tu cuenta se creará automáticamente de manera segura al continuar con Google.
              </p>

              {/* Pie de seguridad */}
              <div className="mt-5 sm:mt-8 pt-4 sm:pt-5 border-t border-[#EAD7BC]/60 w-full flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-[#523B2D]">
                <FiShield className="w-3.5 h-3.5 text-[#77530a] shrink-0" />
                <span>Autenticación oficial y protegida por Google</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <script id="google-identity-script" src="https://accounts.google.com/gsi/client" async defer />
    </main>
  );
}
