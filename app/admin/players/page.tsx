"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

// Types
interface Player {
  id: number;
  name: string;
  university: string;
  runs: number;
  wickets: number;
}

// ========== Edit Modal Component ==========
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onSave: (updatedPlayer: Player) => void;
}

function EditModal({ isOpen, onClose, player, onSave }: EditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    runs: "0",
    wickets: "0",
  });

  // Populate form data when modal opens for editing
  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name,
        university: player.university,
        runs: player.runs.toString(),
        wickets: player.wickets.toString(),
      });
    } else {
      setFormData({ name: "", university: "", runs: "0", wickets: "0" });
    }
  }, [player]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!player && formData.name.trim() === "") return;
    const updated: Player = {
      id: player ? player.id : 0, // New players: id assigned on server
      name: formData.name,
      university: formData.university,
      runs: parseInt(formData.runs, 10),
      wickets: parseInt(formData.wickets, 10),
    };
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Player</h2>
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border p-2 w-full rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">University</label>
          <input
            className="border p-2 w-full rounded"
            value={formData.university}
            onChange={(e) =>
              setFormData({ ...formData, university: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Runs</label>
          <input
            type="number"
            min="0"
            className="border p-2 w-full rounded"
            value={formData.runs}
            onChange={(e) => setFormData({ ...formData, runs: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-1">Wickets</label>
          <input
            type="number"
            min="0"
            className="border p-2 w-full rounded"
            value={formData.wickets}
            onChange={(e) =>
              setFormData({ ...formData, wickets: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            className="flex-1 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 bg-primary text-white rounded hover:bg-secondary"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== Delete Modal Component ==========
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
  onDelete: (playerId: number) => void;
}

function DeleteModal({ isOpen, onClose, player, onDelete }: DeleteModalProps) {
  if (!isOpen || !player) return null;

  const handleConfirm = () => {
    onDelete(player.id);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Delete Player</h2>
        <p className="mb-6">
          Are you sure you want to delete <strong>{player.name}</strong>?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="flex-1 py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ========== AdminPlayersPage ==========
export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // For modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const router = useRouter();

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

  // ============ CREATE/UPDATE LOGIC ============
  const handleSavePlayer = async (updatedPlayer: Player) => {
    setIsEditModalOpen(false);
    setLoading(true);
    setError("");
    setMessage("");

    const url = "/api/admin/players";
    let method = "POST";
    const payload: any = {
      name: updatedPlayer.name,
      university: updatedPlayer.university,
      runs: updatedPlayer.runs,
      wickets: updatedPlayer.wickets,
    };

    if (updatedPlayer.id) {
      method = "PUT";
      payload.id = updatedPlayer.id;
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
        setMessage(updatedPlayer.id ? "Player updated." : "Player created.");
        loadPlayers();
      }
    } catch (err) {
      setError("An unexpected error occurred while creating/updating.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============ DELETE LOGIC ============
  const handleDeletePlayer = async (playerId: number) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    setError("");
    setMessage("");

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

  // ============ Handlers for UI Buttons ============
  const openEditModal = (player: Player | null) => {
    setSelectedPlayer(player);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (player: Player) => {
    setSelectedPlayer(player);
    setIsDeleteModalOpen(true);
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

        {/* Loader overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <LoadingSpinner />
          </div>
        )}

        {/* Button to open modal for creating a new player */}
        <button
          className="mb-4 py-2 px-4 bg-primary text-white rounded"
          onClick={() => openEditModal(null)}
        >
          + Create New Player
        </button>

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
                <tr
                  key={player.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/admin/players/${player.id}`)}
                >
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
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(player);
                        }}
                        className="flex-1 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(player);
                        }}
                        className="flex-1 py-1 px-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        player={selectedPlayer}
        onSave={handleSavePlayer}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        player={selectedPlayer}
        onDelete={handleDeletePlayer}
      />
    </div>
  );
}
