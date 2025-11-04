// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// For Vite, environment variables must be prefixed with VITE_ and accessed via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Check if they exist
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = `
  ❌ Supabase URL or Anon Key is missing.
  Make sure these are defined in your .env.local file:

  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  `;
  console.error(errorMessage);
  throw new Error(errorMessage);
}

// ✅ Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
