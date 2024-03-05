import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // global: {
  //   headers: { "x-my-custom-header": "my-app-name" },
  // },
};
export const supabaseClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  options
);