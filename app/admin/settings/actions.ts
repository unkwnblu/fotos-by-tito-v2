"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createStatelessClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Fetch all profiles (admins)
export async function getAdmins() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admins:", error);
    return [];
  }
  return data;
}

// Step 1: Send OTP to the new email
export async function sendAdminOtp(email: string) {
  const supabase = await createClient();

  // We use signInWithOtp.
  // Note: If user exists, it sends login code. If strictly new, it sends signup code.
  // Supabase handles this transparently usually.
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// Step 2: Verify OTP and Promote to Admin
export async function verifyAndCreateAdmin(email: string, token: string) {
  // Use a stateless client to avoid messing with the *current* admin's session cookies
  // We need to use explicit environment variables here
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createStatelessClient(supabaseUrl, supabaseKey);

  // 1. Verify the OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user) {
    return { error: error?.message || "Verification failed" };
  }

  // 2. The user is now verified/created in auth system.
  // We need to update their profile role to 'admin'.
  // But we can't do it with the *stateless* client because of RLS (stateless client is anon).
  // We must switch back to the *current admin's* authenticated client to update the profile.

  const adminClient = await createClient();

  // Update the NEW user's profile.
  // Note: The Trigger matches auth.users -> public.profiles on insert.
  // So the profile should exist now (or reasonably soon).

  const { error: updateError } = await adminClient
    .from("profiles")
    .update({ role: "admin", email: email }) // Ensure email is synced
    .eq("id", data.user.id);

  if (updateError) {
    // Retry? Or maybe profile creation lagged slightly?
    // In a real app we might need a small delay or upsert.
    // Let's try upsert to be safe if trigger failed/lagged
    const { error: upsertError } = await adminClient
      .from("profiles")
      .upsert({ id: data.user.id, email: email, role: "admin" });

    if (upsertError) {
      return {
        error:
          "Verified, but failed to promote to admin: " + upsertError.message,
      };
    }
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

// Delete/Remove Admin
export async function removeAdmin(id: string) {
  const supabase = await createClient();

  // We can't delete from auth.users easily without Service Role.
  // But we can downgrade their role in profiles or delete the profile.

  // Delete profile (cascade might not delete auth user depending on setup, but typically we want to just remove access)
  // If we delete profile, and they log in, they might have no profile?
  // Let's just update role to 'user' or delete the row.
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    return { error: "Failed to remove admin" };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

// Update Display Name
export async function updateDisplayName(userId: string, displayName: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", userId);

  if (error) {
    return { error: "Failed to update display name" };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}
