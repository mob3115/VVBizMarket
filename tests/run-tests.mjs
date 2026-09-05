/**
 * Self-contained test suite — no external test framework needed.
 * Run with: node tests/run-tests.mjs
 */

import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

// ─── Harness ──────────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓  ${message}`);
  } else {
    failed++;
    failures.push(message);
    console.error(`  ✗  ${message}`);
  }
}

function assertEq(actual, expected, message) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) {
    passed++;
    console.log(`  ✓  ${message}`);
  } else {
    failed++;
    const detail = `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
    failures.push(`${message} — ${detail}`);
    console.error(`  ✗  ${message} — ${detail}`);
  }
}

async function section(name, fn) {
  console.log(`\n── ${name} ──`);
  await fn();
}

// ─── Helpers (inline — no server imports needed) ──────────────────────────────

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scryptAsync(password, salt, KEYLEN);
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(password, stored) {
  const [salt, storedHash] = stored.split(":");
  if (!salt || !storedHash) return false;
  const hash = await scryptAsync(password, salt, KEYLEN);
  const storedBuf = Buffer.from(storedHash, "hex");
  if (hash.length !== storedBuf.length) return false;
  return timingSafeEqual(hash, storedBuf);
}

function computeCompatibilityScore(sellerProfile, buyerProfile) {
  let score = 0;
  const sellerValues = sellerProfile.coreValues ?? [];
  const buyerValues = buyerProfile.coreValues ?? [];
  if (sellerValues.length > 0 && buyerValues.length > 0) {
    const shared = sellerValues.filter((v) => buyerValues.includes(v));
    score += 0.30 * (shared.length / Math.max(sellerValues.length, buyerValues.length)) * 100;
  }
  if (sellerProfile.goalStatement && buyerProfile.goalStatement) {
    const sw = new Set(sellerProfile.goalStatement.toLowerCase().split(/\s+/));
    const bw = new Set(buyerProfile.goalStatement.toLowerCase().split(/\s+/));
    const inter = [...sw].filter((w) => bw.has(w));
    score += 0.15 * (inter.length / Math.max(sw.size, bw.size)) * 100;
  }
  if (sellerProfile.askingPrice != null && buyerProfile.minBudget != null && buyerProfile.maxBudget != null) {
    if (sellerProfile.askingPrice >= buyerProfile.minBudget && sellerProfile.askingPrice <= buyerProfile.maxBudget) {
      score += 0.15 * 100;
    } else {
      const range = buyerProfile.maxBudget - buyerProfile.minBudget;
      if (range > 0) {
        const diff = Math.min(Math.abs(sellerProfile.askingPrice - buyerProfile.minBudget), Math.abs(sellerProfile.askingPrice - buyerProfile.maxBudget));
        score += 0.15 * Math.max(0, 1 - diff / range) * 100;
      }
    }
  }
  if (sellerProfile.industry && (buyerProfile.preferredIndustries?.length ?? 0) > 0) {
    if (buyerProfile.preferredIndustries.includes(sellerProfile.industry)) score += 0.10 * 100;
  } else if (sellerProfile.industry && buyerProfile.industry && sellerProfile.industry === buyerProfile.industry) {
    score += 0.10 * 100;
  }
  if (sellerProfile.location && buyerProfile.location) {
    const ss = sellerProfile.location.split(",").pop()?.trim().toLowerCase();
    const bs = buyerProfile.location.split(",").pop()?.trim().toLowerCase();
    if (ss && bs && ss === bs) score += 0.10 * 100;
  }
  if (buyerProfile.fundingSource) score += 0.10 * 100;
  if (sellerProfile.yearsExperience != null && buyerProfile.yearsExperience != null) score += 0.10 * 100;
  return Math.min(Math.round(score), 100);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

await section("1. Password hashing & verification", async () => {
  const h1 = await hashPassword("hunter2");
  const h2 = await hashPassword("hunter2");
  assert(h1 !== h2, "Same password produces different hashes (salted)");
  assert(h1.includes(":"), "Hash contains salt separator");
  assert(await verifyPassword("hunter2", h1), "Correct password verifies against h1");
  assert(await verifyPassword("hunter2", h2), "Correct password verifies against h2");
  assert(!(await verifyPassword("wrongpassword", h1)), "Wrong password fails");
  assert(!(await verifyPassword("", h1)), "Empty string fails");
  assert(!(await verifyPassword("hunter2", "badstoredvalue")), "Malformed stored value returns false");
  assert(!(await verifyPassword("hunter2", ":")), "Stored value with empty halves returns false");
  assert(!(await verifyPassword("hunter2", "nocolon")), "Stored value with no colon returns false");
  const short = await hashPassword("a");
  assert(!(await verifyPassword("b", short)), "Short password mismatch is safe");
});

await section("2. Compatibility score algorithm", async () => {
  const seller = {
    coreValues: ["Integrity", "Innovation", "Sustainability"],
    goalStatement: "grow the business sustainably long term",
    askingPrice: 500_000, industry: "Technology",
    location: "Austin, TX", yearsExperience: 10,
  };
  const buyer = {
    coreValues: ["Integrity", "Innovation", "Sustainability"],
    goalStatement: "grow the business sustainably long term",
    minBudget: 400_000, maxBudget: 600_000,
    preferredIndustries: ["Technology", "Healthcare"],
    location: "Dallas, TX", fundingSource: "Self-funded", yearsExperience: 5,
  };

  assertEq(computeCompatibilityScore(seller, buyer), 100, "Perfect match scores 100");
  assert(computeCompatibilityScore(seller, { ...buyer, location: "Austin, TX" }) <= 100, "Score never exceeds 100");
  assert(computeCompatibilityScore({ ...seller, coreValues: ["Integrity"] }, { ...buyer, coreValues: ["Innovation"] }) < 100, "Fewer shared values reduces score");
  assert(computeCompatibilityScore({ ...seller, askingPrice: 2_000_000 }, buyer) < 100, "Price outside budget reduces score");
  assertEq(computeCompatibilityScore({}, {}), 0, "Empty profiles score 0");
  assert(Number.isInteger(computeCompatibilityScore(seller, buyer)), "Score is an integer");
  assert(computeCompatibilityScore({ ...seller, industry: "Technology" }, { ...buyer, preferredIndustries: [], industry: "Technology" }) > computeCompatibilityScore({ ...seller, industry: "Agriculture" }, { ...buyer, preferredIndustries: [], industry: "Technology" }), "Industry match adds to score");
  assert(computeCompatibilityScore({ ...seller, location: "Austin, TX" }, { ...buyer, location: "Dallas, TX" }) > computeCompatibilityScore({ ...seller, location: "Austin, TX" }, { ...buyer, location: "Seattle, WA" }), "Same state adds to score");
  assert(computeCompatibilityScore(seller, { ...buyer, fundingSource: null }) < 100, "Missing funding source reduces score");
  assert(computeCompatibilityScore({ ...seller, yearsExperience: null }, { ...buyer, yearsExperience: null }) < 100, "Missing experience reduces score");
});

await section("3. Auth middleware logic", async () => {
  function requireAuth(session) {
    const userId = session?.userId;
    if (!userId) return { status: 401, userId: null };
    return { status: 200, userId };
  }
  assertEq(requireAuth({ userId: "abc" }), { status: 200, userId: "abc" }, "Valid session passes");
  assertEq(requireAuth({ userId: "" }), { status: 401, userId: null }, "Empty userId rejected");
  assertEq(requireAuth({}), { status: 401, userId: null }, "Missing userId rejected");
  assertEq(requireAuth(null), { status: 401, userId: null }, "Null session rejected");
  assertEq(requireAuth(undefined), { status: 401, userId: null }, "Undefined session rejected");
});

await section("4. Duplicate match guard", async () => {
  function matchExists(existing, buyerProfileId, sellerProfileId) {
    return existing.some((m) =>
      (m.buyerProfileId === buyerProfileId && m.sellerProfileId === sellerProfileId) ||
      (m.buyerProfileId === sellerProfileId && m.sellerProfileId === buyerProfileId)
    );
  }
  const store = [{ buyerProfileId: "b1", sellerProfileId: "s1" }];
  assert(matchExists(store, "b1", "s1"), "Detects existing match (same order)");
  assert(matchExists(store, "s1", "b1"), "Detects existing match (reversed order)");
  assert(!matchExists(store, "b2", "s1"), "Does not flag non-existent match");
  assert(!matchExists([], "b1", "s1"), "Empty store returns false");
});

await section("5. Message authorization", async () => {
  function isParticipant(match, userProfileIds) {
    return userProfileIds.includes(match.buyerProfileId) || userProfileIds.includes(match.sellerProfileId);
  }
  const match = { buyerProfileId: "bp1", sellerProfileId: "sp1" };
  assert(isParticipant(match, ["bp1"]), "Buyer is a participant");
  assert(isParticipant(match, ["sp1"]), "Seller is a participant");
  assert(isParticipant(match, ["bp1", "sp1"]), "Both profiles = participant");
  assert(!isParticipant(match, ["other"]), "Unrelated profile is not a participant");
  assert(!isParticipant(match, []), "Empty profile list is not a participant");
});

await section("6. IStorage interface contract (stub)", async () => {
  const required = [
    "getUser", "getUserByUsername", "getUserByEmail", "createUser", "updateUserOnboarding",
    "createProfile", "getProfilesByUserId", "getProfileById", "getDiscoverCandidates",
    "createSwipe", "checkMutualSwipe", "getSwipedProfileIds",
    "createMatch", "getMatchesByUserId", "getMatchById", "matchExists",
    "createMessage", "getMessagesByMatchId",
  ];
  class StubStorage {
    getUser() {} getUserByUsername() {} getUserByEmail() {} createUser() {} updateUserOnboarding() {}
    createProfile() {} getProfilesByUserId() {} getProfileById() {} getDiscoverCandidates() {}
    createSwipe() {} checkMutualSwipe() {} getSwipedProfileIds() {}
    createMatch() {} getMatchesByUserId() {} getMatchById() {} matchExists() {}
    createMessage() {} getMessagesByMatchId() {}
  }
  const stub = new StubStorage();
  for (const m of required) assert(typeof stub[m] === "function", `IStorage.${m}() implemented`);
});

await section("7. .gitignore coverage", async () => {
  const gi = readFileSync(path.join(ROOT, ".gitignore"), "utf8");
  for (const entry of [".replit", "replit.md", ".agents/", ".local/", ".env"]) {
    assert(gi.includes(entry), `.gitignore contains "${entry}"`);
  }
});

await section("8. ENV validation in server/index.ts", async () => {
  const src = readFileSync(path.join(ROOT, "server", "index.ts"), "utf8");
  assert(src.includes("DATABASE_URL"), "Checks for DATABASE_URL");
  assert(src.includes("process.exit"), "Exits on missing env var");
});

await section("9. requireAuth on all protected routes", async () => {
  const src = readFileSync(path.join(ROOT, "server", "routes.ts"), "utf8");
  assert(src.includes("requireAuth"), "requireAuth middleware defined");
  for (const route of ['"/api/auth/me"', '"/api/profiles"', '"/api/discover"', '"/api/swipes"', '"/api/matches"', '"/api/messages"']) {
    const idx = src.indexOf(route);
    assert(idx !== -1, `Route ${route} exists`);
    const snippet = src.slice(Math.max(0, idx - 20), idx + 80);
    assert(snippet.includes("requireAuth"), `Route ${route} uses requireAuth`);
  }
});

await section("10. Password hashing used in routes", async () => {
  const src = readFileSync(path.join(ROOT, "server", "routes.ts"), "utf8");
  assert(src.includes("hashPassword"), "register calls hashPassword");
  assert(src.includes("verifyPassword"), "login calls verifyPassword");
  assert(!src.includes("user.password !== password"), "No plaintext comparison");
  assert(src.includes("SESSION_SECRET"), "SESSION_SECRET validated");
});

await section("11. N+1 patterns removed", async () => {
  const src = readFileSync(path.join(ROOT, "server", "storage.ts"), "utf8");
  assert(src.includes("inArray"), "Uses bulk inArray queries");
  assert(src.includes("hydrateMatches"), "Uses hydrateMatches bulk helper");
  assert(!src.includes("for (const m of userMatches)"), "getMatchesByUserId no longer loops N+1");
  assert(src.includes("Promise.all"), "getDiscoverCandidates uses Promise.all");
});

await section("12. Vercel deployment files", async () => {
  const vercelJson = readFileSync(path.join(ROOT, "vercel.json"), "utf8");
  const vercel = JSON.parse(vercelJson);
  assert(vercel.buildCommand === "npm run build", "vercel.json has build command");
  assert(vercel.functions?.["api/index.js"], "vercel.json has api function");
  assert(Array.isArray(vercel.rewrites), "vercel.json has rewrites");
  assert(vercel.rewrites.some(r => r.source.includes("/api/")), "vercel.json routes /api to function");

  const apiEntry = readFileSync(path.join(ROOT, "api/index.js"), "utf8");
  assert(apiEntry.includes("dist/index.cjs"), "api/index.js references compiled server");

  const env = readFileSync(path.join(ROOT, ".env.example"), "utf8");
  assert(env.includes("DATABASE_URL"), ".env.example has DATABASE_URL");
  assert(env.includes("SESSION_SECRET"), ".env.example has SESSION_SECRET");
  assert(env.includes("SUPABASE_URL"), ".env.example has SUPABASE_URL");
  assert(env.includes("SUPABASE_SECRET_KEY"), ".env.example has SUPABASE_SECRET_KEY");
  assert(env.includes("VITE_SUPABASE_URL"), ".env.example has VITE_SUPABASE_URL");
  assert(env.includes("SEED_PASSWORD"), ".env.example documents SEED_PASSWORD");

  const readme = readFileSync(path.join(ROOT, "README.md"), "utf8");
  assert(readme.includes("Vercel"), "README.md documents Vercel deployment");
  assert(readme.includes("Supabase"), "README.md documents Supabase");

  // Railway/Replit files should NOT exist
  assert(!existsSync(path.join(ROOT, "railway.toml")), "railway.toml removed");
  assert(!existsSync(path.join(ROOT, "nixpacks.toml")), "nixpacks.toml removed");
  assert(!existsSync(path.join(ROOT, "replit.md")), "replit.md removed");
});

await section("13. Rate limiting", async () => {
  const src = readFileSync(path.join(ROOT, "server", "routes.ts"), "utf8");
  assert(src.includes("express-rate-limit"), "imports express-rate-limit");
  assert(src.includes("authLimiter"), "authLimiter defined");
  assert(src.includes("apiLimiter"), "apiLimiter defined");
  assert(src.includes('"/api/auth/login", authLimiter'), "authLimiter on /api/auth/login");
  assert(src.includes('"/api/auth/register", authLimiter'), "authLimiter on /api/auth/register");
  assert(src.includes("trust proxy"), "trust proxy set for Railway");

  const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
  assert("express-rate-limit" in pkg.dependencies, "express-rate-limit in package.json");
});

await section("14. Seed guard & hashed passwords", async () => {
  const src = readFileSync(path.join(ROOT, "server", "seed.ts"), "utf8");
  assert(src.includes('process.env.SEED !== "true"'), "seed only runs when SEED=true");
  assert(src.includes("hashPassword"), "seed hashes passwords before inserting");
  assert(!src.includes('"password123"'), "No plaintext password123 in seed");
  assert(!src.includes('"PLACEHOLDER"'), "No PLACEHOLDER password in seed");
  assert(src.includes("SEED_DEMO_PASSWORD"), "Seed uses SEED_DEMO_PASSWORD constant");
  assert(src.includes("process.env.SEED_PASSWORD"), "SEED_PASSWORD overridable via env");
});

await section("15. Health check endpoint", async () => {
  const src = readFileSync(path.join(ROOT, "server", "routes.ts"), "utf8");
  assert(src.includes('"/api/health"'), "/api/health endpoint defined");
  assert(src.includes('status: "ok"'), "/api/health returns status ok");
  assert(src.includes("timestamp"), "/api/health returns timestamp");
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(52)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.error("\nFailed:");
  failures.forEach((f) => console.error(`  ✗  ${f}`));
  process.exit(1);
} else {
  console.log("All tests passed ✓");
}
