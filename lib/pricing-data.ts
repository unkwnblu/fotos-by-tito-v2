export interface PricingPackage {
  name: string;
  price: string;
  features: string[];
}

export interface PricingCategory {
  title: string;
  description: string;
  image: string;
  tabs: string[];
  packages: Record<string, PricingPackage[]>;
}

export const pricingData: Record<string, PricingCategory> = {
  "family-maternity": {
    title: "FAMILY & MILESTONES",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    description:
      "For the moments that mark your story.\n\nThese sessions are relaxed, fun, and guided — perfect for families, birthdays, maternity, and all the in-between moments worth remembering.\n\nNo stiff posing. Just real interaction and gentle direction.",
    tabs: ["SESSIONS"],
    packages: {
      SESSIONS: [
        {
          name: "🌿 Mini Session",
          price: "€165",
          features: [
            "45 minutes focused session",
            "Perfect for small families, birthdays, maternity",
            "12 professionally edited images",
          ],
        },
        {
          name: "⭐ Standard Session",
          price: "€275",
          features: [
            "75 minutes relaxed session",
            "Full family stories, more variety, more breathing room",
            "30 professionally edited images",
          ],
        },
        {
          name: "✨ Premium Session",
          price: "€375",
          features: [
            "120 minutes unhurried session",
            "Captures the full story with time for play & connection",
            "All edited images (approx. 40–60) + priority delivery",
          ],
        },
      ],
    },
  },
  newborn: {
    title: "NEWBORNS",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    description:
      "Tiny details. Big love.\n\nNewborn sessions are calm, baby-led, and never rushed. We follow your baby’s pace, allowing time for feeding, soothing, and cuddles.\n\nSafety and comfort are always the priority.",
    tabs: ["SESSIONS"],
    packages: {
      SESSIONS: [
        {
          name: "🍼 Newborn Classic",
          price: "€250",
          features: [
            "Up to 2-hour baby-led session",
            "Best within the first 14 days",
            "20 carefully edited images",
          ],
        },
        {
          name: "⭐ Newborn Complete",
          price: "€345",
          features: [
            "Up to 3-hour relaxed session",
            "More time for feeding, soothing & cuddles",
            "35 professionally edited images",
          ],
        },
        {
          name: "✨ Newborn Luxe",
          price: "€450",
          features: [
            "Up to 3-hour unhurried session",
            "All edited images (approx. 40–60) + priority delivery",
          ],
        },
      ],
    },
  },
  "portraits-headshots": {
    title: "PORTRAITS & HEADSHOTS",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop",
    description:
      "Images that speak before you do.\n\nWhether for professional use or personal milestones, these sessions are designed to help you look confident, approachable, and authentically you.\n\nPerfect for LinkedIn, websites, and personal branding.",
    tabs: ["SESSIONS"],
    packages: {
      SESSIONS: [
        {
          name: "🔹 Essential Portrait",
          price: "€100",
          features: [
            "45-minute session",
            "1 outfit",
            "7 professionally edited images",
          ],
        },
        {
          name: "⭐ Signature Portrait",
          price: "€150",
          features: [
            "60-minute session",
            "Up to 2 outfits",
            "12 professionally edited images",
          ],
        },
        {
          name: "✨ Brand Story Portrait",
          price: "€240",
          features: [
            "90-minute session",
            "Maximum of 3 outfits",
            "All edited images (approx. 20–30) + priority delivery",
          ],
        },
      ],
    },
  },
};
