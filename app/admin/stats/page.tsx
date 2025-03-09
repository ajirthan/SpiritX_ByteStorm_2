"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerStats {
  name: string;
  battingAverage: number;
  battingStrikeRate: number;
  bowlingEconomy: number;
  bowlingStrikeRate: number;
  runs: number;
  wickets: number;
  playerPoints: number;
  playerValue: number;
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data: PlayerStats[]) => setStats(data))
      .catch(() => setError("Failed to load player stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-secondary py-8 px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-screen-xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Admin - Player Stats
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 w-48">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Batting Avg
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Batting SR
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Bowling Econ
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Bowling SR
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-24">
                  Runs
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-24">
                  Wickets
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Points
                </th>
                <th className="py-2 px-4 border-b border-gray-300 w-32">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.map((player, idx) => (
                <tr key={`${player.name}-${idx}`} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.name || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.battingAverage !== null
                      ? player.battingAverage.toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.battingStrikeRate !== null
                      ? player.battingStrikeRate.toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.bowlingEconomy !== null
                      ? player.bowlingEconomy.toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.bowlingStrikeRate !== null
                      ? player.bowlingStrikeRate.toFixed(2)
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.runs ?? 0}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.wickets ?? 0}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    {player.playerPoints.toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    {player.playerValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
