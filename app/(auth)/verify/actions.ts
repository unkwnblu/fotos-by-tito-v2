"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function verifyOtp(
  prevState: { error: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const token = formData.get("code") as string;

  // Using 'signup' type for initial registration verification
  // If this page is also used for login magic links, we might need to adjust logic
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email", // 'email' is safer as it covers both signup and subsequent logins if needed, or specifically 'signup'
  });

  // 'signup' type is specifically for the first time verification.
  // However, often 'email' type works generally for magic links / OTPs.
  // Let's try 'signup' first if strictly for registration flow, or 'email' if generic.
  // The user prompt said "requires verification via OTP" which commonly implies the signup flow.
  // Let's stick to 'email' as it is more versatile or fallback to signup if needed.
  // Actually, for Supabase "Email OTP" (not link), type is usually 'email'.
  // If it's a link clicking, it's different. Assuming entering a 6-digit code.

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}
