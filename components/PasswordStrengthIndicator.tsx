// components/PasswordStrengthIndicator.tsx
"use client";

import React from "react";

type Props = {
  password: string;
};

export default function PasswordStrengthIndicator({ password }: Props) {
  const getStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    return score;
  };

  const strength = getStrength(password);
  const strengthLabel =
    strength <= 2 ? "Weak" : strength <= 4 ? "Moderate" : "Strong";
  const strengthColor =
    strength <= 2
      ? "bg-red-500"
      : strength <= 4
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="mt-2">
      <div className="w-full h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${strengthColor}`}
          style={{ width: `${(strength / 5) * 100}%` }}
        ></div>
      </div>
      <p className="text-sm text-secondary mt-1">Strength: {strengthLabel}</p>
    </div>
  );
}
