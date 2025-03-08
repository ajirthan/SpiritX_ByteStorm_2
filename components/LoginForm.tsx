// components/LoginForm.tsx
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

// Map known error codes/messages to friendly text
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid username or password. Please try again.",
  EmailNotVerified:
    "Your email is not verified. Please check your inbox and verify your email before logging in.",
};

export default function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (res?.error) {
      // Map the error returned from NextAuth to a friendly message
      const friendlyMessage =
        ERROR_MESSAGES[res.error] ||
        "An unexpected error occurred. Please try again.";
      setError(friendlyMessage);
    } else {
      router.push("/dashboard");
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
