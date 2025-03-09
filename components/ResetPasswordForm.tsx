"use client";

import { useState } from "react";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer"
      >
        Send Reset Link
      </button>
      {message && <p className="text-green-600 mt-2 text-center">{message}</p>}
    </form>
  );
}
