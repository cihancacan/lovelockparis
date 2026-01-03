import { createClient } from '@supabase/supabase-js';

// On utilise les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Création du client Supabase unique
export const supabase = createClient(supabaseUrl, supabaseAnonKey);