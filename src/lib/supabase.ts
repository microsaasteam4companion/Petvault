import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Auth and database features will not work until they are set.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Pet {
  id: string;
  user_id: string;
  name: string;
  breed?: string;
  age?: number;
  gender?: string;
  weight?: number;
  photo_url?: string;
  microchip_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TimelineEntry {
  id: string;
  pet_id: string;
  category: 'vaccine' | 'illness' | 'food' | 'weight' | 'behavior' | 'vet_visit' | 'other';
  title: string;
  description: string;
  date: string;
  metadata?: {
    weight_value?: number;
    vet_name?: string;
    tags?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  entry_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
}
