import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const BOOKING_PRICE = 300.0;

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled';
  payment_method: 'pix' | 'cash';
  payment_status: 'pending' | 'paid';
  price: number;
  notes: string | null;
  created_at: string;
}

export type NewBooking = Omit<Booking, 'id' | 'status' | 'created_at' | 'payment_status'>;

// Arena schedule — returns available slots for a given date
// Monday–Friday (1–5): 17:00–20:00
// Saturday (6): 13:00–16:00, 16:00–19:00, 19:00–22:00
// Sunday (0): closed

const WEEKDAY_SLOTS = [
  { start: '17:00', end: '20:00' },
];

const SATURDAY_SLOTS = [
  { start: '13:00', end: '16:00' },
  { start: '16:00', end: '19:00' },
  { start: '19:00', end: '22:00' },
];

export function generateTimeSlots(date: Date): { start: string; end: string; label: string }[] {
  const day = date.getDay();
  let raw: { start: string; end: string }[] = [];
  if (day >= 1 && day <= 5) {
    raw = WEEKDAY_SLOTS;
  } else if (day === 6) {
    raw = SATURDAY_SLOTS;
  }
  return raw.map((s) => ({ ...s, label: `${s.start} - ${s.end}` }));
}

export function isArenaOpen(date: Date): boolean {
  const day = date.getDay();
  return day >= 1 && day <= 6;
}

export function formatDateBR(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
