"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";

const signupSchema = z
  .object({
    username: z.string().min(8, "Username must be at least 8 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Signup failed");
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      setServerError("An unexpected error occurred");
      console.error(err);
    }
  };

  const passwordValue = watch("password") || "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto p-6 rounded"
    >
      <h2 className="text-3xl font-bold text-primary mb-4">Sign Up</h2>
      {serverError && <p className="text-red-500 mb-2">{serverError}</p>}
      {isSuccess && (
        <p className="text-green-600 mb-4">
          Signup successful! Redirecting to login...
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label className="block text-secondary mb-1" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="w-full p-2 border rounded"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-secondary mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <PasswordStrengthIndicator password={passwordValue} />
        </div>
        <div className="mb-4">
          <label
            className="block text-secondary mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full p-2 border rounded"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary transition-colors"
        >
          Sign Up
        </button>
      </form>
    </motion.div>
  );
}
