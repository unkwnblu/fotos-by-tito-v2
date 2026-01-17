import { getPhotosForEachCategory } from "@/lib/photos";
import {
  PricingList,
  PricingOffering,
} from "@/components/pricing/pricing-list";

export const revalidate = 600; // Revalidate every 10 minutes

export default async function PricingPage() {
  // Fetch one representative image for relevant categories
  const categories = await getPhotosForEachCategory(1);

  // Helper to find image by category ID, with fallback
  const getImage = (id: string, fallback: string) => {
    const cat = categories.find((c) => c.id === id);
    if (cat && cat.images.length > 0) {
      return cat.images[0];
    }
    return fallback;
  };

  const offerings: PricingOffering[] = [
    {
      id: "family",
      title: "Family & Milestones",
      subtitle: "Cherished Moments",
      price: "Starting at €165",
      description:
        "From growing families to joyful celebrations, these sessions are designed to capture connection, personality, and the moments you’ll want to remember years from now.",
      features: [
        "Relaxed & Fun",
        "No Stiff Posing",
        "Families, Birthdays, Maternity",
        "Professional Editing",
      ],
      image: getImage(
        "family-milestones",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
      ),
      link: "/pricing/family-maternity",
    },
    {
      id: "newborn",
      title: "Newborns",
      subtitle: "Tiny Beginnings",
      price: "Starting at €250",
      description:
        "Gentle, unhurried sessions focused on your baby’s earliest days — with comfort, safety, and simplicity at the heart of every shoot.",
      features: [
        "Baby-led Pace",
        "Comfort & Safety First",
        "In-home Sessions",
        "Timeless Edits",
      ],
      image: getImage(
        "newborns",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop"
      ),
      link: "/pricing/newborn",
    },
    {
      id: "portraits",
      title: "Portraits & Headshots",
      subtitle: "Boldly You",
      price: "Starting at €100",
      description:
        "Clean, professional portraits that reflect who you are — whether for work, personal branding, or simply celebrating yourself.",
      features: [
        "Professional Guidance",
        "Personal Branding",
        "LinkedIn & Websites",
        "Confidence Boosting",
      ],
      image: getImage(
        "portraits",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
      ),
      link: "/pricing/portraits-headshots",
    },
  ];

  return <PricingList offerings={offerings} />;
}
