"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Player {
  id: number;
  name: string;
  university: string;
  runs: number;
  wickets: number;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    runs: "0",
    wickets: "0",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/players");
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      setError("Failed to load players.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    type PlayerPayload = {
      id?: number;
      name: string;
      university: string;
      runs: number;
      wickets: number;
    };

    const payload: PlayerPayload = {
      name: formData.name,
      university: formData.university,
      runs: parseInt(formData.runs, 10),
      wickets: parseInt(formData.wickets, 10),
    };

    const url = "/api/admin/players";
    let method = "POST";
    if (editId) {
      method = "PUT";
      payload.id = editId;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create/update player.");
      } else {
        setMessage(editId ? "Player updated." : "Player created.");
        setFormData({ name: "", university: "", runs: "0", wickets: "0" });
        setEditId(null);
        loadPlayers();
      }
    } catch (err) {
      setError("An unexpected error occurred while creating/updating.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (playerId: number) => {
    setLoading(true);
    setError("");
    setMessage("");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this player?"
    );
    if (!confirmDelete) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/players?id=${playerId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete player.");
      } else {
        setMessage("Player deleted.");
        loadPlayers();
      }
    } catch (err) {
      setError("An unexpected error occurred while deleting.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (player: Player) => {
    setEditId(player.id);
    setFormData({
      name: player.name,
      university: player.university,
      runs: player.runs.toString(),
      wickets: player.wickets.toString(),
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ name: "", university: "", runs: "0", wickets: "0" });
    setError("");
    setMessage("Edit cancelled.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-secondary py-8 px-4">
      <div className="relative w-full max-w-screen-xl bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Admin - Players View
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {message && (
          <p className="text-green-500 text-center mb-4">{message}</p>
        )}

        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <LoadingSpinner />
          </div>
        )}

        {/* Create/Edit Form */}
        <form
          onSubmit={handleCreateOrUpdate}
          className="mb-6 flex flex-col space-y-4 max-w-md mx-auto"
        >
          <input
            className="border p-2 rounded"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="University"
            value={formData.university}
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
            required
          />
          <input
            className="border p-2 rounded"
            placeholder="Runs"
            type="number"
            value={formData.runs}
            onChange={(e) => setFormData({ ...formData, runs: e.target.value })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Wickets"
            type="number"
            value={formData.wickets}
            onChange={(e) =>
              setFormData({ ...formData, wickets: e.target.value })
            }
          />
          <div className="flex space-x-4">
            <button className="py-2 px-4 bg-primary text-light rounded hover:bg-secondary cursor-pointer flex-1">
              {editId ? "Update Player" : "Create Player"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="py-2 px-4 bg-gray-400 text-light rounded hover:bg-gray-500 cursor-pointer flex-1"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Players Table */}
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
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-r border-gray-300">
                    {player.id}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {player.name}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {player.university}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {player.runs}
                  </td>
                  <td className="px-4 py-2 border-r border-gray-300">
                    {player.wickets}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => startEdit(player)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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
