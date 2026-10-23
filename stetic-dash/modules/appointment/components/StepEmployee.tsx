'use client';

import { FiUser } from 'react-icons/fi';
import type { Employee } from '@/services/appointment.service';

interface Props { employees: Employee[]; selectedEmployee: Employee | null; onSelect: (employee: Employee) => void; onNext: () => void; }

export function StepEmployee({ employees, selectedEmployee, onSelect, onNext }: Props) {
  return <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
    <div className="text-center mb-8"><span className="text-xs uppercase tracking-widest text-[var(--accent)]">Paso 2</span><h1 className="text-3xl font-serif mt-2">Elegir profesional</h1><p className="text-sm text-[var(--text-secondary)] mt-2">Selecciona quién realizará tu servicio.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((employee) => <button key={employee.id} type="button" onClick={() => onSelect(employee)} className={`p-5 rounded-2xl border-2 text-left transition-all ${selectedEmployee?.id === employee.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--accent-border)] bg-white hover:border-[var(--accent)]'}`}><FiUser className="w-7 h-7 text-[var(--accent)] mb-3" /><span className="font-serif text-lg">{employee.name}</span></button>)}
    </div>
    <button type="button" disabled={!selectedEmployee} onClick={onNext} className="mt-8 w-full py-3 rounded-full bg-[var(--accent)] text-white disabled:opacity-50">Continuar</button>
  </div>;
}
