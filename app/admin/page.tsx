"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { UploadWidget } from "@/components/admin/upload-widget";
import { RecentBookingsWidget } from "@/components/admin/recent-bookings-widget";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    }
    getUser();
  }, [supabase]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {userEmail?.split("@")[0] || "Admin"}. Here's what's
            happening today.
          </p>
        </div>
        <div className="text-sm font-medium bg-muted/50 px-4 py-2 rounded-full border">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      {/* Stats Row */}
      <DashboardStats />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Upload) */}
        <div className="lg:col-span-2 min-h-[500px]">
          <UploadWidget />
        </div>

        {/* Right Column (Recent Bookings & Other Widgets) */}
        <div className="space-y-8">
          <RecentBookingsWidget />

          {/* Placeholder for future widgets like "Quick Links" or "System Status" */}
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="/admin/photos"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Manage All Photos &rarr;
              </a>
              <a
                href="/admin/categories"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Edit Categories &rarr;
              </a>
              <a
                href="/admin/settings"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                System Settings &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
