"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Memastikan user yang sedang login sudah ada di tabel public.users.
 * Jika belum ada (misal trigger gagal), otomatis insert.
 * Mengembalikan user auth atau null jika tidak login.
 */
export async function ensurePublicUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Cek apakah sudah ada di public.users
  const { data: existingUser } = await supabase
    .from("users")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!existingUser) {
    // Belum ada, insert manual
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        user_id: user.id,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        role: "user",
      });

    if (insertError) {
      console.error("Auto-create public user failed:", insertError);
      // Jangan return null — user tetap authenticated, hanya public.users yang gagal
    }
  }

  return user;
}
