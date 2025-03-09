"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

interface PlayerDetails {
  id: number;
  name: string;
  university: string;
  runs: number | null;
  wickets: number | null;
  ballsFaced: number | null;
  inningsPlayed: number | null;
  oversBowled: number | null;
  runsConceded: number | null;
  battingAverage: number | null;
  battingStrikeRate: number | null;
  bowlingEconomy: number | null;
  bowlingStrikeRate: number | null;
  playerPoints: number | null;
  playerValue: number | null;
}

export default function AdminPlayerDetailsPage() {
  const { id } = useParams(); // Extract player's id from URL
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safe formatting function: returns a formatted number if defined, else "N/A"
  const formatNumber = (
    num: number | null | undefined,
    decimals: number = 2
  ) => (typeof num === "number" ? num.toFixed(decimals) : "N/A");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/admin/players/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch player details");
        }
        return res.json();
      })
      .then((data: PlayerDetails) => setPlayer(data))
      .catch((err) => {
        setError(err.message || "Error loading player details.");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <p className="text-center">No player details found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-secondary py-8 px-4">
      <div className="w-full max-w-3xl bg-white rounded shadow-lg p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm text-primary hover:underline"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">
          Player Details
        </h1>
        <div className="space-y-4">
          <p>
            <strong>ID:</strong> {player.id}
          </p>
          <p>
            <strong>Name:</strong> {player.name}
          </p>
          <p>
            <strong>University:</strong> {player.university}
          </p>
          <p>
            <strong>Runs:</strong> {player.runs !== null ? player.runs : "N/A"}
          </p>
          <p>
            <strong>Wickets:</strong>{" "}
            {player.wickets !== null ? player.wickets : "N/A"}
          </p>
          <p>
            <strong>Balls Faced:</strong>{" "}
            {player.ballsFaced !== null ? player.ballsFaced : "N/A"}
          </p>
          <p>
            <strong>Innings Played:</strong>{" "}
            {player.inningsPlayed !== null ? player.inningsPlayed : "N/A"}
          </p>
          <p>
            <strong>Overs Bowled:</strong>{" "}
            {player.oversBowled !== null ? player.oversBowled : "N/A"}
          </p>
          <p>
            <strong>Runs Conceded:</strong>{" "}
            {player.runsConceded !== null ? player.runsConceded : "N/A"}
          </p>
          <p>
            <strong>Batting Average:</strong>{" "}
            {formatNumber(player.battingAverage)}
          </p>
          <p>
            <strong>Batting Strike Rate:</strong>{" "}
            {formatNumber(player.battingStrikeRate)}
          </p>
          <p>
            <strong>Bowling Economy:</strong>{" "}
            {formatNumber(player.bowlingEconomy)}
          </p>
          <p>
            <strong>Bowling Strike Rate:</strong>{" "}
            {formatNumber(player.bowlingStrikeRate)}
          </p>
          <p>
            <strong>Player Points:</strong> {formatNumber(player.playerPoints)}
          </p>
          <p>
            <strong>Player Value:</strong>{" "}
            {typeof player.playerValue === "number"
              ? player.playerValue.toLocaleString()
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
