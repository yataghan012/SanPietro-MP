import { createClient } from '@supabase/supabase-js';

// Provide fallback values to prevent the app from crashing on startup 
// if the environment variables haven't been configured yet.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocfyoxyuhqlrfigcvagn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_uSxOsLXaoCm2Rs9iF9yi_w_clGO5Kqj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
