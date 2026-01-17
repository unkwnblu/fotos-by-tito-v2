import { getAdmins } from "./actions";
import { SettingsManager } from "@/components/admin/settings-manager";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-serif font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Manage system access and configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SettingsManager initialAdmins={admins || []} />
        </div>

        <div className="space-y-6">
          <div className="bg-card border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">Application Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment</span>
                <span className="font-mono">{process.env.NODE_ENV}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Developed by Blu Devs <br />
                  Protected by Supabase Auth & RLS. <br />
                  Timezone: UTC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
