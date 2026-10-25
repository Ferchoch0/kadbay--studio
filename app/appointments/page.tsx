'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/modules/home/_components/navbar/Navbar';
import { ClientAppointment, appointmentService } from '@/services/appointment.service';
import { FiAlertTriangle, FiCalendar, FiMapPin, FiPlus, FiX } from 'react-icons/fi';

const appointmentStatusLabels: Record<ClientAppointment['status'], string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  cancelled: 'Cancelado',
  no_show: 'No asistió',
};

function getAppointmentStatusLabel(status: ClientAppointment['status']): string {
  return appointmentStatusLabels[status] ?? status;
}

function getAppointmentStatusClass(status: ClientAppointment['status']): string {
  const classes: Record<ClientAppointment['status'], string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    no_show: 'bg-gray-100 text-gray-800',
  };

  return classes[status] ?? 'bg-gray-100 text-gray-800';
}

function AppointmentModal({ appointment, onClose, onUpdate, showActions }: { appointment: ClientAppointment; onClose: () => void; onUpdate: (status: 'confirmed' | 'cancelled') => void; showActions: boolean }) {
  const date = new Date(appointment.scheduled_at);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#FAF7F2] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
    <div className="flex items-center justify-between"><h2 className="font-serif text-3xl text-[#24150E]">Reserva</h2><button type="button" onClick={onClose} className="cursor-pointer rounded-full p-2 text-[#24150E] transition-colors hover:bg-[#EAD7BC]/50" aria-label="Cerrar reserva"><FiX /></button></div>
    <div className="mt-6 space-y-2 text-sm text-[#7C604F]"><p>{date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p><p>Estado: <strong>{getAppointmentStatusLabel(appointment.status)}</strong></p><p>Profesional: <strong>{appointment.employee_name}</strong></p><p>Horario: <strong>{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(appointment.ends_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</strong></p></div>
    <section className="mt-6 border-t border-[#EAD7BC] pt-5"><div className="flex justify-between"><h3 className="font-serif text-xl">Resumen</h3><span>{date.toLocaleDateString('es-ES')}</span></div><p className="mt-3 font-semibold">{appointment.service_name}</p><p>Profesional: {appointment.employee_name}</p><div className="mt-4 flex justify-between font-semibold"><span>Total</span><span>{appointment.service_price !== undefined && appointment.service_price !== null ? `$${appointment.service_price}` : 'A confirmar'}</span></div></section>
    <div className="mt-5 flex gap-3 rounded-xl bg-[#EAD7BC]/40 p-3 text-sm"><FiAlertTriangle className="shrink-0" />El precio puede variar según el servicio realizado.</div><div className="mt-5 grid grid-cols-2 gap-3"><button type="button" disabled className="flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#EAD7BC] p-3 text-left text-sm opacity-60"><FiCalendar />Agregar al calendario</button><button type="button" className="cursor-pointer flex items-center gap-2 rounded-xl border border-[#EAD7BC] p-3 text-left text-sm transition-colors hover:bg-[#EAD7BC]/40"><FiMapPin />Ver mapa</button></div>
    {showActions && <div className="mt-6 flex gap-3">
      <button type="button" onClick={() => onUpdate('cancelled')} className="btn-skew-transparent cursor-pointer flex-1 rounded-full border border-red-300 py-3 text-red-700" style={{ '--btn-hover-bg': '#FEE2E2', '--btn-hover-text': '#B91C1C' } as React.CSSProperties}><span>Cancelar cita</span></button>
      <button type="button" onClick={() => onUpdate('confirmed')} className="btn-skew-anim cursor-pointer flex-1 rounded-full" style={{ '--btn-bg': '#24150E', '--btn-hover-bg': '#C59A45', '--btn-text': '#FAF7F2', '--btn-hover-text': '#FAF7F2' } as React.CSSProperties}><span>Confirmar cita</span></button>
    </div>}
  </div></div>;
}

export default function AppointmentsPage({ isModal = false }: { isModal?: boolean }) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]); const [selected, setSelected] = useState<ClientAppointment | null>(null); const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  useEffect(() => { appointmentService.getClientAppointments().then(setAppointments).catch(() => setAppointments([])); }, []);
  const visible = appointments.filter((a) => tab === 'upcoming' ? !['completed', 'cancelled'].includes(a.status) : ['completed', 'cancelled'].includes(a.status));
  const update = async (status: 'confirmed' | 'cancelled') => {
    if (!selected) return;
    try {
      const updated = await appointmentService.updateClientAppointmentStatus(selected.id, status);
      setAppointments((all) => all.map((a) => a.id === selected.id ? updated : a));
      setSelected(null);
    } catch {
      // Mantener el modal abierto para que el usuario pueda reintentar.
    }
  };
  const content = <main className="min-h-screen bg-[#FAF7F2]"><Navbar /><div className="mx-auto max-w-5xl px-6 pb-20 pt-32"><div className="mb-6 flex items-center justify-between"><h1 className="font-serif text-5xl text-[#24150E]">Tus reservas</h1><button type="button" onClick={() => router.push('/appointments/new')} className="btn-skew-transparent cursor-pointer rounded-full border border-[#24150E] p-3 text-[#24150E] transition-transform active:scale-95" style={{ '--btn-hover-bg': '#C59A45', '--btn-text': '#24150E', '--btn-hover-text': '#24150E' } as React.CSSProperties} aria-label="Nueva reserva" title="Nueva reserva"><FiPlus className="h-5 w-5" /></button></div><div className="mt-8 flex gap-6 border-b border-[#EAD7BC]"><button type="button" onClick={() => setTab('upcoming')} className={`cursor-pointer border-b-2 pb-3 transition-colors hover:text-[#C59A45] ${tab === 'upcoming' ? 'border-[#C59A45]' : 'border-transparent'}`}>Próximas</button><button type="button" onClick={() => setTab('history')} className={`cursor-pointer border-b-2 pb-3 transition-colors hover:text-[#C59A45] ${tab === 'history' ? 'border-[#C59A45]' : 'border-transparent'}`}>Historial</button></div><div className="mt-8 space-y-4">{visible.map((a) => <button type="button" key={a.id} onClick={() => setSelected(a)} className="btn-skew-transparent w-full cursor-pointer rounded-2xl bg-white p-5 text-left shadow-sm" style={{ '--btn-hover-bg': '#EAD7BC', '--btn-text': '#24150E', '--btn-hover-text': '#24150E' } as React.CSSProperties}><div className="flex justify-between"><strong>{a.service_name}</strong><span className={`rounded-full px-3 py-1 text-xs font-semibold ${getAppointmentStatusClass(a.status)}`}>{getAppointmentStatusLabel(a.status)}</span></div><p className="mt-2 text-sm text-[#7C604F]">{new Date(a.scheduled_at).toLocaleString('es-ES')} · {a.employee_name}</p><p className="mt-1 text-sm font-semibold text-[#C59A45]">{a.service_price !== undefined && a.service_price !== null ? `$${a.service_price}` : 'Precio a confirmar'}</p></button>)}{visible.length === 0 && <p className="text-[#7C604F]">No tienes reservas en esta sección.</p>}</div></div>{selected && <AppointmentModal appointment={selected} onClose={() => setSelected(null)} onUpdate={update} showActions={tab === 'upcoming' && !['completed', 'cancelled'].includes(selected.status)} />}</main>;
  if (!isModal) return content;
  return <div className="fixed inset-0 z-40 overflow-y-auto bg-black/20" onClick={() => router.back()}><div onClick={(event) => event.stopPropagation()}>{content}</div></div>;
}

