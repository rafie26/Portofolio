"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, isAuthenticated, verifyPassword } from "@/lib/auth";
import { adminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { ContentData } from "@/lib/content";

export async function loginAction(_prev: { error: string }, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const ok = await verifyPassword(password);

  if (!ok) {
    return { error: "Password salah." };
  }

  await createSession();
  redirect("/rafi/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/rafi");
}

export async function saveContentAction(data: ContentData): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthenticated())) return { ok: false, error: "Tidak terautentikasi." };
  if (!isSupabaseConfigured()) return { ok: false, error: "Supabase belum dikonfigurasi." };

  const supabase = adminClient();
  const { error } = await supabase
    .from("portfolio_content")
    .upsert({ id: 1, data: data as unknown as object, updated_at: new Date().toISOString() });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
