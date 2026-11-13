"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function signInAdmin(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=required");

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || email.length > 254 || password.length > 1024) redirect("/admin/login?error=invalid");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) redirect("/admin/login?error=invalid");

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?denied=1");
  }

  redirect("/admin");
}

export async function signOutAdmin() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}