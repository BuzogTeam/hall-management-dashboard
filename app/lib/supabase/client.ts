import { createClient as supabaseCreateClient } from "@supabase/supabase-js";

export const createClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing!");
  }

  return supabaseCreateClient(supabaseUrl, supabaseAnonKey);
};
