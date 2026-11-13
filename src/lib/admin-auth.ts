import { redirect } from "next/navigation";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect("/admin/login?setup=required");

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") redirect("/admin/login");

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !admin) redirect("/admin/login?denied=1");
  return { supabase, userId };
}