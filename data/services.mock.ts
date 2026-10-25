export interface ServiceItem {
  id: string;
  title: string;
  category: 'nails' | 'eyes' | 'spa';
  iconType: 'nail' | 'eye' | 'spa';
  imageUrl: string;
  description?: string;
  duration?: string;
  price?: number | string;
}

export const MOCK_SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'Esmaltado Tradicional',
    category: 'nails',
    iconType: 'nail',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
    description: 'Manicura clásica con acabado brillante y cuidado integral de cutículas.',
    duration: '45 min',
  },
  {
    id: '2',
    title: 'Esmaltado Permanente',
    category: 'nails',
    iconType: 'nail',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=800&auto=format&fit=crop',
    description: 'Color impecable de larga duración con secado UV/LED de alta tecnología.',
    duration: '60 min',
  },
  {
    id: '3',
    title: 'Kapping Gel',
    category: 'nails',
    iconType: 'nail',
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=800&auto=format&fit=crop',
    description: 'Capa protectora de gel para fortalecer y permitir el crecimiento de tu uña natural.',
    duration: '75 min',
  },
  {
    id: '4',
    title: 'Soft Gel Nails',
    category: 'nails',
    iconType: 'nail',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
    description: 'Extensiones ligeras, flexibles y naturales con acabado de autor.',
    duration: '90 min',
  },
  {
    id: '5',
    title: 'Laminado de Cejas',
    category: 'eyes',
    iconType: 'eye',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=800&auto=format&fit=crop',
    description: 'Diseño, fijación y nutrición para cejas definidas, tupidas y ordenadas.',
    duration: '50 min',
  },
  {
    id: '6',
    title: 'Lifting de Pestañas',
    category: 'eyes',
    iconType: 'eye',
    imageUrl: 'https://images.unsplash.com/photo-1583001809873-a128495da465?q=80&w=800&auto=format&fit=crop',
    description: 'Curvatura natural y tinte nutritivo para una mirada profunda y abierta.',
    duration: '60 min',
  },
  {
    id: '7',
    title: 'Manicura Rusa',
    category: 'nails',
    iconType: 'nail',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=800&auto=format&fit=crop',
    description: 'Técnica de precisión milimétrica con torno para una limpieza impecable.',
    duration: '70 min',
  },
  {
    id: '8',
    title: 'Spa de Manos & Nutrición',
    category: 'spa',
    iconType: 'spa',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
    description: 'Exfoliación suave, mascarilla hidratante profunda y masaje relajante.',
    duration: '40 min',
  },
];
