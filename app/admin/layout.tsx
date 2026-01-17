import { Laptop } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile restricted view */}
      <div className="md:hidden flex flex-col items-center justify-center h-screen bg-background p-8 text-center space-y-4">
        <div className="p-4 bg-muted/50 rounded-full">
          <Laptop className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Desktop View Recommended</h2>
        <p className="text-muted-foreground max-w-xs">
          For the best experience, please access the admin dashboard on a
          desktop or laptop computer.
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen bg-background">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container mx-auto p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </>
  );
}
