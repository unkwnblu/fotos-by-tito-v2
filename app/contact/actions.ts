"use server";

import { createClient } from "@/utils/supabase/server";

export type ContactState = {
  message?: string;
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const supabase = await createClient();

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!first_name || !last_name || !email || !message || !subject) {
    return { error: "Please fill in all required fields." };
  }

  try {
    const { error } = await supabase.from("messages").insert({
      first_name,
      last_name,
      email,
      phone,
      subject,
      message,
    });

    if (error) {
      console.error("Supabase Error:", error);
      return { error: "Failed to send message. Please try again." };
    }

    return {
      success: true,
      message: "Message sent! I'll get back to you soon.",
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return { error: "Something went wrong. Please try again later." };
  }
}
