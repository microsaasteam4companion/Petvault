export interface Profile {
  id: string;
  plan_type: 'basic' | 'pro';
  subscription_status: 'active' | 'inactive';
  subscription_start_date?: any;
  subscription_end_date?: any;
  timezone?: string;
  created_at?: any;
  updated_at?: any;
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
  created_at: any;
  updated_at: any;
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
  created_at: any;
  updated_at: any;
}

export interface FileEntry {
  id: string;
  entry_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
  file_size: number;
  uploaded_at: any;
}
