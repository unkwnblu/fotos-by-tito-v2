"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getBookings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return data;
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();

  // Validate status
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid status" };
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating booking:", error);
    return { error: "Failed to update status" };
  }

  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function getFinancialStats() {
  const supabase = await createClient();

  // Fetch all bookings for stats
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("status, package_price");

  if (error) {
    console.error("Error fetching financial stats:", error);
    return { profit: 0, unsettled: 0, total_bookings: 0 };
  }

  let profit = 0;
  let unsettled = 0;
  const total_bookings = bookings.length;

  bookings.forEach((booking) => {
    // Parse price string, e.g. "€165" -> 165
    const priceString = booking.package_price.replace(/[^0-9.]/g, "");
    const price = parseFloat(priceString) || 0;

    if (booking.status === "completed") {
      profit += price;
    } else if (booking.status === "confirmed") {
      unsettled += price;
    }
  });

  return { profit, unsettled, total_bookings };
}
