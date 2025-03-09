CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"university" text NOT NULL,
	"runs" integer DEFAULT 0,
	"ballsFaced" integer DEFAULT 0,
	"inningsPlayed" integer DEFAULT 0,
	"wickets" integer DEFAULT 0,
	"oversBowled" integer DEFAULT 0,
	"runsConceded" integer DEFAULT 0,
	"battingAverage" real DEFAULT 0,
	"battingStrikeRate" real DEFAULT 0,
	"bowlingEconomy" real DEFAULT 0,
	"bowlingStrikeRate" real DEFAULT 0,
	"playerPoints" real DEFAULT 0,
	"playerValue" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "user_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"playerId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_teams" ADD CONSTRAINT "user_teams_playerId_players_id_fk" FOREIGN KEY ("playerId") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;