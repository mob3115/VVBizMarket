import { storage } from "./storage";
import { hashPassword } from "./auth";

// Default demo password for seed accounts — override with SEED_PASSWORD env var.
// This value is only ever stored as a salted hash, never in plaintext in the DB.
const SEED_DEMO_PASSWORD = process.env.SEED_PASSWORD ?? "ChangeMe!Demo2024";

export async function seedDatabase() {
  // Only seed when explicitly requested — protects real user data on restarts
  if (process.env.SEED !== "true") return;

  const existing = await storage.getUserByUsername("sarah_mitchell");
  if (existing) {
    console.log("Seed data already present, skipping.");
    return;
  }

  const sellers = [
    {
      user: { username: "sarah_mitchell", password: SEED_DEMO_PASSWORD, email: "sarah@example.com", name: "Sarah Mitchell", role: "seller" as const },
      profile: {
        role: "seller" as const,
        headline: "25-Year Family Bakery Seeking Values-Aligned Successor",
        bio: "Our bakery has been the heart of the community for 25 years. We source locally, employ from the neighborhood, and donate to local food banks weekly. Looking for someone who will continue our commitment to community nourishment.",
        avatarUrl: "/images/profile-seller-1.png",
        industry: "Food & Beverage",
        location: "Portland, OR",
        yearsExperience: 25,
        coreValues: ["Community Impact", "Sustainability", "Employee Welfare", "Quality Craftsmanship"],
        goalStatement: "I want my bakery to continue feeding and serving our community long after I retire. The next owner must value people over profit.",
        askingPrice: 750000,
        revenueRange: "$500K - $1M",
        employeeCount: "16-50",
        businessName: "Mitchell's Community Bakery",
        transitionPeriod: "6-12 months",
        whySelling: "Retiring after 25 wonderful years. Want to ensure the business continues to serve our community with the same values.",
      },
    },
    {
      user: { username: "james_chen", password: SEED_DEMO_PASSWORD, email: "james@example.com", name: "James Chen", role: "seller" as const },
      profile: {
        role: "seller" as const,
        headline: "Sustainable Tech Consultancy Ready for Next Chapter",
        bio: "Built a B-Corp certified technology consultancy focused on helping nonprofits and social enterprises with digital transformation. Our team of 30 is passionate about using technology for good.",
        avatarUrl: "/images/profile-seller-2.png",
        industry: "Technology",
        location: "Austin, TX",
        yearsExperience: 12,
        coreValues: ["Innovation", "Social Responsibility", "Diversity & Inclusion", "Mentorship"],
        goalStatement: "Seeking an acquirer who will maintain our B-Corp certification and continue serving the social impact sector with integrity.",
        askingPrice: 3500000,
        revenueRange: "$1M - $5M",
        employeeCount: "16-50",
        businessName: "GoodTech Solutions",
        transitionPeriod: "6-12 months",
        whySelling: "Moving overseas for family reasons. Want to ensure GoodTech continues its mission of technology for social good.",
      },
    },
    {
      user: { username: "maria_gonzalez", password: SEED_DEMO_PASSWORD, email: "maria@example.com", name: "Maria Gonzalez", role: "seller" as const },
      profile: {
        role: "seller" as const,
        headline: "Award-Winning Eco-Friendly Manufacturing Business",
        bio: "Pioneered sustainable packaging solutions for the food industry. Zero-waste facility with 100% renewable energy. Multiple industry awards for environmental innovation.",
        avatarUrl: "/images/profile-seller-1.png",
        industry: "Manufacturing",
        location: "Denver, CO",
        yearsExperience: 18,
        coreValues: ["Environmental Stewardship", "Innovation", "Integrity", "Growth Mindset"],
        goalStatement: "Looking for a buyer who is passionate about environmental sustainability and will continue pushing the boundaries of eco-friendly manufacturing.",
        askingPrice: 8000000,
        revenueRange: "$5M - $10M",
        employeeCount: "51-100",
        businessName: "GreenPack Solutions",
        transitionPeriod: "1-2 years",
        whySelling: "Ready to start a new venture in clean energy. Want GreenPack to be in hands that will continue our environmental mission.",
      },
    },
  ];

  const buyers = [
    {
      user: { username: "david_thompson", password: SEED_DEMO_PASSWORD, email: "david@example.com", name: "David Thompson", role: "buyer" as const },
      profile: {
        role: "buyer" as const,
        headline: "Experienced Operator Seeking Community-Focused Business",
        bio: "Former Fortune 500 executive turned purpose-driven entrepreneur. 15 years of operational experience. Looking to acquire and grow a business that makes a real difference in people's lives.",
        avatarUrl: "/images/profile-buyer-1.png",
        industry: "Professional Services",
        location: "Seattle, WA",
        yearsExperience: 15,
        coreValues: ["Community Impact", "Employee Welfare", "Integrity", "Work-Life Balance"],
        goalStatement: "I want to run a business where I can see the direct positive impact on people's lives every day. Profit is important but purpose is paramount.",
        minBudget: 500000,
        maxBudget: 2000000,
        fundingSource: "Self-funded",
        preferredIndustries: ["Food & Beverage", "Healthcare", "Education", "Retail"],
        whyBuying: "Left corporate life to find more meaningful work. Want to own and operate a business that truly serves its community.",
      },
    },
    {
      user: { username: "lisa_park", password: SEED_DEMO_PASSWORD, email: "lisa@example.com", name: "Lisa Park", role: "buyer" as const },
      profile: {
        role: "buyer" as const,
        headline: "Impact Investor Seeking Sustainable Technology Business",
        bio: "Managing partner at a family office focused on impact investing. Deep background in technology and sustainability. Looking to acquire and scale businesses at the intersection of tech and social good.",
        avatarUrl: "/images/profile-buyer-2.png",
        industry: "Technology",
        location: "San Francisco, CA",
        yearsExperience: 20,
        coreValues: ["Innovation", "Social Responsibility", "Sustainability", "Diversity & Inclusion"],
        goalStatement: "Seeking a technology business that proves profit and purpose can coexist. We want to scale impact, not just revenue.",
        minBudget: 2000000,
        maxBudget: 10000000,
        fundingSource: "Family Office",
        preferredIndustries: ["Technology", "Healthcare", "Energy", "Education"],
        whyBuying: "Our family office is dedicated to acquiring businesses that demonstrate measurable social and environmental impact alongside strong financial returns.",
      },
    },
    {
      user: { username: "michael_roberts", password: SEED_DEMO_PASSWORD, email: "michael@example.com", name: "Michael Roberts", role: "buyer" as const },
      profile: {
        role: "buyer" as const,
        headline: "Serial Entrepreneur Looking for Manufacturing Acquisition",
        bio: "Built and sold two businesses in the sustainability space. Strong operational background with a passion for environmental innovation. Ready for the next chapter.",
        avatarUrl: "/images/profile-buyer-1.png",
        industry: "Manufacturing",
        location: "Denver, CO",
        yearsExperience: 22,
        coreValues: ["Environmental Stewardship", "Growth Mindset", "Innovation", "Quality Craftsmanship"],
        goalStatement: "I want to acquire a manufacturing business where I can apply my experience in sustainability to create a truly green operation.",
        minBudget: 3000000,
        maxBudget: 15000000,
        fundingSource: "SBA Loan",
        preferredIndustries: ["Manufacturing", "Energy", "Construction", "Agriculture"],
        whyBuying: "After selling my last company, I want to acquire an established manufacturing business and take its environmental impact to the next level.",
      },
    },
  ];

  for (const s of sellers) {
    const hashedPassword = await hashPassword(s.user.password);
    const user = await storage.createUser({ ...s.user, password: hashedPassword });
    await storage.createProfile({ ...s.profile, userId: user.id });
    await storage.updateUserOnboarding(user.id);
  }

  for (const b of buyers) {
    const hashedPassword = await hashPassword(b.user.password);
    const user = await storage.createUser({ ...b.user, password: hashedPassword });
    await storage.createProfile({ ...b.profile, userId: user.id });
    await storage.updateUserOnboarding(user.id);
  }

  console.log("Seed data inserted successfully");
}
