"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type BookingState = {
  message?: string;
  success?: boolean;
  error?: string;
};

export async function createBooking(
  prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const package_name = formData.get("package_name") as string;
  const package_price = formData.get("package_price") as string;
  const category_title = formData.get("category_title") as string;

  if (!name || !email || !package_name || !category_title) {
    return { error: "Missing required fields" };
  }

  try {
    const { error } = await supabase.from("bookings").insert({
      name,
      email,
      phone,
      message,
      package_name,
      package_price,
      category_title,
      status: "pending",
    });

    if (error) {
      console.error("Supabase booking error:", error);
      return { error: "Failed to create booking. Please try again." };
    }

    revalidatePath("/admin/bookings");

    // Send Email via Resend
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "FotosByTito Admin <onboarding@resend.dev>",
        to: "fotosbytito@gmail.com",
        subject: `New Booking Request: ${package_name}`,
        html: `
          <h1>New Booking Request</h1>
          <p><strong>Package:</strong> ${package_name} (${category_title})</p>
          <p><strong>Price:</strong> ${package_price}</p>
          <hr />
          <p><strong>Client Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Message:</strong></p>
          <p>${message || "No message provided."}</p>
        `,
      });
    } catch (emailError) {
      console.error("Resend Booking Notification Error:", emailError);
      // Don't fail the booking if email fails
    }

    return { success: true, message: "Booking request sent successfully!" };
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "An unexpected error occurred." };
  }
}
