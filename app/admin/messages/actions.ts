"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMessages() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return data;
}

export async function markMessageAsRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ status: "read" })
    .eq("id", id);

  if (error) {
    console.error("Error updating message:", error);
    return { error: "Failed to mark as read" };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("messages").delete().eq("id", id);

  if (error) {
    console.error("Error deleting message:", error);
    return { error: "Failed to delete message" };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
