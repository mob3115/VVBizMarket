// ============================================
//   V+V Business Marketplace — Shared Data & Utils
// ============================================

// === 12 SELLERS ===
const SELLERS = [
  {
    id: "s1",
    name: "Marcus Delray",
    firstName: "Marcus",
    initials: "MD",
    businessName: "Ironwood Fabrication Co.",
    anonymityLevel: 1,
    industry: "Manufacturing",
    industryIcon: "🏭",
    yearsOperating: 28,
    employees: "45–60",
    revenue: "$4.2M",
    revenueBand: "$3M–$5M",
    askingPrice: "$2.8M",
    askingRange: "$2M–$4M",
    location: "Midwest",
    city: "Cleveland, OH",
    tagline: "Built for craftsmen. Ran like a family.",
    values: ["Craftsmanship", "Employee dignity", "Long-term thinking"],
    valuesStatement: "We believe skilled trades deserve the same respect as any profession. Every person on our floor has been with us over eight years. I'm not selling to the highest bidder — I'm finding someone who sees what I see.",
    goals: "I want to retire knowing my team is taken care of and the company keeps doing meaningful work. I'd ideally stay on for 12 months as a consultant.",
    transitionTimeline: "12–18 months",
    sellerFinancing: true,
    compatibility: 91,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s2",
    name: "Priya Nambiar",
    firstName: "Priya",
    initials: "PN",
    businessName: "Root & Branch Therapy Network",
    anonymityLevel: 2,
    industry: "Healthcare",
    industryIcon: "🌿",
    yearsOperating: 11,
    employees: "18–25",
    revenue: "$1.8M",
    revenueBand: "$1M–$2.5M",
    askingPrice: "$1.2M",
    askingRange: "$900K–$1.5M",
    location: "Southeast",
    city: "Atlanta, GA",
    tagline: "Mental health care that actually reaches people.",
    values: ["Accessibility", "Community impact", "Clinical excellence"],
    valuesStatement: "We built this practice to serve people who've historically been locked out of mental health care. Our sliding scale model and community outreach are the core of what we do — not a footnote.",
    goals: "Looking for a buyer who will expand the mission, not extract margin. Ideally someone with healthcare experience or a strong operational background who respects our clinical culture.",
    transitionTimeline: "6–12 months",
    sellerFinancing: false,
    compatibility: 87,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s3",
    name: "Tom Grzelak",
    firstName: "Tom",
    initials: "TG",
    businessName: "Grzelak's Bakery & Café",
    anonymityLevel: 1,
    industry: "Food & Beverage",
    industryIcon: "🥖",
    yearsOperating: 34,
    employees: "12–18",
    revenue: "$720K",
    revenueBand: "$500K–$1M",
    askingPrice: "$380K",
    askingRange: "$300K–$500K",
    location: "Northeast",
    city: "Buffalo, NY",
    tagline: "Three decades of morning regulars and real bread.",
    values: ["Community gathering", "Authentic craft", "Neighborhood roots"],
    valuesStatement: "I opened this place the same year my youngest was born. It's not just a bakery — it's where the neighborhood comes. Funerals, graduations, every Tuesday for Frank Kowalski and his crew.",
    goals: "Retirement. I need someone who wants to be here, not own from a distance. The recipes, the regulars, and the 6am schedule — they come with the deal.",
    transitionTimeline: "3–6 months",
    sellerFinancing: true,
    compatibility: 74,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s4",
    name: "Denise Kamau",
    firstName: "Denise",
    initials: "DK",
    businessName: "Meridian Learning Solutions",
    anonymityLevel: 2,
    industry: "Education Technology",
    industryIcon: "📚",
    yearsOperating: 9,
    employees: "8–14",
    revenue: "$2.1M",
    revenueBand: "$1.5M–$3M",
    askingPrice: "$3.4M",
    askingRange: "$3M–$4M",
    location: "West Coast",
    city: "Portland, OR",
    tagline: "Workforce training that closes real skill gaps.",
    values: ["Economic mobility", "Evidence-based learning", "Equity"],
    valuesStatement: "We run programs that actually get people into better-paying jobs. 78% placement rate, not because we cherry-pick but because we build the curriculum around employer demand. I want a buyer who cares about that number.",
    goals: "Expanding to two new metro markets. I'm looking for a growth-oriented buyer who can bring capital and operational depth — I'll stay as CEO for 2–3 years under the right structure.",
    transitionTimeline: "18–24 months",
    sellerFinancing: false,
    compatibility: 83,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s5",
    name: "Ray Okonkwo",
    firstName: "Ray",
    initials: "RO",
    businessName: "Okonkwo Environmental Services",
    anonymityLevel: 1,
    industry: "Environmental Services",
    industryIcon: "♻️",
    yearsOperating: 17,
    employees: "30–40",
    revenue: "$5.1M",
    revenueBand: "$4M–$6M",
    askingPrice: "$3.9M",
    askingRange: "$3M–$5M",
    location: "Midwest",
    city: "Detroit, MI",
    tagline: "Remediation work that actually cleans things up.",
    values: ["Environmental justice", "Worker safety", "Accountability"],
    valuesStatement: "We've spent 17 years doing the hard cleanup work in communities that got stuck with someone else's mess. My team knows what it means to do this work right.",
    goals: "I want to sell to someone who understands that environmental services isn't just a contracts business. The relationships with regulatory agencies and community trust took years to build.",
    transitionTimeline: "12–18 months",
    sellerFinancing: true,
    compatibility: 69,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s6",
    name: "Sandra Whitfield",
    firstName: "Sandra",
    initials: "SW",
    businessName: "Whitfield & Co. Events",
    anonymityLevel: 2,
    industry: "Events & Hospitality",
    industryIcon: "🎉",
    yearsOperating: 14,
    employees: "6–10",
    revenue: "$1.1M",
    revenueBand: "$800K–$1.5M",
    askingPrice: "$850K",
    askingRange: "$700K–$1.1M",
    location: "South",
    city: "Nashville, TN",
    tagline: "Corporate events that people actually talk about.",
    values: ["Intentional hospitality", "Creative excellence", "Vendor relationships"],
    valuesStatement: "Every event we design tells a story. We don't do cookie-cutter galas. Our repeat client rate is 84% because we take the time to understand what a client is trying to say.",
    goals: "Ready for the next chapter personally. Looking for a buyer who is entrepreneurial, creative, and willing to invest in the brand's growth — not someone who wants to franchise it.",
    transitionTimeline: "6–12 months",
    sellerFinancing: false,
    compatibility: 78,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s7",
    name: "Carlos Espinoza",
    firstName: "Carlos",
    initials: "CE",
    businessName: "Espinoza Precision Landscaping",
    anonymityLevel: 1,
    industry: "Landscaping & Property Services",
    industryIcon: "🌳",
    yearsOperating: 22,
    employees: "28–38",
    revenue: "$3.3M",
    revenueBand: "$2.5M–$4M",
    askingPrice: "$2.1M",
    askingRange: "$1.8M–$2.5M",
    location: "Southwest",
    city: "Phoenix, AZ",
    tagline: "Commercial landscaping built on a crew that stays.",
    values: ["Workforce development", "Quality over volume", "Long-term contracts"],
    valuesStatement: "I pay above market and promote from within. Most of my foremen started pushing wheelbarrows. That retention is why clients renew year after year.",
    goals: "My kids aren't interested in taking over, and that's okay. I want a buyer who sees the crew as the asset, not a liability to cut.",
    transitionTimeline: "6–12 months",
    sellerFinancing: true,
    compatibility: 72,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s8",
    name: "Amara Osei",
    firstName: "Amara",
    initials: "AO",
    businessName: "Osei Publishing Group",
    anonymityLevel: 2,
    industry: "Media & Publishing",
    industryIcon: "📰",
    yearsOperating: 16,
    employees: "12–20",
    revenue: "$2.7M",
    revenueBand: "$2M–$3.5M",
    askingPrice: "$4.2M",
    askingRange: "$3.5M–$5M",
    location: "Northeast",
    city: "New York, NY",
    tagline: "Independent media with a 20-year reader relationship.",
    values: ["Editorial independence", "Diverse voices", "Reader trust"],
    valuesStatement: "We've never taken a brand partnership that compromised our journalism. Our readers know it and trust us because of it. The right buyer keeps that promise — or they don't get the keys.",
    goals: "Transitioning for health reasons but committed to finding the right steward. Would consider a journalist collective, mission-aligned PE, or an individual buyer with media background.",
    transitionTimeline: "6–12 months",
    sellerFinancing: false,
    compatibility: 65,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s9",
    name: "Beth Kowalczyk",
    firstName: "Beth",
    initials: "BK",
    businessName: "North Shore Veterinary Clinic",
    anonymityLevel: 1,
    industry: "Veterinary / Animal Health",
    industryIcon: "🐾",
    yearsOperating: 19,
    employees: "14–18",
    revenue: "$1.6M",
    revenueBand: "$1M–$2M",
    askingPrice: "$1.9M",
    askingRange: "$1.5M–$2.2M",
    location: "Midwest",
    city: "Chicago, IL",
    tagline: "A neighborhood vet practice 19 years in the making.",
    values: ["Compassionate care", "Community trust", "Affordable access"],
    valuesStatement: "I started this practice because I wanted to do good medicine without being owned by a corporate chain. My clients aren't customers — they're neighbors who trust me with animals they love.",
    goals: "Looking for a veterinarian-buyer who will keep the practice independent. Not interested in selling to a private equity rollup.",
    transitionTimeline: "12–18 months",
    sellerFinancing: true,
    compatibility: 80,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s10",
    name: "James Thornton",
    firstName: "James",
    initials: "JT",
    businessName: "Thornton Security Consulting",
    anonymityLevel: 2,
    industry: "Security & Risk",
    industryIcon: "🔒",
    yearsOperating: 13,
    employees: "8–12",
    revenue: "$3.8M",
    revenueBand: "$3M–$5M",
    askingPrice: "$5.2M",
    askingRange: "$4.5M–$6M",
    location: "Mid-Atlantic",
    city: "Washington, DC",
    tagline: "Government-grade security advisory, boutique delivery.",
    values: ["Integrity", "Precision", "Long-term client protection"],
    valuesStatement: "Every client is a long-term engagement. We don't do one-and-done assessments. The relationships with federal clients and cleared staff are what make this business worth what it is.",
    goals: "I'm looking for a strategic buyer — ideally a mid-market firm wanting to add cleared consulting capability without building from scratch. Culture fit non-negotiable.",
    transitionTimeline: "18–24 months",
    sellerFinancing: false,
    compatibility: 62,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s11",
    name: "Fatima Al-Rashid",
    firstName: "Fatima",
    initials: "FA",
    businessName: "Clarity Accounting Partners",
    anonymityLevel: 1,
    industry: "Professional Services",
    industryIcon: "📊",
    yearsOperating: 12,
    employees: "10–16",
    revenue: "$2.2M",
    revenueBand: "$1.5M–$3M",
    askingPrice: "$2.9M",
    askingRange: "$2.5M–$3.5M",
    location: "South",
    city: "Houston, TX",
    tagline: "Boutique accounting built entirely on referrals.",
    values: ["Client stewardship", "Work-life balance", "Professional growth"],
    valuesStatement: "We've never run an ad. 100% of our growth has been word-of-mouth from clients who trust us with the real numbers. That trust is the company's most valuable asset.",
    goals: "Looking for a buyer who values client relationship continuity. Ideally an accounting professional or small firm looking to grow, not an aggregator.",
    transitionTimeline: "12–18 months",
    sellerFinancing: true,
    compatibility: 76,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
  {
    id: "s12",
    name: "Devon Park",
    firstName: "Devon",
    initials: "DP",
    businessName: "Cedar Crest Senior Living",
    anonymityLevel: 2,
    industry: "Senior Care",
    industryIcon: "🏡",
    yearsOperating: 21,
    employees: "55–70",
    revenue: "$6.8M",
    revenueBand: "$5M–$8M",
    askingPrice: "$8.5M",
    askingRange: "$7.5M–$10M",
    location: "Pacific Northwest",
    city: "Seattle, WA",
    tagline: "Dignity-centered senior care in a community setting.",
    values: ["Resident dignity", "Staff retention", "Family trust"],
    valuesStatement: "Our staff tenure averages 9 years. In this industry, that's almost unheard of. It happens because we treat caregivers the way we want residents treated — with respect and real compensation.",
    goals: "Considering sale or partnership to fund expansion to a second location. Seeking a buyer who understands that this business runs on human relationships, not efficiency ratios.",
    transitionTimeline: "18–24 months",
    sellerFinancing: false,
    compatibility: 88,
    ndaSigned: false,
    liked: false,
    passed: false,
  },
];

// === 12 BUYERS ===
const BUYERS = [
  {
    id: "b1",
    name: "Angela Reyes",
    initials: "AR",
    background: "Former nonprofit executive with 15 years in workforce development",
    lookingFor: "Mission-aligned service businesses in healthcare or education",
    priceRange: "$500K–$3M",
    industries: ["Healthcare", "Education Technology", "Professional Services"],
    location: "Midwest",
    funding: "SBA Loan + Personal Capital",
    experience: "15 years",
    values: ["Community impact", "Employee ownership", "Sustainability"],
    valuesStatement: "I've spent my career building programs that actually move the needle on economic mobility. I want to run a business that does the same thing, just with a sustainable model underneath.",
    score: 91,
    liked: false,
    passed: false,
  },
  {
    id: "b2",
    name: "Derek Wainwright",
    initials: "DW",
    background: "Private equity principal, 12 years in lower-middle market",
    lookingFor: "Established businesses with strong cash flow and leadership teams",
    priceRange: "$3M–$10M",
    industries: ["Manufacturing", "Environmental Services", "Senior Care"],
    location: "National",
    funding: "Private Equity",
    experience: "12 years",
    values: ["Long-term value creation", "Operational excellence", "Employee retention"],
    valuesStatement: "I've seen what bad PE looks like from the inside. I'm building something different — a hold period measured in decades, not exit multiples.",
    score: 84,
    liked: false,
    passed: false,
  },
  {
    id: "b3",
    name: "Solange Mbeki",
    initials: "SM",
    background: "Physician entrepreneur, built and sold two medical group practices",
    lookingFor: "Healthcare or wellness businesses with strong clinical culture",
    priceRange: "$1M–$4M",
    industries: ["Healthcare", "Veterinary / Animal Health", "Senior Care"],
    location: "Southeast",
    funding: "Cash",
    experience: "18 years",
    values: ["Clinical excellence", "Patient dignity", "Community trust"],
    valuesStatement: "Healthcare businesses are only as good as the people delivering care. I buy culture, not just numbers.",
    score: 87,
    liked: false,
    passed: false,
  },
  {
    id: "b4",
    name: "Nathan Kopp",
    initials: "NK",
    background: "Second-generation entrepreneur, ran family HVAC business for 10 years",
    lookingFor: "Blue-collar service businesses with loyal crews",
    priceRange: "$1M–$3M",
    industries: ["Landscaping & Property Services", "Manufacturing", "Environmental Services"],
    location: "Midwest",
    funding: "SBA Loan",
    experience: "10 years",
    values: ["Skilled trades respect", "Team loyalty", "Operational integrity"],
    valuesStatement: "I grew up watching my dad treat his employees like family. That's the only kind of business I want to run.",
    score: 78,
    liked: false,
    passed: false,
  },
  {
    id: "b5",
    name: "Vivienne Laforge",
    initials: "VL",
    background: "Former CMO turned entrepreneur, 20 years in brand and hospitality",
    lookingFor: "Creative service or hospitality businesses with strong brand equity",
    priceRange: "$500K–$2M",
    industries: ["Events & Hospitality", "Food & Beverage", "Media & Publishing"],
    location: "South",
    funding: "Personal Capital + Seller Financing",
    experience: "20 years",
    values: ["Creative excellence", "Brand integrity", "Client relationships"],
    valuesStatement: "I'm not looking to buy a revenue stream. I'm looking for a business that has a genuine point of view and a founder who cares enough to want it in the right hands.",
    score: 79,
    liked: false,
    passed: false,
  },
  {
    id: "b6",
    name: "Jerome Blackwood",
    initials: "JB",
    background: "CPA and former Big 4 partner, 22 years in professional services",
    lookingFor: "Accounting, advisory, or professional service firms",
    priceRange: "$1M–$4M",
    industries: ["Professional Services", "Security & Risk", "Education Technology"],
    location: "South",
    funding: "Cash",
    experience: "22 years",
    values: ["Client stewardship", "Professional integrity", "Team development"],
    valuesStatement: "The most valuable thing in professional services is the trust clients extend to their advisors. I look for practices where that trust has been earned honestly.",
    score: 76,
    liked: false,
    passed: false,
  },
  {
    id: "b7",
    name: "Maya Ostrowski",
    initials: "MO",
    background: "EdTech founder, exited Series B startup, passionate about workforce development",
    lookingFor: "Education or training businesses with measurable outcomes",
    priceRange: "$2M–$5M",
    industries: ["Education Technology", "Professional Services", "Healthcare"],
    location: "West Coast",
    funding: "Cash + Strategic Capital",
    experience: "13 years",
    values: ["Economic mobility", "Evidence-based outcomes", "Equity in education"],
    valuesStatement: "The EdTech graveyard is full of companies that optimized for engagement over outcomes. I want to own something that's honest about what it delivers.",
    score: 83,
    liked: false,
    passed: false,
  },
  {
    id: "b8",
    name: "Curtis Haynes",
    initials: "CH",
    background: "Army veteran, 8 years in federal contracting, building a portfolio",
    lookingFor: "Government-adjacent businesses or security consulting",
    priceRange: "$3M–$7M",
    industries: ["Security & Risk", "Environmental Services", "Professional Services"],
    location: "Mid-Atlantic",
    funding: "SBA Veteran Loan + Partner Capital",
    experience: "8 years",
    values: ["Integrity", "Service", "Long-term accountability"],
    valuesStatement: "In the military, your reputation follows you everywhere. I want to run a business that operates the same way.",
    score: 62,
    liked: false,
    passed: false,
  },
  {
    id: "b9",
    name: "Ingrid Halvorsen",
    initials: "IH",
    background: "Former food & beverage executive, 25 years with regional chains",
    lookingFor: "Established restaurants or food businesses with loyal customer bases",
    priceRange: "$300K–$1.2M",
    industries: ["Food & Beverage", "Events & Hospitality"],
    location: "Northeast",
    funding: "Personal Capital",
    experience: "25 years",
    values: ["Authentic craft", "Community gathering", "Sustainability"],
    valuesStatement: "I've spent my career making other people's concepts successful. Now I want to steward something that already has a soul.",
    score: 74,
    liked: false,
    passed: false,
  },
  {
    id: "b10",
    name: "Terrence Malone",
    initials: "TM",
    background: "Independent sponsor, former M&A attorney, deal-driven but values-led",
    lookingFor: "Scalable service businesses in fragmented markets",
    priceRange: "$2M–$6M",
    industries: ["Landscaping & Property Services", "Senior Care", "Environmental Services"],
    location: "National",
    funding: "Independent Sponsor / Search Fund",
    experience: "14 years",
    values: ["Long-term stewardship", "Fair dealing", "Value creation"],
    valuesStatement: "I've structured enough bad deals to know what the good ones look like. The best acquisitions are the ones where the seller sleeps well after closing.",
    score: 72,
    liked: false,
    passed: false,
  },
  {
    id: "b11",
    name: "Nadia Brennan",
    initials: "NB",
    background: "Journalist turned media entrepreneur, 2 independent publications",
    lookingFor: "Independent media, newsletters, or publishing businesses",
    priceRange: "$1M–$5M",
    industries: ["Media & Publishing"],
    location: "Northeast",
    funding: "Investor Syndicate + Personal Capital",
    experience: "16 years",
    values: ["Editorial independence", "Reader trust", "Diverse voices"],
    valuesStatement: "I believe independent media is one of the most important businesses anyone can own right now. I'm looking for something that has protected its integrity and wants to keep doing so.",
    score: 65,
    liked: false,
    passed: false,
  },
  {
    id: "b12",
    name: "Paul and Lisa Sato",
    initials: "PS",
    background: "Spouses transitioning from corporate careers — Paul in logistics, Lisa in nursing",
    lookingFor: "Small healthcare or service business they can run together",
    priceRange: "$800K–$2.5M",
    industries: ["Veterinary / Animal Health", "Senior Care", "Healthcare"],
    location: "Midwest",
    funding: "SBA Loan + Seller Financing",
    experience: "Combined 30 years",
    values: ["Compassionate care", "Community trust", "Family business values"],
    valuesStatement: "We want to build something we're proud of together. We're not looking for passive income — we want to show up every day for people who are counting on us.",
    score: 80,
    liked: false,
    passed: false,
  },
];

// === APP STATE ===
const AppState = {
  currentUser: null,
  currentRole: 'buyer', // 'buyer' | 'seller' | 'admin'
  sellers: JSON.parse(JSON.stringify(SELLERS)),
  buyers: JSON.parse(JSON.stringify(BUYERS)),
  matches: [],
  messages: {},
  currentSellerId: null,
  swipeIndex: 0,
  notifications: 3,

  // Demo logins
  accounts: {
    'angela@example.com': { password: 'demo', role: 'buyer', buyerId: 'b1', name: 'Angela Reyes', initials: 'AR' },
    'marcus@example.com': { password: 'demo', role: 'seller', sellerId: 's1', name: 'Marcus Delray', initials: 'MD' },
    'admin@vvmarketplace.com': { password: 'admin', role: 'admin', name: 'Admin User', initials: 'AU' },
  },

  getSortedSellers() {
    return [...this.sellers]
      .filter(s => !s.passed)
      .sort((a, b) => b.compatibility - a.compatibility);
  },
  getSwipeQueue() {
    return this.getSortedSellers().filter(s => !s.liked && !s.passed);
  },
  getLikedSellers() {
    return this.sellers.filter(s => s.liked);
  },
  getMatches() {
    return this.sellers.filter(s => s.liked);
  },
};

// === UTILITIES ===
function toast(msg, type = 'default') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = { success: '✓', danger: '✕', default: '→' };
  t.innerHTML = `<span>${icons[type] || '→'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function scoreColor(score) {
  if (score >= 85) return '#4caf7d';
  if (score >= 70) return '#A05500';
  return '#929292';
}

function scoreRingHTML(score, size = 80) {
  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = scoreColor(score);
  return `
    <div class="score-ring" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#2e2e2e" stroke-width="5"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
          stroke="${color}" stroke-width="5"
          stroke-dasharray="${fill} ${circ}"
          stroke-linecap="round"/>
      </svg>
      <span class="score-text" style="color:${color};font-size:${size>70?'1.2rem':'0.9rem'}">${score}</span>
    </div>`;
}

function anonBadgeHTML(level) {
  const labels = ['', 'Anonymous', 'Partial ID', 'Full Reveal'];
  const cls = ['', 'anon-1', 'anon-2', 'anon-3'];
  const icons = ['', '👤', '🔓', '✅'];
  return `<span class="anon-badge ${cls[level]}">${icons[level]} ${labels[level]}</span>`;
}

function getSellerDisplayName(seller) {
  if (seller.anonymityLevel === 1) return `Anonymous ${seller.industry} Owner`;
  if (seller.anonymityLevel === 2) return seller.firstName + ' — ' + seller.industry + ' Owner';
  return seller.name;
}
function getSellerDisplayBusiness(seller) {
  if (seller.anonymityLevel === 1) return `[Business Name Hidden]`;
  if (seller.anonymityLevel === 2) return `[Full Name Unlocks After NDA]`;
  return seller.businessName;
}
function getSellerDisplayLocation(seller) {
  if (seller.anonymityLevel === 1) return seller.location;
  return seller.city;
}
function getSellerDisplayRevenue(seller) {
  if (seller.anonymityLevel === 3) return seller.revenue;
  return seller.revenueBand;
}

// Route guard — redirect to login if needed
function requireAuth() {
  if (!AppState.currentUser) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}
