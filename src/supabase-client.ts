import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

export const supabase = createClient(
  supabaseUrl,
  VITE_SUPABASE_API_KEY
);
