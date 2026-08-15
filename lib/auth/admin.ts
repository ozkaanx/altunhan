import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      success: false as const,
      supabase,
      message: "Bu işlem için yönetici girişi yapmanız gerekiyor.",
    };
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean) ?? [];

  const email = user.email?.trim().toLowerCase();

  if (!email || !adminEmails.includes(email)) {
    return {
      success: false as const,
      supabase,
      message: "Bu kullanıcı yönetici yetkisine sahip değil.",
    };
  }

  return {
    success: true as const,
    supabase,
    user,
  };
}
