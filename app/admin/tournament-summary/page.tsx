"use client";

import { useEffect, useState } from "react";

interface TournamentSummary {
  total_runs: number;
  total_wickets: number;
  highest_run_scorer: string;
  highest_wicket_taker: string;
}

export default function TournamentSummaryPage() {
  const [summary, setSummary] = useState<TournamentSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/tournament-summary")
      .then((res) => res.json())
      .then((data: TournamentSummary) => setSummary(data))
      .catch(() => setError("Failed to load tournament summary."));
  }, []);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!summary) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Tournament Summary
        </h2>
        <ul className="text-gray-700">
          <li>
            <strong>Total Runs:</strong> {summary.total_runs}
          </li>
          <li>
            <strong>Total Wickets:</strong> {summary.total_wickets}
          </li>
          <li>
            <strong>Highest Run Scorer:</strong> {summary.highest_run_scorer}
          </li>
          <li>
            <strong>Highest Wicket Taker:</strong>{" "}
            {summary.highest_wicket_taker}
          </li>
        </ul>
      </div>
    </div>
  );
}
