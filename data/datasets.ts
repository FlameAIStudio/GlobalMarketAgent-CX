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
  },
  {
    id: "portable-blender-amazon-us",
    keywordTriggers: ["portable blender", "blender", "smoothie blender", "usb blender"],
    product: "portable blender",
    region: "US",
    platform: "Amazon",
    report: {
      summary:
        "Portable blenders in the US are driven by convenience and fitness-driven snacking behavior. Conversion depends on proof of blend quality, easy cleaning, and battery reliability. Mid-tier products with strong demo content can still outperform lower-price listings with weak trust signals.",
      competitors: [
        {
          name: "BlendGo Mini Pro",
          price: "$29.99",
          rating: 4.4,
          reviews: "7,820",
          features: ["USB-C charge", "16oz cup", "Self-clean mode", "Leak lock lid"]
        },
        {
          name: "NutriMix Travel Cup",
          price: "$39.50",
          rating: 4.3,
          reviews: "5,410",
          features: ["6-blade motor", "Pulse mode", "BPA-free jar", "Carry strap"]
        },
        {
          name: "FreshSpin On-the-Go",
          price: "$49.00",
          rating: 4.5,
          reviews: "3,360",
          features: ["18,000 rpm", "Dual safety lock", "Long battery life"]
        },
        {
          name: "VitaPocket Max",
          price: "$62.00",
          rating: 4.2,
          reviews: "1,980",
          features: ["Ice-crush mode", "Insulated bottle", "Quick rinse design"]
        }
      ],
      price_analysis: {
        budget: "$18 - $30",
        mid: "$31 - $50",
        premium: "$51 - $79",
        insight:
          "The $31-$50 segment balances conversion and margin when product demos clearly show smooth blending and easy cleanup."
      },
      customer_insights: [
        "Buyers focus on blend smoothness, leak prevention, and how fast the cup can be cleaned.",
        "Frequent complaints include weak motors, short battery life, and plastic odor after repeat use.",
        "A gap exists for a durability-first portable blender with verified battery cycles and stronger warranty messaging."
      ],
      gtm: {
        positioning:
          "Reliable everyday portable blender for commuters and fitness users who prioritize convenience and consistency.",
        messaging:
          "Show one-minute recipe demos and side-by-side blend consistency proof with a clear durability promise.",
        channel_strategy:
          "Use Amazon video-heavy listings and creator recipe shorts, then retarget with lifestyle and review-based creatives."
      }
    }
  },
  {
    id: "standing-desk-amazon-us",
    keywordTriggers: [
      "standing desk",
      "sit stand desk",
      "adjustable desk",
      "electric desk"
    ],
    product: "standing desk",
    region: "US",
    platform: "Amazon",
    report: {
      summary:
        "US standing desks remain a high-intent category where trust in stability and assembly quality drives purchase decisions. Buyers compare load capacity, wobble control, and warranty terms. Mid-range SKUs with clearer quality proof can still capture share from commodity listings.",
      competitors: [
        {
          name: "LiftEdge 48",
          price: "$239.00",
          rating: 4.5,
          reviews: "6,240",
          features: ["Dual motor", "Memory presets", "220 lb load", "Cable tray"]
        },
        {
          name: "WorkRise S2",
          price: "$299.00",
          rating: 4.4,
          reviews: "4,380",
          features: ["Quiet lift", "55 inch top", "Anti-collision", "Steel frame"]
        },
        {
          name: "MotionDesk Core",
          price: "$379.00",
          rating: 4.3,
          reviews: "2,910",
          features: ["Extended height range", "Fast assembly", "5-year frame warranty"]
        },
        {
          name: "AtlasDesk Pro",
          price: "$529.00",
          rating: 4.4,
          reviews: "1,520",
          features: ["Solid wood top", "High load support", "Premium finish"]
        }
      ],
      price_analysis: {
        budget: "$149 - $239",
        mid: "$240 - $399",
        premium: "$400 - $699",
        insight:
          "Most scalable demand sits in the $240-$399 band when stability proof and warranty confidence are explicit."
      },
      customer_insights: [
        "Customers care about wobble-free typing at standing height and smooth motor noise levels.",
        "Main complaints mention difficult assembly, uneven lifting, and delayed customer support response.",
        "There is room for a quality-assurance angle with assembly simplicity and stronger post-purchase support."
      ],
      gtm: {
        positioning:
          "A stability-first standing desk positioned for remote professionals upgrading from entry-level setups.",
        messaging:
          "Lead with measurable stability and easy assembly proof, backed by warranty and support response commitments.",
        channel_strategy:
          "Prioritize Amazon comparison charts, long-form product video, and conversion retargeting with user setup testimonials."
      }
    }
  },
  {
    id: "rice-cooker-amazon-jp",
    keywordTriggers: [
      "rice cooker",
      "mini rice cooker",
      "induction rice cooker",
      "japanese rice cooker"
    ],
    product: "rice cooker",
    region: "JP",
    platform: "Amazon",
    report: {
      summary:
        "In Japan, rice cooker demand is quality-sensitive with strong repeat trust around texture consistency and durability. Buyers evaluate heating mode, pot quality, and ease of cleaning. Mid-tier induction options remain the main value band for growth-oriented entrants.",
      competitors: [
        {
          name: "KomeSmart IH 3L",
          price: "JPY 11,800",
          rating: 4.5,
          reviews: "3,420",
          features: ["IH heating", "Quick cook mode", "24h keep warm", "Non-stick inner pot"]
        },
        {
          name: "RiceMate Compact",
          price: "JPY 8,980",
          rating: 4.4,
          reviews: "4,160",
          features: ["Small kitchen fit", "Easy lid clean", "Timer presets"]
        },
        {
          name: "UmamiCook Pro",
          price: "JPY 15,500",
          rating: 4.6,
          reviews: "2,270",
          features: ["Pressure + IH", "Texture control", "Steam basket"]
        },
        {
          name: "DailyKome Basic",
          price: "JPY 6,980",
          rating: 4.3,
          reviews: "2,980",
          features: ["Simple one-button mode", "Low energy", "Compact body"]
        }
      ],
      price_analysis: {
        budget: "JPY 5,500 - 8,999",
        mid: "JPY 9,000 - 14,999",
        premium: "JPY 15,000 - 29,000",
        insight:
          "The mid-tier induction segment captures the strongest tradeoff between quality perception and conversion volume."
      },
      customer_insights: [
        "Users prioritize rice texture consistency, cleaning convenience, and long-term reliability.",
        "Common complaints mention scratched inner pots, confusing menu systems, and uneven keep-warm performance.",
        "A gap exists for a cleaner UX model that combines induction quality with simpler daily operation."
      ],
      gtm: {
        positioning:
          "Mid-tier induction rice cooker for daily households seeking reliable texture and easy operation.",
        messaging:
          "Emphasize texture consistency tests, durable inner-pot quality, and straightforward controls for daily use.",
        channel_strategy:
          "Focus Amazon JP search capture on use-case terms, then reinforce trust with review snippets and appliance comparison pages."
      }
    }
  },
  {
    id: "vitamin-c-serum-tiktok-sea",
    keywordTriggers: [
      "vitamin c serum",
      "face serum",
      "niacinamide serum",
      "skincare serum"
    ],
    product: "vitamin c serum",
    region: "SEA",
    platform: "TikTok",
    report: {
      summary:
        "Skincare serums in SEA on short-video commerce are highly content-driven with rapid hook fatigue. Conversions are strongest when creators show texture, absorption, and before/after timelines with credibility signals. Mid-price products with trust framing can scale faster than ultra-low-price items.",
      competitors: [
        {
          name: "GlowDrop C10",
          price: "$7.90",
          rating: 4.5,
          reviews: "6,110",
          features: ["10% vitamin C", "Light texture", "Day-use safe"]
        },
        {
          name: "ClearTone Niacinamide 5",
          price: "$6.50",
          rating: 4.4,
          reviews: "5,430",
          features: ["Barrier support", "Oil control", "Fragrance free"]
        },
        {
          name: "Radiance Lab C+E",
          price: "$11.90",
          rating: 4.6,
          reviews: "3,240",
          features: ["Dual antioxidant", "Fast absorb", "Dropper bottle"]
        },
        {
          name: "PureSkin Bright Repair",
          price: "$14.20",
          rating: 4.3,
          reviews: "1,980",
          features: ["Dark spot focus", "Hydration blend", "Travel size"]
        }
      ],
      price_analysis: {
        budget: "$4 - $7",
        mid: "$8 - $13",
        premium: "$14 - $22",
        insight:
          "The $8-$13 band scales best when social proof and ingredient transparency are visible in creator content."
      },
      customer_insights: [
        "Shoppers care about irritation risk, visible brightening over time, and lightweight non-sticky feel.",
        "Top complaints mention oxidation issues, misleading concentration claims, and unclear usage guidance.",
        "There is room for a trust-led serum brand with transparent ingredient percentages and stability proof."
      ],
      gtm: {
        positioning:
          "Trust-first brightening serum with clear ingredient transparency and low-irritation positioning.",
        messaging:
          "Use evidence-led scripts around ingredient percentages, routine steps, and realistic timeline expectations.",
        channel_strategy:
          "Scale through TikTok creator affiliates, then double down on winning hooks with localized language and skin-type variants."
      }
    }
  }
];
