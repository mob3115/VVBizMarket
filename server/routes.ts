import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hashPassword, verifyPassword } from "./auth";
import session from "express-session";
import MemoryStore from "memorystore";
import rateLimit from "express-rate-limit";
import { registerSchema, loginSchema } from "@shared/schema";
import type { Profile } from "@shared/schema";

const SessionStore = MemoryStore(session);

// ─── Auth middleware ──────────────────────────────────────────────────────────

/**
 * Reusable middleware that rejects unauthenticated requests with 401.
 * Attaches `res.locals.userId` for downstream handlers.
 */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = (req.session as Record<string, unknown>)?.userId as string | undefined;
  if (!userId) {
    res.status(401).send("Not authenticated");
    return;
  }
  res.locals.userId = userId;
  next();
}

// ─── Compatibility score ──────────────────────────────────────────────────────

function computeCompatibilityScore(
  sellerProfile: Profile,
  buyerProfile: Profile
): number {
  let score = 0;

  // Values overlap (30 pts)
  const sellerValues = sellerProfile.coreValues ?? [];
  const buyerValues = buyerProfile.coreValues ?? [];
  if (sellerValues.length > 0 && buyerValues.length > 0) {
    const shared = sellerValues.filter((v) => buyerValues.includes(v));
    const sim = shared.length / Math.max(sellerValues.length, buyerValues.length);
    score += 0.30 * sim * 100;
  }

  // Goal statement word overlap (15 pts)
  if (sellerProfile.goalStatement && buyerProfile.goalStatement) {
    const sellerWords = new Set(sellerProfile.goalStatement.toLowerCase().split(/\s+/));
    const buyerWords = new Set(buyerProfile.goalStatement.toLowerCase().split(/\s+/));
    const intersection = [...sellerWords].filter((w) => buyerWords.has(w));
    const sim = intersection.length / Math.max(sellerWords.size, buyerWords.size);
    score += 0.15 * sim * 100;
  }

  // Budget fit (15 pts)
  if (
    sellerProfile.askingPrice != null &&
    buyerProfile.minBudget != null &&
    buyerProfile.maxBudget != null
  ) {
    if (
      sellerProfile.askingPrice >= buyerProfile.minBudget &&
      sellerProfile.askingPrice <= buyerProfile.maxBudget
    ) {
      score += 0.15 * 100;
    } else {
      const range = buyerProfile.maxBudget - buyerProfile.minBudget;
      if (range > 0) {
        const diff = Math.min(
          Math.abs(sellerProfile.askingPrice - buyerProfile.minBudget),
          Math.abs(sellerProfile.askingPrice - buyerProfile.maxBudget)
        );
        const overlap = Math.max(0, 1 - diff / range);
        score += 0.15 * overlap * 100;
      }
    }
  }

  // Industry match (10 pts)
  if (sellerProfile.industry && (buyerProfile.preferredIndustries?.length ?? 0) > 0) {
    if (buyerProfile.preferredIndustries!.includes(sellerProfile.industry)) {
      score += 0.10 * 100;
    }
  } else if (sellerProfile.industry && buyerProfile.industry) {
    if (sellerProfile.industry === buyerProfile.industry) {
      score += 0.10 * 100;
    }
  }

  // Location match — same state/region (10 pts)
  if (sellerProfile.location && buyerProfile.location) {
    const sellerState = sellerProfile.location.split(",").pop()?.trim().toLowerCase();
    const buyerState = buyerProfile.location.split(",").pop()?.trim().toLowerCase();
    if (sellerState && buyerState && sellerState === buyerState) {
      score += 0.10 * 100;
    }
  }

  // Funding source present (10 pts) — buyer has a concrete funding plan
  if (buyerProfile.fundingSource) {
    score += 0.10 * 100;
  }

  // Both have experience data (10 pts)
  if (sellerProfile.yearsExperience != null && buyerProfile.yearsExperience != null) {
    score += 0.10 * 100;
  }

  return Math.min(Math.round(score), 100);
}

// ─── Route registration ───────────────────────────────────────────────────────

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Trust Railway's reverse proxy so req.ip is the real client IP
  app.set("trust proxy", 1);

  // ── Health check (no auth — used by Railway's healthcheck) ───────────────
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Rate limiters ─────────────────────────────────────────────────────────

  // Strict limiter for auth endpoints: 10 attempts per 15 minutes per IP
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many attempts, please try again in 15 minutes.",
  });

  // Looser limiter for general API endpoints: 200 requests per minute per IP
  const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please slow down.",
  });

  app.use("/api/auth/login", authLimiter);
  app.use("/api/auth/register", authLimiter);
  app.use("/api/", apiLimiter);

  // Session — fail loudly if SESSION_SECRET is missing in production
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET environment variable is required in production");
  }

  app.use(
    session({
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      secret: sessionSecret ?? "vv-marketplace-dev-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // ── Auth ────────────────────────────────────────────────────────────────

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).send(parsed.error.errors[0].message);
      }
      const { username, password, email, name, role } = parsed.data;

      const existing = await storage.getUserByUsername(username);
      if (existing) return res.status(409).send("Username already taken");

      const emailExists = await storage.getUserByEmail(email);
      if (emailExists) return res.status(409).send("Email already registered");

      const hashed = await hashPassword(password);
      const user = await storage.createUser({ username, password: hashed, email, name, role });
      (req.session as Record<string, unknown>).userId = user.id;
      return res.json(user);
    } catch (err: unknown) {
      return res.status(500).send(err instanceof Error ? err.message : "Server error");
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).send(parsed.error.errors[0].message);
      }
      const { identifier, password } = parsed.data;

      const isEmail = identifier.includes("@");
      const user = isEmail
        ? await storage.getUserByEmail(identifier)
        : await storage.getUserByUsername(identifier);

      if (!user) return res.status(401).send("Invalid credentials");

      const valid = await verifyPassword(password, user.password);
      if (!valid) return res.status(401).send("Invalid credentials");

      (req.session as Record<string, unknown>).userId = user.id;
      return res.json(user);
    } catch (err: unknown) {
      return res.status(500).send(err instanceof Error ? err.message : "Server error");
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req: Request, res: Response) => {
    const user = await storage.getUser(res.locals.userId as string);
    if (!user) return res.status(401).send("Not authenticated");
    return res.json(user);
  });

  // ── Users ────────────────────────────────────────────────────────────────

  app.patch(
    "/api/users/:id/onboarding",
    requireAuth,
    async (req: Request, res: Response) => {
      if (res.locals.userId !== req.params.id) {
        return res.status(403).send("Forbidden");
      }
      await storage.updateUserOnboarding(req.params.id);
      return res.json({ ok: true });
    }
  );

  // ── Profiles ─────────────────────────────────────────────────────────────

  app.post("/api/profiles", requireAuth, async (req: Request, res: Response) => {
    try {
      const profileData = { ...req.body, userId: res.locals.userId as string };
      const profile = await storage.createProfile(profileData);
      return res.json(profile);
    } catch (err: unknown) {
      return res.status(500).send(err instanceof Error ? err.message : "Server error");
    }
  });

  app.get("/api/profiles/me", requireAuth, async (_req: Request, res: Response) => {
    const userProfiles = await storage.getProfilesByUserId(res.locals.userId as string);
    return res.json(userProfiles);
  });

  // ── Discover ──────────────────────────────────────────────────────────────

  app.get("/api/discover", requireAuth, async (_req: Request, res: Response) => {
    const candidates = await storage.getDiscoverCandidates(res.locals.userId as string);
    return res.json(candidates);
  });

  // ── Swipes ───────────────────────────────────────────────────────────────

  app.post("/api/swipes", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId as string;
      const { swipedProfileId, direction } = req.body;

      if (!swipedProfileId || !direction) {
        return res.status(400).send("swipedProfileId and direction are required");
      }

      const userProfiles = await storage.getProfilesByUserId(userId);
      if (userProfiles.length === 0) return res.status(400).send("No profile found");

      // Use the profile whose role is opposite to the swiped profile
      const swipedProfile = await storage.getProfileById(swipedProfileId);
      if (!swipedProfile) return res.status(404).send("Profile not found");

      const swiperProfile =
        userProfiles.find((p) => p.role !== swipedProfile.role) ?? userProfiles[0];

      const swipe = await storage.createSwipe({
        swiperId: userId,
        swiperProfileId: swiperProfile.id,
        swipedProfileId,
        direction,
      });

      let match = null;
      if (direction === "right") {
        const isMutual = await storage.checkMutualSwipe(swiperProfile.id, swipedProfileId);
        if (isMutual) {
          const buyerProfileId =
            swiperProfile.role === "buyer" ? swiperProfile.id : swipedProfileId;
          const sellerProfileId =
            swiperProfile.role === "seller" ? swiperProfile.id : swipedProfileId;

          // Guard: prevent duplicate matches
          const alreadyMatched = await storage.matchExists(buyerProfileId, sellerProfileId);
          if (!alreadyMatched) {
            const buyerP = swiperProfile.role === "buyer" ? swiperProfile : swipedProfile;
            const sellerP = swiperProfile.role === "seller" ? swiperProfile : swipedProfile;
            const score = computeCompatibilityScore(sellerP, buyerP);

            match = await storage.createMatch({
              buyerProfileId,
              sellerProfileId,
              compatibilityScore: score,
            });
          }
        }
      }

      return res.json({ swipe, match });
    } catch (err: unknown) {
      return res.status(500).send(err instanceof Error ? err.message : "Server error");
    }
  });

  // ── Matches ──────────────────────────────────────────────────────────────

  app.get("/api/matches", requireAuth, async (_req: Request, res: Response) => {
    const userMatches = await storage.getMatchesByUserId(res.locals.userId as string);
    return res.json(userMatches);
  });

  app.get("/api/matches/:id", requireAuth, async (req: Request, res: Response) => {
    const userId = res.locals.userId as string;
    const match = await storage.getMatchById(req.params.id);
    if (!match) return res.status(404).send("Match not found");

    // Authorization: only participants may view a match
    const userProfileIds = (await storage.getProfilesByUserId(userId)).map((p) => p.id);
    const isParticipant =
      userProfileIds.includes(match.buyerProfileId) ||
      userProfileIds.includes(match.sellerProfileId);
    if (!isParticipant) return res.status(403).send("Forbidden");

    return res.json(match);
  });

  // ── Messages ─────────────────────────────────────────────────────────────

  app.post("/api/messages", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId as string;
      const { matchId, content } = req.body;

      if (!matchId || !content) {
        return res.status(400).send("matchId and content are required");
      }

      // Authorization: sender must be a participant in the match
      const match = await storage.getMatchById(matchId);
      if (!match) return res.status(404).send("Match not found");

      const userProfileIds = (await storage.getProfilesByUserId(userId)).map((p) => p.id);
      const isParticipant =
        userProfileIds.includes(match.buyerProfileId) ||
        userProfileIds.includes(match.sellerProfileId);
      if (!isParticipant) return res.status(403).send("Forbidden");

      const message = await storage.createMessage({ matchId, senderId: userId, content });
      return res.json(message);
    } catch (err: unknown) {
      return res.status(500).send(err instanceof Error ? err.message : "Server error");
    }
  });

  app.get("/api/messages/:matchId", requireAuth, async (req: Request, res: Response) => {
    const userId = res.locals.userId as string;
    const { matchId } = req.params;

    // Authorization: requester must be a participant in the match
    const match = await storage.getMatchById(matchId);
    if (!match) return res.status(404).send("Match not found");

    const userProfileIds = (await storage.getProfilesByUserId(userId)).map((p) => p.id);
    const isParticipant =
      userProfileIds.includes(match.buyerProfileId) ||
      userProfileIds.includes(match.sellerProfileId);
    if (!isParticipant) return res.status(403).send("Forbidden");

    const msgs = await storage.getMessagesByMatchId(matchId);
    return res.json(msgs);
  });

  return httpServer;
}
