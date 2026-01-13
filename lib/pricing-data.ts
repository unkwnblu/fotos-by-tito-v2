export interface PricingPackage {
  name: string;
  price: string;
  features: string[];
}

export interface PricingCategory {
  title: string;
  description: string;
  tabs: string[];
  packages: Record<string, PricingPackage[]>;
}

export const pricingData: Record<string, PricingCategory> = {
  "family-maternity": {
    title: "FAMILY & MATERNITY",
    description:
      "Aenean sapien molestie nec dui congue. In lectus a vulputate urna. Proin viverra facilisis interdum ipsum tincidunt nec. Fermentum aenean lacus imperdiet maecenas interdum commodo quam quis. Donec mauris mauris eu vulputate mi nullam enim. Leo sed vulputate viverra dictum maecenas.",
    tabs: ["FAMILY", "MATERNITY", "BIRTHDAY", "LIFESTYLE"],
    packages: {
      FAMILY: [
        {
          name: "Individual Session",
          price: "$250",
          features: [
            "IDEAL FOR CAPTURING YOUR UNIQUE PERSONALITY AND STYLE.",
            "INCLUDES A 2-HOUR PHOTOSHOOT AND 20 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Family Session",
          price: "$400",
          features: [
            "PERFECT FOR CREATING LASTING MEMORIES WITH YOUR LOVED ONES.",
            "INCLUDES A 3-HOUR PHOTOSHOOT AND 30 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Couple Session",
          price: "$300",
          features: [
            "CELEBRATE YOUR LOVE STORY WITH AN INTIMATE PHOTOSHOOT.",
            "INCLUDES A 2.5-HOUR PHOTOSHOOT AND 25 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
      ],
      MATERNITY: [
        {
          name: "Maternity Standard",
          price: "$350",
          features: [
            "CAPTURE THE GLOW OF MOTHERHOOD.",
            "INCLUDES A 2-HOUR PHOTOSHOOT AND 20 IMAGES.",
            "WARDROBE CONSULTATION INCLUDED.",
          ],
        },
      ],
      BIRTHDAY: [
        {
          name: "Birthday Bash",
          price: "$300",
          features: [
            "FUN AND FESTIVE BIRTHDAY SHOOT.",
            "INCLUDES CAKE SMASH OR STANDARD PORTRAITS.",
            "20 EDITED HIGH-RES IMAGES.",
          ],
        },
      ],
      LIFESTYLE: [
        {
          name: "Lifestyle Home",
          price: "$450",
          features: [
            "RELAXED IN-HOME SESSION.",
            "CAPTURE REAL MOMENTS IN YOUR SPACE.",
            "40 EDITED IMAGES INCLUDED.",
          ],
        },
      ],
    },
  },
  newborn: {
    title: "NEW BORN",
    description:
      "Capturing the delicate early days of life with softness and care.",
    tabs: ["SESSIONS"],
    packages: {
      SESSIONS: [
        {
          name: "Individual Session",
          price: "$250",
          features: [
            "IDEAL FOR CAPTURING YOUR UNIQUE PERSONALITY AND STYLE.",
            "INCLUDES A 2-HOUR PHOTOSHOOT AND 20 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Family Session",
          price: "$400",
          features: [
            "PERFECT FOR CREATING LASTING MEMORIES WITH YOUR LOVED ONES.",
            "INCLUDES A 3-HOUR PHOTOSHOOT AND 30 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Couple Session",
          price: "$300",
          features: [
            "CELEBRATE YOUR LOVE STORY WITH AN INTIMATE PHOTOSHOOT.",
            "INCLUDES A 2.5-HOUR PHOTOSHOOT AND 25 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
      ],
    },
  },
  "portraits-headshots": {
    title: "PORTRAITS & HEADSHOTS",
    description:
      "Professional headshots and creative portraits to elevate your personal brand.",
    tabs: ["SESSIONS"],
    packages: {
      SESSIONS: [
        {
          name: "Individual Session",
          price: "$250",
          features: [
            "IDEAL FOR CAPTURING YOUR UNIQUE PERSONALITY AND STYLE.",
            "INCLUDES A 2-HOUR PHOTOSHOOT AND 20 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Family Session",
          price: "$400",
          features: [
            "PERFECT FOR CREATING LASTING MEMORIES WITH YOUR LOVED ONES.",
            "INCLUDES A 3-HOUR PHOTOSHOOT AND 30 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
        {
          name: "Couple Session",
          price: "$300",
          features: [
            "CELEBRATE YOUR LOVE STORY WITH AN INTIMATE PHOTOSHOOT.",
            "INCLUDES A 2.5-HOUR PHOTOSHOOT AND 25 PROFESSIONALLY EDITED IMAGES.",
            "ADDITIONAL IMAGES CAN BE PURCHASED AT $10 EACH.",
          ],
        },
      ],
    },
  },
};
