# SecureConnect & Spirit11

SecureConnect & Spirit11 is a two-part project developed for a university hackathon. The project comprises:

1. **SecureConnect** – A secure authentication system featuring signup, login, email verification, and password reset.
2. **Spirit11** – A fantasy cricket league platform where users select players to form a team, manage budgets, and compete on a leaderboard.

Both projects are built on the following technology stack:
- **Next.js 15** (with the App Router)
- **Bun & pnpm** for runtime and package management
- **Drizzle ORM** with PostgreSQL (NeonDB by Vercel) for database interactions
- **Tailwind CSS v4** for styling
- **NextAuth** for authentication
- **Zod** & **react-hook-form** for form validation
- **Framer Motion** for animations
- **Resend** for sending emails
- Additional libraries for CSV import, computed stats, and real-time updates

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup and Migrations](#database-setup-and-migrations)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Features Checklist](#features-checklist)
- [Computed Stats Logic](#computed-stats-logic)
- [API Endpoints](#api-endpoints)
- [User Interface](#user-interface)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/secureconnect-spirit11.git
   cd secureconnect-spirit11

	2.	Install Dependencies:
Ensure you have Bun and pnpm installed.

pnpm install



Environment Variables

Create a .env.local file in the project root and add the following (adjust values as needed):

# PostgreSQL connection string (NeonDB)
DATABASE_URL=postgres://neondb_owner:your_password@your_neon_host/neondb?sslmode=require

# NextAuth settings
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Resend API key for emails
RESEND_API_KEY=your_resend_api_key

# Gemini API key for chatbot (if applicable)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

Database Setup and Migrations

Update your Drizzle schema (see Project Structure) to include the necessary tables and columns (users, players, user_teams). Then run:

pnpm drizzle-kit generate
pnpm drizzle-kit up

This will create/update tables with the following columns:
	•	players: Raw stats (runs, ballsFaced, inningsPlayed, wickets, oversBowled, runsConceded) and computed fields (battingAverage, battingStrikeRate, bowlingEconomy, bowlingStrikeRate, playerPoints, playerValue)
	•	users: Basic user info and role (admin or user)
	•	user_teams: Linking table for users and the players they select

Running the Project

To start the development server, run:

bun run dev

Access the app at http://localhost:3000.

Project Structure

/app
  /api
    /admin
      /players
        route.ts         // CRUD operations for players (admin)
      /stats
        route.ts         // Computed stats API
    /auth
      /[...nextauth]
        route.ts         // NextAuth configuration
    /chat
      route.ts           // Chatbot API (Spiriter)
    /user
      /team
        route.ts         // API for user's selected team
  /admin
    /players
      [id]/
        page.tsx         // Detailed view for a single player (admin)
    /stats
      page.tsx           // Player stats view (admin)
    /tournament-summary
      page.tsx         // Tournament summary view (admin)
  /user
    /players
      page.tsx           // Read-only players view (user)
    /select-team
      page.tsx           // Team selection interface
    /team
      page.tsx           // User's team display
    /budget
      page.tsx           // Budget tracking interface
  /auth
    login/page.tsx
    signup/page.tsx
    reset-password/page.tsx
    verify/page.tsx
  /spiriter
    page.tsx             // Chatbot (Spiriter) interface
/components
  LoadingSpinner.tsx
  LoginForm.tsx
  SignupForm.tsx
  PasswordStrengthIndicator.tsx
  ... (other UI components)
/db
  schema.ts              // Drizzle schema definition (users, players, user_teams)
/lib
  computeStats.ts        // Function to compute derived player stats
/scripts
  import-csv.ts          // CSV import script for players

Features Checklist

Category	Task	Status
Signup Page	Create input fields: Username, Password, Confirm Password	Complete
	Display inline error messages if validation fails	Complete
	Prevent signup if any field is empty	Complete
	Ensure username is at least 8 characters and unique	Complete
	Validate password (must include at least one lowercase, one uppercase, and one special character)	Complete
	Confirm Password must match Password	Complete
	Implement real-time validation	Complete
	Display authentication-related errors above the CTA	Complete
	Show confirmation dialog upon successful signup	Complete
	Auto-redirect user to login after 2 seconds	Complete
	Implement dynamic password strength indicator	Complete
Login Page	Create input fields: Username, Password	Complete
	Display inline error messages if validation fails	Complete
	Prevent login if fields are empty	Complete
	Handle errors for invalid credentials	Complete
	Implement real-time validation	Complete
	Redirect to dashboard on successful login	Complete
	Enforce session management with logout redirect	Complete
	Show friendly error if email is not verified	Complete
Password Reset	“Forgot Password?” link on login page	Complete
	Forgot Password form for email input	Complete
	Send password reset email with token (expires in 10 minutes)	Complete
	Create Reset Password page (with token in URL)	Complete
	Validate reset token and update password	Complete
	Display friendly error messages for expired/invalid tokens	Complete
Email Verification	Send verification email on signup (using magic link)	Complete
	Verify email endpoint marks account as verified and redirects to dashboard	Complete
Admin Panel	Players View: CRUD operations with real-time updates, modals for edit/delete, clickable rows	Complete
	Player Stats View: Show computed stats (without showing individual player points to users)	Complete
	Tournament Summary View: Aggregate tournament statistics	Complete
User Interface	Auth Pages (login, signup, reset password)	Complete
	Players View: Read-only view (no selection allowed)	Complete
	Select Your Team View: Enable team selection (checkboxes, add/remove buttons)	Complete
	Team View: Display user’s selected players	Complete
	Budget View: Track remaining budget (initial Rs. 9,000,000)	Complete
	Leaderboard: Show username & total team points; highlight logged-in user	Complete
	Real-time updates across the UI	Complete
Chatbot (Spiriter)	Chatbot Interface: Allow users to query player data and team logic (without revealing player points)	Complete
UI/UX Enhancements	Consistent table/card layouts, responsive design, clear CTAs with pointer cursors	Complete
	Loader animations on all pages using API calls	Complete
	Dynamic navbar with role-based content	Complete

Computed Stats Logic

Player statistics are computed as follows:
	•	Batting Average:
[
\text{battingAverage} = \frac{\text{runs}}{\text{inningsPlayed}} \quad (\text{if inningsPlayed > 0, otherwise } 0)
]
	•	Batting Strike Rate:
[
\text{battingStrikeRate} = \left(\frac{\text{runs}}{\text{ballsFaced}}\right) \times 100 \quad (\text{if ballsFaced > 0, otherwise } 0)
]
	•	Bowling Economy:
[
\text{bowlingEconomy} = \frac{\text{runsConceded}}{\text{oversBowled}} \quad (\text{if oversBowled > 0, otherwise } 0)
]
	•	Bowling Strike Rate:
[
\text{bowlingStrikeRate} = \frac{\text{oversBowled} \times 6}{\text{wickets}} \quad (\text{if wickets > 0, otherwise } 0)
]
	•	Player Points:
[
\text{playerPoints} = \left(\frac{\text{battingStrikeRate}}{5} + \text{battingAverage} \times 0.8\right) + \left(\frac{500}{\text{bowlingStrikeRate}} + \frac{140}{\text{bowlingEconomy}}\right)
]
If bowlingStrikeRate or bowlingEconomy are 0, their portions are treated as 0.
	•	Player Value:
[
\text{playerValue} = \text{Round}\left(\text{playerPoints} \times 1000\right) \text{ to the nearest multiple of } 50,000
]

API Endpoints
	•	Admin Players API:
	•	GET /api/admin/players: Retrieve all players.
	•	GET /api/admin/players/[id]: Get details for a single player (including computed stats).
	•	POST /api/admin/players: Create a new player (raw and computed stats calculated on the fly).
	•	PUT /api/admin/players: Update an existing player (recalculate computed stats).
	•	DELETE /api/admin/players?id=...: Delete a player.
	•	Admin Stats API:
	•	GET /api/admin/stats: Returns computed stats for all players.
	•	Authentication API:
	•	Configured via NextAuth for login, signup, password reset, and email verification.
	•	User Team API:
	•	GET /api/user/team: Retrieve the current user’s selected team.
	•	POST /api/user/team: Add a player to the user’s team.
	•	DELETE /api/user/team: Remove a player from the user’s team.
	•	Chatbot API:
	•	POST /api/chat/spiriter: Query the chatbot for team suggestions (Gemini/Google Generative AI integration).

User Interface

Admin Panel
	•	Players View:
	•	CRUD operations with modals for editing and deleting.
	•	Clickable rows that navigate to a detailed player profile.
	•	Player Stats View:
	•	Displays computed stats (batting averages, strike rates, points, value, etc.) for all players.
	•	Tournament Summary View:
	•	Aggregates tournament data such as total runs, total wickets, highest run-scorer, and highest wicket-taker.

User Interface
	•	Players View:
	•	Read-only view of players (no selection allowed).
	•	Select Your Team View:
	•	Enables team selection (with checkboxes, add/remove buttons).
	•	Shows a loader while fetching data.
	•	Team View:
	•	Displays the user’s selected players.
	•	Budget View:
	•	Tracks the user’s spending against an initial budget of Rs. 9,000,000.
	•	Leaderboard:
	•	Displays users and their total team points in descending order.
	•	Chatbot (Spiriter):
	•	Provides team selection advice without revealing individual player points.

Testing
	•	Use Postman or your browser to test API endpoints.
	•	Verify that computed stats update dynamically upon CSV import, player creation, or updates.
	•	Ensure role-based restrictions are enforced (e.g., admin vs. user).

Deployment
	•	The project is optimized for deployment on Vercel.
	•	Set your environment variables in Vercel.
	•	Run migrations before deployment:

pnpm drizzle-kit generate
pnpm drizzle-kit up



Troubleshooting
	•	CSV Import Issues:
Verify that your CSV headers match your schema columns.
	•	Computed Stats Always Zero:
Ensure that CSV data is correctly imported and mapped to the proper columns (e.g., ballsFaced, inningsPlayed, etc.).
	•	Authentication Issues:
Double-check your NextAuth configuration and environment variables.
	•	API Errors:
Check server logs for any errors during CRUD operations.

Future Improvements
	•	Real-Time Updates:
Implement websockets or polling for live updates.
	•	Advanced Chatbot Integration:
Enhance the chatbot using Gemini API or another advanced AI service.
	•	Enhanced Role Management:
Further refine permissions between admin and user roles.
	•	Extended Testing:
Add unit and integration tests for API endpoints and UI components.
	•	Responsive Enhancements:
Continue improving UI/UX across all devices.