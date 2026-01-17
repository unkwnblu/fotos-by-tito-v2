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
  formData: FormData
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
    return { success: true, message: "Booking request sent successfully!" };
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "An unexpected error occurred." };
  }
}
