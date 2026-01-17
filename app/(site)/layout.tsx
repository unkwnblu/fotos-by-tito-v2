import { LayoutWrapper } from "@/components/layout-wrapper";
import { ScrollToTop } from "@/components/scroll-to-top";
import { createClient } from "@/utils/supabase/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }

  return (
    <LayoutWrapper user={user} role={role}>
      {children}
      <ScrollToTop />
    </LayoutWrapper>
  );
}
