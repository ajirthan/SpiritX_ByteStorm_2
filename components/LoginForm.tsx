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
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto p-6 bg-light rounded shadow"
    >
      <h2 className="text-3xl font-bold text-primary mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary transition-colors"
        >
          Login
        </button>
      </form>
    </motion.div>
  );
}
