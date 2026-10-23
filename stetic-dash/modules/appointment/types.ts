import { ServiceItem } from "@/data/services.mock";

export type BookingStep = 1 | 2 | 3;

export type ServiceCategoryKey = 'all' | 'nails' | 'eyes' | 'spa';

export interface BookingState {
  step: BookingStep;
  selectedService: ServiceItem | null;
  selectedEmployee: { id: number | string; name: string } | null;
  selectedDate: string | null; // ISO string YYYY-MM-DD
  selectedTime: string | null; // e.g. "10:30"
  clientName: string;
  clientPhone: string;
  clientNotes: string;
  isConfirmed: boolean;
}
