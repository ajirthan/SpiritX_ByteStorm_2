"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerStats {
  id: number;
  name: string;
  university: string;
  runs: number;
  wickets: number;
}

interface CustomSessionUser {
  id: string;
  role?: string;
  name?: string;
}

export default function SelectTeamPage() {
  const { data: session } = useSession();
  const [allPlayers, setAllPlayers] = useState<PlayerStats[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data: PlayerStats[]) => setAllPlayers(data))
      .catch(() => setError("Failed to load players."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (session?.user) {
      const userId = (session.user as CustomSessionUser).id;
      setLoading(true);
      fetch(`/api/user/team?userId=${userId}`)
        .then((res) => res.json())
        .then((data: { playerId: number }[]) => {
          const selectedIds = data.map((p) => p.playerId);
          setSelected(selectedIds);
        })
        .catch(() => setError("Failed to load selected players."))
        .finally(() => setLoading(false));
    }
  }, [session]);

  if (!session?.user) {
    return (
      <p className="min-h-screen flex items-center justify-center">
        Loading...
      </p>
    );
  }
  const user = session.user as CustomSessionUser;

  const addPlayer = async (playerId: number) => {
    setError("");
    setMessage("");
    if (selected.length >= 11) {
      setError("Team is already complete.");
      return;
    }
    if (selected.includes(playerId)) {
      setError("Player already selected.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(user.id, 10), playerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add player.");
      } else {
        setSelected((prev) => [...prev, playerId]);
        setMessage("Player added successfully.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removePlayer = async (playerId: number) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(user.id, 10), playerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to remove player.");
      } else {
        setSelected((prev) => prev.filter((id) => id !== playerId));
        setMessage("Player removed successfully.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-secondary py-8 px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-screen-xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Select Your Team
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b border-gray-300">ID</th>
                <th className="px-4 py-2 border-b border-gray-300">Name</th>
                <th className="px-4 py-2 border-b border-gray-300">
                  University
                </th>
                <th className="px-4 py-2 border-b border-gray-300">Runs</th>
                <th className="px-4 py-2 border-b border-gray-300">Wickets</th>
                <th className="px-4 py-2 border-b border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allPlayers.map((p) => {
                const isSelected = selected.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={
                      isSelected
                        ? "bg-green-50 hover:bg-green-100"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-4 py-2 border-r border-gray-300">
                      {p.id}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {p.name}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {p.university}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {p.runs}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300">
                      {p.wickets}
                    </td>
                    <td className="px-4 py-2">
                      {isSelected ? (
                        <button
                          onClick={() => removePlayer(p.id)}
                          className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={() => addPlayer(p.id)}
                          disabled={selected.length >= 11}
                          className={`py-1 px-3 ${
                            selected.length >= 11
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-primary hover:bg-secondary cursor-pointer"
                          } text-light rounded transition-colors`}
                        >
                          Add
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center">Team count: {selected.length} / 11</p>
      </div>
    </div>
  );
}
