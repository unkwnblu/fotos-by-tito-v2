"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  package_name: string;
  package_price: string;
  category_title: string;
  status: string;
}

const statusColors: Record<string, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CalendarCheck,
  cancelled: XCircle,
};

export function BookingList({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    const result = await updateBookingStatus(id, newStatus);

    if (result.error) {
      toast.error(result.error);
      // Revert on error (could fetch fresh data here instead)
      setBookings(initialBookings);
    } else {
      toast.success(`Booking marked as ${newStatus}`);
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm text-left">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Date
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Client
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Package
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Details
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const StatusIcon = statusIcons[booking.status] || Clock;
                return (
                  <tr
                    key={booking.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {format(new Date(booking.created_at), "MMM d, yyyy")}
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(booking.created_at), "h:mm a")}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-semibold">{booking.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {booking.email}
                      </div>
                      {booking.phone && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {booking.phone}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium">{booking.package_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {booking.category_title} • {booking.package_price}
                      </div>
                    </td>
                    <td className="p-4 align-middle max-w-[200px]">
                      {booking.message ? (
                        <p
                          className="truncate text-xs text-muted-foreground"
                          title={booking.message}
                        >
                          {booking.message}
                        </p>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">
                          -
                        </span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          statusColors[booking.status] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {booking.status}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(booking.id, "pending")
                            }
                          >
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                          >
                            Mark as Confirmed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(booking.id, "completed")
                            }
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(booking.id, "cancelled")
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            Mark as Cancelled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
