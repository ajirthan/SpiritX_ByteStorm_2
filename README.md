# SecureConnect

SecureConnect is a secure, user-friendly authentication system built for university hackathons. It enables users to sign up, log in, verify their email via magic links, and reset their passwords with tokens that expire after 10 minutes. The system is built with Next.js 15 (App Router), NextAuth, Drizzle ORM (with Neon PostgreSQL via Vercel Postgres), React Hook Form with Zod validations, Tailwind CSS (customized with a specific color palette), and Framer Motion for smooth transitions.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)
- [Task Checklist for Project 1](#task-checklist-for-project-1)
- [License](#license)

## Overview

SecureConnect provides:
- **User Signup:** Users can create an account with a unique username (email), a strong password, and real-time validation feedback. A magic verification email is sent upon signup.
- **User Login:** Users log in with their credentials. Unverified users receive a new verification email and a friendly error message.
- **Password Reset:** A “Forgot Password?” flow sends a reset link with a token that expires in 10 minutes. Users can then set a new password.
- **Dashboard:** A personalized landing page greets authenticated users and includes basic session management with logout.

## Features

- **Signup Page:**  
  - Three input fields: Username, Password, Confirm Password  
  - Inline error messages and real-time validation  
  - Username length and uniqueness checks  
  - Password complexity requirements (lowercase, uppercase, special character)  
  - Confirm Password matching  
  - Dynamic password strength indicator  
  - Confirmation dialog and auto-redirect to login  
  - Magic link email verification (sends verification email on signup)

- **Login Page:**  
  - Two input fields: Username and Password  
  - Inline error messages and real-time validation  
  - Friendly error handling for invalid credentials  
  - Prevent login if fields are empty  
  - If email is unverified, a new verification email is sent and a friendly error message is shown  
  - Redirects to a personalized dashboard on successful login  
  - Session management (JWT based)

- **Password Reset:**  
  - "Forgot Password?" link on login  
  - Forgot Password form: User enters email to receive reset link  
  - Reset link email includes a token that expires in 10 minutes  
  - Reset Password page to set a new password  
  - Error handling for expired/invalid tokens

- **Navigation & UI/UX Improvements:**  
  - Consistent card-style form containers (same width across forms)  
  - Clear and prominent CTAs wrapped in button elements with pointer cursors  
  - Clean design using the provided color palette ([ColorHunt Palette](https://colorhunt.co/palette/27374d526d829db2bfdde6ed))  
  - Smooth transitions using Framer Motion

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript  
- **Authentication:** NextAuth (with Credentials Provider)  
- **Database:** Neon PostgreSQL via Vercel Postgres & Drizzle ORM (migrations with drizzle-kit)  
- **Email Service:** Resend (using magic links)  
- **Form Handling:** React Hook Form & Zod  
- **Styling:** Tailwind CSS v4 (customized with a specific color palette)  
- **Animations:** Framer Motion  
- **Deployment:** Vercel

## Installation and Setup

1. **Clone the Repository:**

   ```bash
   git clone <repository_url>
   cd secureconnect
2. **Install Dependencies:**
Using pnpm:
`pnpm install`
###

3. **Set Up Environment Variables:**
Create a .env.local file in the project root with the following (update with your actual values):

    ```env
    POSTGRES_URL=postgres://neondb_owner:your_password@ep-small-recipe-xxxxxxx-pooler.ap-southeast-1.aws.neon.tech/secureconnect?sslmode=require
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_super_secret_random_string
    RESEND_API_KEY=your_resend_api_key
4. **Generate and Apply Migrations:**
Generate migration files based on your schema:

`pnpm drizzle-kit generate`

Apply migrations to create your tables in Neon:

`pnpm drizzle-kit up`

Running the Project

Start the development server using Bun:

`bun run dev`

Visit http://localhost:3000. The home page will redirect to the login page by default.

Deployment

Deploy to Vercel by connecting your repository to Vercel and configuring the environment variables (**POSTGRES_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, RESEND_API_KEY**) in the Vercel dashboard.