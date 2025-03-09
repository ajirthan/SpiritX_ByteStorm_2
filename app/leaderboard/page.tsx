"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface LeaderboardEntry {
  username: string;
  total_points: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data: LeaderboardEntry[]) => setEntries(data))
      .catch(() => setError("Failed to load leaderboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary py-8 px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-screen-xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Leaderboard
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <table className="min-w-full text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">Username</th>
              <th className="px-4 py-2 border-b">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-r">{entry.username}</td>
                <td className="px-4 py-2">{entry.total_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
