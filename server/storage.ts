import {
  type User, type InsertUser,
  type Profile, type InsertProfile,
  type Swipe, type InsertSwipe,
  type Match, type InsertMatch,
  type Message, type InsertMessage,
  type ProfileWithUser, type MatchWithProfiles,
  users, profiles, swipes, matches, messages,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, notInArray, desc, asc, inArray, or } from "drizzle-orm";

// ─── Interface ───────────────────────────────────────────────────────────────

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserOnboarding(id: string): Promise<void>;

  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfilesByUserId(userId: string): Promise<Profile[]>;
  getProfileById(id: string): Promise<Profile | undefined>;
  getDiscoverCandidates(userId: string): Promise<ProfileWithUser[]>;

  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  checkMutualSwipe(swiperProfileId: string, swipedProfileId: string): Promise<boolean>;
  getSwipedProfileIds(swiperProfileId: string): Promise<string[]>;

  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByUserId(userId: string): Promise<MatchWithProfiles[]>;
  getMatchById(id: string): Promise<MatchWithProfiles | undefined>;
  matchExists(buyerProfileId: string, sellerProfileId: string): Promise<boolean>;

  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByMatchId(matchId: string): Promise<Message[]>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function hydrateMatches(rawMatches: Match[]): Promise<MatchWithProfiles[]> {
  if (rawMatches.length === 0) return [];

  const profileIds = [
    ...new Set([
      ...rawMatches.map((m) => m.buyerProfileId),
      ...rawMatches.map((m) => m.sellerProfileId),
    ]),
  ];

  const allProfiles = await db
    .select()
    .from(profiles)
    .where(inArray(profiles.id, profileIds));

  const userIds = [...new Set(allProfiles.map((p) => p.userId))];

  const allUsers = await db
    .select()
    .from(users)
    .where(inArray(users.id, userIds));

  const profileMap = new Map(allProfiles.map((p) => [p.id, p]));
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const result: MatchWithProfiles[] = [];
  for (const m of rawMatches) {
    const buyerProfile = profileMap.get(m.buyerProfileId);
    const sellerProfile = profileMap.get(m.sellerProfileId);
    if (!buyerProfile || !sellerProfile) continue;

    const buyerUser = userMap.get(buyerProfile.userId);
    const sellerUser = userMap.get(sellerProfile.userId);
    if (!buyerUser || !sellerUser) continue;

    result.push({
      ...m,
      buyerProfile: { ...buyerProfile, user: buyerUser },
      sellerProfile: { ...sellerProfile, user: sellerUser },
    });
  }
  return result;
}

// ─── Implementation ───────────────────────────────────────────────────────────

export class DatabaseStorage implements IStorage {

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserOnboarding(id: string): Promise<void> {
    await db.update(users).set({ onboardingComplete: true }).where(eq(users.id, id));
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [created] = await db.insert(profiles).values(profile).returning();
    return created;
  }

  async getProfilesByUserId(userId: string): Promise<Profile[]> {
    return db.select().from(profiles).where(eq(profiles.userId, userId));
  }

  async getProfileById(id: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getDiscoverCandidates(userId: string): Promise<ProfileWithUser[]> {
    const userProfiles = await this.getProfilesByUserId(userId);
    if (userProfiles.length === 0) return [];

    const swipedIdArrays = await Promise.all(
      userProfiles.map((p) => this.getSwipedProfileIds(p.id))
    );
    const allSwipedIds = swipedIdArrays.flat();

    const userProfileIds = userProfiles.map((p) => p.id);
    const excludeIds = [...new Set([...allSwipedIds, ...userProfileIds])];

    const userRole = userProfiles[0].role;
    const targetRole = userRole === "seller" ? "buyer" : "seller";

    const candidateProfiles =
      excludeIds.length > 0
        ? await db
            .select()
            .from(profiles)
            .where(and(eq(profiles.role, targetRole), notInArray(profiles.id, excludeIds)))
        : await db
            .select()
            .from(profiles)
            .where(eq(profiles.role, targetRole));

    if (candidateProfiles.length === 0) return [];

    const ownerIds = [...new Set(candidateProfiles.map((p) => p.userId))];
    const ownerUsers = await db
      .select()
      .from(users)
      .where(inArray(users.id, ownerIds));
    const userMap = new Map(ownerUsers.map((u) => [u.id, u]));

    const result: ProfileWithUser[] = [];
    for (const p of candidateProfiles) {
      const u = userMap.get(p.userId);
      if (u) result.push({ ...p, user: u });
    }
    return result;
  }

  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const [created] = await db.insert(swipes).values(swipe).returning();
    return created;
  }

  async checkMutualSwipe(swiperProfileId: string, swipedProfileId: string): Promise<boolean> {
    const [reverse] = await db
      .select()
      .from(swipes)
      .where(
        and(
          eq(swipes.swiperProfileId, swipedProfileId),
          eq(swipes.swipedProfileId, swiperProfileId),
          eq(swipes.direction, "right")
        )
      );
    return !!reverse;
  }

  async getSwipedProfileIds(swiperProfileId: string): Promise<string[]> {
    const result = await db
      .select({ swipedProfileId: swipes.swipedProfileId })
      .from(swipes)
      .where(eq(swipes.swiperProfileId, swiperProfileId));
    return result.map((r) => r.swipedProfileId);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [created] = await db.insert(matches).values(match).returning();
    return created;
  }

  async matchExists(buyerProfileId: string, sellerProfileId: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(matches)
      .where(
        or(
          and(
            eq(matches.buyerProfileId, buyerProfileId),
            eq(matches.sellerProfileId, sellerProfileId)
          ),
          and(
            eq(matches.buyerProfileId, sellerProfileId),
            eq(matches.sellerProfileId, buyerProfileId)
          )
        )
      );
    return !!existing;
  }

  async getMatchesByUserId(userId: string): Promise<MatchWithProfiles[]> {
    const userProfiles = await this.getProfilesByUserId(userId);
    if (userProfiles.length === 0) return [];

    const userProfileIds = userProfiles.map((p) => p.id);

    const userMatches = await db
      .select()
      .from(matches)
      .where(
        or(
          inArray(matches.buyerProfileId, userProfileIds),
          inArray(matches.sellerProfileId, userProfileIds)
        )
      )
      .orderBy(desc(matches.createdAt));

    return hydrateMatches(userMatches);
  }

  async getMatchById(id: string): Promise<MatchWithProfiles | undefined> {
    const [m] = await db.select().from(matches).where(eq(matches.id, id));
    if (!m) return undefined;
    const [hydrated] = await hydrateMatches([m]);
    return hydrated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(message).returning();
    return created;
  }

  async getMessagesByMatchId(matchId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));
  }
}

export const storage = new DatabaseStorage();
