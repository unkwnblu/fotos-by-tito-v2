import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="animate-in fade-in zoom-in duration-500 mb-8 p-6 bg-red-50 dark:bg-red-950/30 rounded-full">
        <ShieldAlert className="w-16 h-16 text-red-600 dark:text-red-400" />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
        Access Denied
      </h1>

      <p className="text-muted-foreground max-w-md text-lg mb-8 leading-relaxed">
        You do not have permission to view this page. This area is restricted to
        administrators only.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Log In as Admin
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
