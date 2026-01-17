import { getBookings } from "./actions";
import { BookingList } from "@/components/admin/booking-list";

export const revalidate = 0; // Dynamic

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold">Bookings</h1>
        <p className="text-muted-foreground">
          Manage your incoming booking requests.
        </p>
      </div>

      <BookingList initialBookings={bookings || []} />
    </div>
  );
}
