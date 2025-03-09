// db/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  real,
  foreignKey,
} from "drizzle-orm/pg-core";

// --------------------- Users Table ---------------------
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // "user" or "admin"
  // Additional fields can be added here (e.g., email, createdAt, etc.)
});

// --------------------- Players Table ---------------------
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  university: text("university").notNull(),

  // Raw stats
  runs: integer("runs").default(0),
  ballsFaced: integer("ballsFaced").default(0),
  inningsPlayed: integer("inningsPlayed").default(0),
  wickets: integer("wickets").default(0),
  oversBowled: integer("oversBowled").default(0),
  runsConceded: integer("runsConceded").default(0),

  // Computed stats
  battingAverage: real("battingAverage").default(0),
  battingStrikeRate: real("battingStrikeRate").default(0),
  bowlingEconomy: real("bowlingEconomy").default(0),
  bowlingStrikeRate: real("bowlingStrikeRate").default(0),
  playerPoints: real("playerPoints").default(0),
  playerValue: real("playerValue").default(0),
});

// --------------------- user_teams Table ---------------------
// This table links users to the players they select.
export const userTeams = pgTable(
  "user_teams",
  {
    // Auto-increment ID (or use composite primary key if desired)
    id: serial("id").primaryKey(),
    userId: integer("userId").notNull(),
    playerId: integer("playerId").notNull(),
  },
  (table) => ({
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }),
    playerFk: foreignKey({
      columns: [table.playerId],
      foreignColumns: [players.id],
    }),
  })
);
