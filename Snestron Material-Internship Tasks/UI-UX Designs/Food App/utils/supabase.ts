// Supabase client setup
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './supabase/info';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          items: any;
          total: number;
          status: string;
          delivery_address: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          items: any;
          total: number;
          status: string;
          delivery_address: string;
        };
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
    };
  };
}