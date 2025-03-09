"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BudgetPage() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const INITIAL_BUDGET = 9000000;
  const PLAYER_COST = 500000;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/user/team?userId=1`)
      .then((res) => res.json())
      .then((data) => setSelectedCount(data.length))
      .catch(() => setError("Failed to load team data."))
      .finally(() => setLoading(false));
  }, []);

  const remainingBudget = INITIAL_BUDGET - selectedCount * PLAYER_COST;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary py-8 px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
          <LoadingSpinner />
        </div>
      )}
      <div className="w-full max-w-screen-xl bg-white rounded shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Budget</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <p className="text-lg">
          Initial Budget: Rs. {INITIAL_BUDGET.toLocaleString()}
        </p>
        <p className="text-lg">Players Selected: {selectedCount}</p>
        <p className="text-lg font-bold">
          Remaining Budget: Rs. {remainingBudget.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
