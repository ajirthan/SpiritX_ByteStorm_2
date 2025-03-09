"use client";

import { useState } from "react";
import { marked } from "marked";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SpiriterPage() {
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChat = async () => {
    setError("");
    setResponseText("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat/spiriter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Chat request failed");
      } else {
        setResponseText(data.response);
      }
    } catch (err) {
      setError("Failed to communicate with Gemini API");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const htmlContent = marked(responseText || "");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 relative">
      <div className="w-full max-w-2xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Spiriter (Chatbot)
        </h2>
        <div className="mb-4">
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="Ask about players, stats, team budget, or team points..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleChat}
          className="py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer w-full"
        >
          Ask Spiriter
        </button>
        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {responseText && (
          <div
            className="text-gray-700 mt-4 bg-gray-100 p-3 rounded"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
}
