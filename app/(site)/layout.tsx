import { LayoutWrapper } from "@/components/layout-wrapper";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper>
      {children}
      <ScrollToTop />
    </LayoutWrapper>
  );
}
