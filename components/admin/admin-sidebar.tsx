"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  Image as ImageIcon,
  FolderOpen, // Added FolderOpen
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/photos", label: "Photos", icon: ImageIcon },
    { href: "/admin/categories", label: "Categories", icon: FolderOpen }, // Added Categories
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold font-serif">FotosByTito</span>
        <span className="ml-2 text-xs font-mono bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
          ADMIN
        </span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
