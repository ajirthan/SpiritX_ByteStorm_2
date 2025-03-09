"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string };
}) {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: params.token, password }),
    });

    const data = await res.json();
    setMessage(data.message);

    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-sm bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Set New Password
        </h2>
        <p className="text-sm text-gray-700 mb-6 text-center">
          Create a new password for your account.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer"
          >
            Save New Password
          </button>
        </form>
        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
