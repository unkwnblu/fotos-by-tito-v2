"use server";

import { createClient } from "@/utils/supabase/server";

export type ContactState = {
  message?: string;
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  prevState: ContactState,
  formData: FormData,
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

    // Send Email via Resend
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "FotosByTito Admin <onboarding@resend.dev>",
        to: "fotosbytito@gmail.com",
        subject: "New Notification from Site",
        html: `
          <h1>New Message from ${first_name} ${last_name}</h1>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
    } catch (emailError) {
      console.error("Resend Error:", emailError);
      // We don't fail the request if email fails, as DB save was successful
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
