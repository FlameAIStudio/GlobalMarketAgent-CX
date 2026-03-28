import { DatasetCase } from "@/lib/types";

export const DATASETS: DatasetCase[] = [
  {
    id: "wireless-earbuds-amazon-us",
    keywordTriggers: ["earbuds", "earbud", "wireless buds", "bluetooth earbuds"],
    product: "wireless earbuds",
    region: "US",
    platform: "Amazon",
    report: {
      summary:
        "The US earbuds segment is mature but still growing in the value-premium crossover band. Buyers are highly review-driven and compare battery life, call quality, and comfort before conversion. A focused differentiation on clarity for calls and all-day fit can still carve out space in this crowded category.",
      competitors: [
        {
          name: "SoundCore P30 Lite",
          price: "$39.99",
          rating: 4.4,
          reviews: "12,400",
          features: ["30h battery", "ENC mics", "IPX5", "USB-C fast charge"]
        },
        {
          name: "BeatPulse Air Mini",
          price: "$59.99",
          rating: 4.5,
          reviews: "8,720",
          features: ["Hybrid ANC", "Low-latency mode", "Dual-device connect"]
        },
        {
          name: "NovaPods Pro S",
          price: "$89.00",
          rating: 4.3,
          reviews: "5,360",
          features: ["Adaptive EQ", "Wireless charging", "Companion app"]
        },
        {
          name: "SkyTune OpenFit",
          price: "$109.00",
          rating: 4.2,
          reviews: "3,090",
          features: ["Open-ear comfort", "Multipoint", "Voice assistant wake"]
        }
      ],
      price_analysis: {
        budget: "$19 - $39",
        mid: "$40 - $79",
        premium: "$80 - $149",
        insight:
          "Most volume clusters in the $40-$79 band, where perceived audio quality and microphone performance matter more than niche premium features."
      },
      customer_insights: [
        "Users care most about stable Bluetooth connection and clear call audio in noisy environments.",
        "Common complaints mention weak microphone pickup, ear fatigue after one hour, and inaccurate battery indicators.",
        "Gap opportunity exists for a comfort-first earbuds line with explicit call-quality proof points for remote workers."
      ],
      gtm: {
        positioning:
          "Call-first everyday earbuds with premium comfort at an upper-mid price point.",
        messaging:
          "Lead with call clarity and all-day fit, backed by clear side-by-side proof against best-selling alternatives.",
        channel_strategy:
          "Prioritize Amazon search ads on call-related terms, seed creator reviews on YouTube Shorts, and retarget add-to-cart users with testimonial creatives."
      }
    }
  },
  {
    id: "pet-grooming-brush-tiktok-sea",
    keywordTriggers: ["pet", "groom", "grooming", "brush", "dog brush", "cat brush"],
    product: "pet grooming brush",
    region: "SEA",
    platform: "TikTok",
    report: {
      summary:
        "In SEA, pet grooming tools are strongly impulse-driven on short video commerce platforms. Content that shows visible hair removal in under 5 seconds converts best. Mid-price tools with convenience features can win if creator demos make the utility obvious.",
      competitors: [
        {
          name: "FurAway Slick Brush",
          price: "$7.90",
          rating: 4.6,
          reviews: "4,980",
          features: ["One-click hair release", "Soft needle tips", "Compact size"]
        },
        {
          name: "PawEase Steam Comb",
          price: "$12.50",
          rating: 4.4,
          reviews: "2,340",
          features: ["Light mist spray", "USB charging", "Anti-static mode"]
        },
        {
          name: "PetCloud Pro Deshed",
          price: "$15.90",
          rating: 4.5,
          reviews: "1,760",
          features: ["Dual coat mode", "Curved grip", "Large collection tray"]
        }
      ],
      price_analysis: {
        budget: "$4 - $8",
        mid: "$9 - $14",
        premium: "$15 - $24",
        insight:
          "Conversion peaks in the $9-$14 range when demo content clearly shows less shedding and easier cleanup."
      },
      customer_insights: [
        "Pet owners value painless brushing and quick cleanup after each session.",
        "Negative feedback often points to broken pins, hard-to-clean trays, and fake before/after videos.",
        "There is room for a trust-focused brand that proves durability and real use on both cats and dogs."
      ],
      gtm: {
        positioning:
          "A durable grooming brush designed for stress-free grooming and fast cleanup.",
        messaging:
          "Use proof-led short clips: one swipe, visible fur lift, one-click clean, and calm pet reactions.",
        channel_strategy:
          "Run creator affiliate seeding on TikTok Shop, pair with short in-feed discount bursts, and scale winning hooks into localized variants."
      }
    }
  },
  {
    id: "yoga-mat-amazon-us",
    keywordTriggers: ["yoga", "mat", "pilates mat", "exercise mat"],
    product: "yoga mat",
    region: "US",
    platform: "Amazon",
    report: {
      summary:
        "The US yoga mat market is saturated at entry price points but still rewards quality and sustainability narratives. Buyers compare grip, cushioning, and long-term durability, especially for home workouts. A differentiated claim around non-slip confidence and eco materials can justify a higher average selling price.",
      competitors: [
        {
          name: "FlexCore Essential Mat",
          price: "$24.99",
          rating: 4.5,
          reviews: "9,210",
          features: ["6mm cushion", "Textured grip", "Beginner-friendly"]
        },
        {
          name: "EcoZen Natural Mat",
          price: "$42.00",
          rating: 4.6,
          reviews: "4,520",
          features: ["Natural rubber", "No PVC", "Sweat-resistant"]
        },
        {
          name: "AlignFlow Studio Pro",
          price: "$68.00",
          rating: 4.4,
          reviews: "2,770",
          features: ["Alignment lines", "High-density foam", "Travel strap"]
        },
        {
          name: "Grounded Cork Elite",
          price: "$82.00",
          rating: 4.3,
          reviews: "1,490",
          features: ["Cork top", "Anti-odor", "Premium finish"]
        }
      ],
      price_analysis: {
        budget: "$15 - $30",
        mid: "$31 - $60",
        premium: "$61 - $95",
        insight:
          "The mid tier carries the best balance of conversion and margin when supported by clear traction and longevity claims."
      },
      customer_insights: [
        "Shoppers prioritize non-slip performance during sweaty sessions and enough support for knees and wrists.",
        "Frequent complaints include curling edges, lingering chemical smell, and loss of grip after a few weeks.",
        "A gap exists for a mid-premium mat with verifiable slip resistance plus cleaner material transparency."
      ],
      gtm: {
        positioning:
          "Performance-first eco yoga mat for home and studio users who need reliable grip.",
        messaging:
          "Frame the value around confidence in movement: stable grip, supportive cushion, and cleaner material standards.",
        channel_strategy:
          "Launch with Amazon SEO-rich listings and creator-led routine videos, then retarget on social with durability testimonials."
      }
    }
  }
];
