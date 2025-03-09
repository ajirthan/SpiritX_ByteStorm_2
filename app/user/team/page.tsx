"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface SelectedPlayer {
  playerId: number;
  name: string;
  university: string;
  runs: number;
  wickets: number;
}

interface CustomSessionUser {
  id: string;
}

export default function UserTeamPage() {
  const { data: session } = useSession();
  const [teamPlayers, setTeamPlayers] = useState<SelectedPlayer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const userId = (session.user as CustomSessionUser).id;
      setLoading(true);
      fetch(`/api/user/team?userId=${userId}`)
        .then((res) => res.json())
        .then((data: SelectedPlayer[]) => setTeamPlayers(data))
        .catch(() => setError("Failed to load your team."))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (!session?.user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary py-8 px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-screen-xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Your Team
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {teamPlayers.length === 0 ? (
          <p className="text-center">
            You haven&apos;t selected any players yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">ID</th>
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">University</th>
                  <th className="px-4 py-2 border-b">Runs</th>
                  <th className="px-4 py-2 border-b">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamPlayers.map((player) => (
                  <tr key={player.playerId} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{player.playerId}</td>
                    <td className="px-4 py-2">{player.name}</td>
                    <td className="px-4 py-2">{player.university}</td>
                    <td className="px-4 py-2">{player.runs}</td>
                    <td className="px-4 py-2">{player.wickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
