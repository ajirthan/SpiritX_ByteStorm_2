"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type LoginFormData = {
  username: string;
  password: string;
};

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid username or password. Please try again.",
  EmailNotVerified:
    "Your email is not verified. A new confirmation email has been sent. Please verify your email before logging in.",
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setError("");

    // Sign in with next-auth credentials provider
    const res = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (res?.error) {
      // Show a user-friendly message if signIn returns an error key we know
      const friendlyMessage =
        ERROR_MESSAGES[res.error] ||
        "An unexpected error occurred. Please try again.";
      setError(friendlyMessage);
    } else {
      // No error => fetch session to determine role
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();

        // If user is admin => /admin/players, else => /user/select-team
        if (sessionData?.user?.role === "admin") {
          router.push("/admin/players");
        } else {
          router.push("/user/select-team");
        }
      } catch (err) {
        setError("Failed to retrieve session. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
      noValidate
    >
      <div className="mb-4">
        <label className="block text-secondary mb-1" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="w-full p-2 border rounded"
          {...register("username", { required: "Username is required" })}
        />
      </div>
      <div className="mb-4">
        <label className="block text-secondary mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full p-2 border rounded"
          {...register("password", { required: "Password is required" })}
        />
      </div>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary transition-colors"
      >
        Login
      </button>
    </motion.form>
  );
}
