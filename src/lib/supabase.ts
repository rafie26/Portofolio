import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

export function publicClient() {
  if (!url || !anonKey) throw new Error("Supabase env tidak dikonfigurasi");
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export function adminClient() {
  if (!url || !serviceKey) throw new Error("Supabase env tidak dikonfigurasi");
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}
