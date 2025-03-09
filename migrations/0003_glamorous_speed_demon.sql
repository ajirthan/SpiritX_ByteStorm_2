ALTER TABLE "user_teams" ALTER COLUMN "userId" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "budget" numeric DEFAULT '9000000';