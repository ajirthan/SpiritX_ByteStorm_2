CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"university" text NOT NULL,
	"battingAverage" numeric,
	"battingStrikeRate" numeric,
	"bowlingEconomy" numeric,
	"bowlingStrikeRate" numeric,
	"runs" integer,
	"wickets" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user';