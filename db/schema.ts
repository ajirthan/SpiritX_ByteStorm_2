import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

// Users table for authentication and role management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false),
  verificationToken: text("verificationToken"),
  resetToken: text("resetToken"),
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  role: text("role").default("user"), // role: "user" or "admin"
  budget: numeric("budget").default("9000000"), // Each user starts with 9,000,000
});

// Players table for Spirit11 (fantasy cricket)
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  university: text("university").notNull(),
  battingAverage: numeric("battingAverage"),
  battingStrikeRate: numeric("battingStrikeRate"),
  bowlingEconomy: numeric("bowlingEconomy"),
  bowlingStrikeRate: numeric("bowlingStrikeRate"),
  runs: integer("runs"),
  wickets: integer("wickets"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// userTeams table associates a user with selected players
export const userTeams = pgTable("user_teams", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(), // References users.id (should be consistent with your users table type)
  playerId: integer("playerId").notNull(), // References players.id
});
