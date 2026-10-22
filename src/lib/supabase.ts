import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured && !import.meta.env.DEV) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || 'http://127.0.0.1:54321',
  supabaseAnonKey || 'local-preview-placeholder-key',
);

export interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  sender_address: string;
  recipient_name: string;
  recipient_email: string;
  recipient_phone: string;
  recipient_address: string;
  package_type: string;
  package_weight: number;
  package_dimensions: string;
  declared_value: number;
  service_type: string;
  status: string;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  price: number;
  notes: string;
  extra_info: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string;
  description: string;
  event_time: string;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

export interface PriceQuote {
  id?: string;
  email: string;
  origin: string;
  destination: string;
  package_type: string;
  weight: number;
  service_type: string;
  quoted_price: number;
  created_at?: string;
}
