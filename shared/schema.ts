import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["buyer", "seller", "dual"] }).notNull().default("buyer"),
  name: text("name").notNull(),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role", { enum: ["buyer", "seller"] }).notNull(),
  headline: text("headline"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  industry: text("industry"),
  location: text("location"),
  yearsExperience: integer("years_experience"),
  coreValues: text("core_values").array(),
  goalStatement: text("goal_statement"),
  askingPrice: integer("asking_price"),
  minBudget: integer("min_budget"),
  maxBudget: integer("max_budget"),
  revenueRange: text("revenue_range"),
  employeeCount: text("employee_count"),
  businessName: text("business_name"),
  fundingSource: text("funding_source"),
  preferredIndustries: text("preferred_industries").array(),
  transitionPeriod: text("transition_period"),
  whySelling: text("why_selling"),
  whyBuying: text("why_buying"),
});

export const swipes = pgTable("swipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  swiperId: varchar("swiper_id").notNull().references(() => users.id),
  swiperProfileId: varchar("swiper_profile_id").notNull().references(() => profiles.id),
  swipedProfileId: varchar("swiped_profile_id").notNull().references(() => profiles.id),
  direction: text("direction", { enum: ["left", "right"] }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerProfileId: varchar("buyer_profile_id").notNull().references(() => profiles.id),
  sellerProfileId: varchar("seller_profile_id").notNull().references(() => profiles.id),
  compatibilityScore: real("compatibility_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: varchar("match_id").notNull().references(() => matches.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, onboardingComplete: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true });
export const insertSwipeSchema = createInsertSchema(swipes).omit({ id: true, createdAt: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["buyer", "seller", "dual"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type ProfileWithUser = Profile & { user: User };
export type MatchWithProfiles = Match & {
  buyerProfile: ProfileWithUser;
  sellerProfile: ProfileWithUser;
};
