'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiCheckCircle,
  FiGift,
  FiLogOut,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiRotateCw,
  FiClock,
  FiAward,
} from 'react-icons/fi';
import { BsDiamondFill } from 'react-icons/bs';
import Navbar from '@/modules/home/_components/navbar/Navbar';
import LoyaltyCard, { THEMES } from '@/components/LoyaltyCard';
import { getStoredClient, getClientMe, logoutClient, ClientSession } from '@/modules/auth/auth.service';
import { appointmentService, ClientAppointment } from '@/services/appointment.service';
import { businessService, Business, getFullImageUrl } from '@/services/business.service';

const BUSINESS_SLUG = process.env.NEXT_PUBLIC_BUSINESS_SLUG || 'kadbay';

export default function ProfilePage() {
  const router = useRouter();
  const [client, setClient] = useState<ClientSession['client'] | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardWidth, setCardWidth] = useState(480);
  const [cardFlipped, setCardFlipped] = useState(false);

  // Responsive width para que la tarjeta se adapte a móviles y escritorios
  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      if (w < 400) {
        setCardWidth(w - 32);
      } else if (w < 640) {
        setCardWidth(Math.min(420, w - 48));
      } else {
        setCardWidth(480);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Carga de datos de cliente, negocio y citas
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Obtener cliente almacenado o verificar sesión
      const initialClient = getStoredClient();
      if (!initialClient) {
        if (isMounted) setLoading(false);
        return;
      }
      if (isMounted) setClient(initialClient);

      // 2. Traer datos frescos de la BD en paralelo
      try {
        const [freshClient, businessData, clientAppointments] = await Promise.all([
          getClientMe().catch(() => initialClient),
          businessService.getBySlug(BUSINESS_SLUG).catch(() => null),
          appointmentService.getClientAppointments(BUSINESS_SLUG).catch(() => []),
        ]);

        if (isMounted) {
          if (freshClient) setClient(freshClient);
          if (businessData) setBusiness(businessData);
          if (Array.isArray(clientAppointments)) setAppointments(clientAppointments);
        }
      } catch (err) {
        console.error('Error cargando datos del perfil:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logoutClient();
    router.push('/');
  };

  // Métricas de citas para la tarjeta de fidelidad
  const completedAppointments = useMemo(
    () => appointments.filter((a) => a.status === 'completed'),
    [appointments]
  );

  const upcomingAppointments = useMemo(
    () =>
      appointments.filter(
        (a) =>
          (a.status === 'confirmed' || a.status === 'pending') &&
          new Date(a.scheduled_at).getTime() >= Date.now()
      ),
    [appointments]
  );

  // Cantidad de sellos acumulados en el ciclo de 10
  const stampsCollected = useMemo(() => {
    const count = completedAppointments.length;
    // Si completó 10 o más, muestra cuántos lleva del ciclo actual o al menos 1 por cada turno completado
    return count === 0 ? 0 : count % 10 === 0 ? 10 : count % 10;
  }, [completedAppointments]);

  // Nivel de fidelidad
  const loyaltyBadge = completedAppointments.length >= 5 ? 'Cliente VIP' : 'Miembro Club';

  // Tema Kadbay personalizado para la tarjeta
  const kadbayTheme = useMemo(
    () => ({
      background: '#FAF4EC',
      backgroundAccent: '#F3E5D3',
      text: '#24150E',
      accent: '#C59A45',
      accentSoft: '#E8D4B0',
      onAccent: '#FFFFFF',
    }),
    []
  );

  const logoUrl = getFullImageUrl(business?.logo_url);

  // Estado si no está logueado
  if (!loading && !client) {
    return (
      <main className="min-h-screen bg-[#FAF7F2] text-[#24150E] flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto px-6 py-40 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#EAD7BC]/40 flex items-center justify-center text-[#77530a]">
            <FiAward className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#24150E]">Tu Tarjeta de Fidelidad</h1>
          <p className="font-serif text-base text-[#523B2D] leading-relaxed">
            Iniciá sesión para acceder a tu tarjeta digital, acumular sellos en cada visita y disfrutar de beneficios exclusivos.
          </p>
          <div className="pt-2">
            <Link
              href="/auth"
              className="btn-skew-anim inline-flex items-center justify-center px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-[#FAF7F2] bg-[#24150E] rounded-full hover:bg-[#77530a] transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#24150E] flex flex-col">
      <Navbar />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 space-y-12 sm:space-y-16">

        {/* ── Cabecera Editorial ── */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center space-y-3"
        >
          <span className="font-smooth font-bold text-xs tracking-[0.3em] uppercase text-[#77530a] block">
            Club de Beneficios
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#24150E] tracking-tight">
            Tarjeta de Fidelidad
          </h1>

          {/* Separador de Oro */}
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

          <p className="font-serif text-base sm:text-lg text-[#523B2D] max-w-xl mx-auto">
            Bienvenida, <span className="font-semibold text-[#24150E]">{client?.name}</span>. Acumulá sellos en cada visita y desbloqueá descuentos especiales.
          </p>
        </motion.div>

        {/* ── Eje Central: Tarjeta de Fidelidad ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center space-y-4"
        >
          <div className="relative p-2 sm:p-4 rounded-2xl bg-gradient-to-b from-[#FAF7F2] to-[#F4ECE4] border border-[#EAD7BC]/60 shadow-xl shadow-[#77530a]/5">
            <LoyaltyCard
              logo={logoUrl || undefined}
              businessName={business?.name || 'kadbaystudio'}
              brandLabel={'KAD BAY\nSTUDIO'}
              tagline={business?.title || 'Nail Studio & Estética'}
              clientName={client?.name || 'Cliente'}
              cardTitle="Tarjeta de fidelidad"
              instagram={business?.instagram || '@kadbaystudio'}
              whatsapp={business?.whatsapp || '11 3423 3686'}
              badge={loyaltyBadge}
              stampsTotal={10}
              stampsCollected={stampsCollected}
              discounts={['10%', '15%']}
              theme={kadbayTheme}
              scriptFont="var(--font-script), 'Pinyon Script', cursive"
              width={cardWidth}
              onFlip={(flipped) => setCardFlipped(flipped)}
            />
          </div>

          {/* Hint interactivo para girar */}
          <div className="flex items-center gap-2 text-xs font-serif text-[#77530a] tracking-wide bg-[#EAD7BC]/30 px-4 py-1.5 rounded-full border border-[#EAD7BC]/60">
            <FiRotateCw className={`w-3.5 h-3.5 transition-transform duration-500 ${cardFlipped ? 'rotate-180' : ''}`} />
            <span>Tocá o hacé click en la tarjeta para {cardFlipped ? 'ver el frente' : 'ver tus sellos'}</span>
          </div>
        </motion.div>

        {/* ── Métricas y Progreso ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Progreso de sellos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-smooth font-bold text-xs tracking-widest uppercase text-[#77530a]">
                Progreso del Ciclo
              </span>
              <FiCheckCircle className="w-5 h-5 text-[#C59A45]" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif text-[#24150E] font-bold">{stampsCollected}</span>
                <span className="text-lg text-[#523B2D] font-serif">/ 10 sellos</span>
              </div>

              {/* Barra de progreso */}
              <div className="w-full h-2 rounded-full bg-[#EAD7BC]/40 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.min(100, (stampsCollected / 10) * 100)}%`,
                    background: 'linear-gradient(to right, #77530a, #C59A45, #ffd277)',
                  }}
                />
              </div>
            </div>

            <p className="text-xs font-serif text-[#523B2D] leading-relaxed">
              {stampsCollected < 5
                ? `Te faltan ${5 - stampsCollected} turnos para desbloquear el 10% OFF en tu servicio.`
                : stampsCollected < 10
                ? `¡Ya tenés el 10% OFF! Faltan ${10 - stampsCollected} turnos para el 15% OFF.`
                : '¡Felicitaciones! Has completado tu ciclo de 10 sellos de fidelidad.'}
            </p>
          </motion.div>

          {/* Card 2: Visitas registradas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-smooth font-bold text-xs tracking-widest uppercase text-[#77530a]">
                Citas Completadas
              </span>
              <FiClock className="w-5 h-5 text-[#C59A45]" />
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-serif text-[#24150E] font-bold">
                  {completedAppointments.length}
                </span>
                <span className="text-lg text-[#523B2D] font-serif">turnos realizados</span>
              </div>
              <p className="text-xs font-serif text-[#523B2D] mt-2">
                En {business?.name || 'Kad Bay Studio'}.
              </p>
            </div>

            <div className="pt-2 border-t border-[#EAD7BC]/40 flex items-center justify-between">
              <span className="text-xs text-[#523B2D] font-serif">Próxima cita activa:</span>
              <span className="text-xs font-semibold text-[#77530a]">
                {upcomingAppointments.length > 0 ? 'Agendada' : 'Sin turnos pendientes'}
              </span>
            </div>
          </motion.div>

          {/* Card 3: Categoría y Beneficios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-smooth font-bold text-xs tracking-widest uppercase text-[#77530a]">
                Categoría Actual
              </span>
              <FiGift className="w-5 h-5 text-[#C59A45]" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAD7BC]/40 text-[#77530a] text-xs font-bold uppercase tracking-wider">
                <BsDiamondFill className="w-2 h-2 text-[#77530a]" />
                {loyaltyBadge}
              </div>
              <p className="font-serif text-sm text-[#24150E] mt-3 font-medium">
                Beneficios de Fidelidad:
              </p>
              <ul className="text-xs font-serif text-[#523B2D] space-y-1 mt-1">
                <li>• 10% de descuento en el 5° turno</li>
                <li>• 15% de descuento en el 10° turno</li>
                <li>• Atención preferencial en agenda</li>
              </ul>
            </div>

            <Link
              href="/appointments"
              className="text-xs font-smooth font-bold text-[#77530a] hover:text-[#24150E] transition-colors inline-flex items-center gap-1.5 uppercase tracking-wider"
            >
              <span>Ver mis reservas</span>
              <FiArrowRight />
            </Link>
          </motion.div>

        </div>

        {/* ── Datos de la Cuenta y Accesos Rápidos ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* Información del Cliente */}
          <div className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-6 sm:p-8 space-y-6 shadow-sm">
            <h3 className="font-smooth font-bold text-sm tracking-widest uppercase text-[#24150E] border-b border-[#EAD7BC]/60 pb-3">
              Datos Personales
            </h3>

            <div className="space-y-4 font-serif text-sm text-[#523B2D]">
              <div className="flex items-center justify-between">
                <span className="text-[#9C8B7E]">Nombre:</span>
                <span className="font-medium text-[#24150E]">{client?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9C8B7E]">Email:</span>
                <span className="font-medium text-[#24150E] flex items-center gap-1.5">
                  <FiMail className="w-3.5 h-3.5 text-[#77530a]" />
                  {client?.email}
                </span>
              </div>
              {client?.phone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#9C8B7E]">Teléfono:</span>
                  <span className="font-medium text-[#24150E] flex items-center gap-1.5">
                    <FiPhone className="w-3.5 h-3.5 text-[#77530a]" />
                    {client.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#9C8B7E]">Estudio:</span>
                <span className="font-medium text-[#24150E]">
                  {business?.name || 'Kad Bay Studio'}
                </span>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="rounded-2xl border border-[#EAD7BC] bg-[#FAF7F2] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <h3 className="font-smooth font-bold text-sm tracking-widest uppercase text-[#24150E] border-b border-[#EAD7BC]/60 pb-3 mb-4">
                Acciones de Cuenta
              </h3>
              <p className="font-serif text-sm text-[#523B2D] leading-relaxed mb-6">
                Podés gestionar tus turnos vigentes, consultar el historial de servicios o solicitar una nueva cita.
              </p>

              <div className="space-y-3">
                <Link
                  href="/appointments"
                  className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-[#EAD7BC] hover:border-[#77530a] hover:bg-[#FAF4EC] transition-all text-sm font-serif text-[#24150E]"
                >
                  <span className="flex items-center gap-2.5">
                    <FiCalendar className="w-4 h-4 text-[#77530a]" />
                    <span>Mis Reservas</span>
                  </span>
                  <FiArrowRight className="w-4 h-4 text-[#77530a]" />
                </Link>

                <Link
                  href="/appointments/new"
                  className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-[#24150E] text-[#FAF7F2] hover:bg-[#77530a] transition-all text-sm font-serif"
                >
                  <span>Reservar Nuevo Turno</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAD7BC]/60">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-xs font-serif text-red-700 hover:text-red-900 transition-colors"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

