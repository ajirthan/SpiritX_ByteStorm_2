CREATE TABLE "user_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"playerId" integer NOT NULL
);
