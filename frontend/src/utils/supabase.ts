import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types'; // Assuming we generate types later, but we can use 'any' for now or omit it.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
