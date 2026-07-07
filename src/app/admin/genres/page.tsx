"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Plus, Pencil, Trash2, Music, X } from "lucide-react";

interface Genre {
  id: string;
  genre_name: string;
  description: string | null;
  image_url: string | null;
  audio_url: string | null;
  display_order: number;
}

export default function AdminGenresPage() {
  const { user } = useAuth();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    genre_name: "",
    description: "",
    image_url: "",
    audio_url: "",
    display_order: 0,
  });

  const fetchGenres = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/genres?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) setGenres(data.genres ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [user]);

  const resetForm = () => {
    setForm({ genre_name: "", description: "", image_url: "", audio_url: "", display_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (genre: Genre) => {
    setForm({
      genre_name: genre.genre_name,
      description: genre.description ?? "",
      image_url: genre.image_url ?? "",
      audio_url: genre.audio_url ?? "",
      display_order: genre.display_order,
    });
    setEditingId(genre.id);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/admin/upload-image", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Image upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, image_url: data.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/admin/upload-audio", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Audio upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, audio_url: data.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !form.genre_name) {
      alert("Genre name is required.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/genres/${editingId}` : "/api/admin/genres";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save genre");
        return;
      }

      resetForm();
      fetchGenres();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this genre sample?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/genres/${id}?userId=${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }
      setGenres((prev) => prev.filter((g) => g.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Music Genres</h1>
          <p className="mt-1 text-sm text-gray-400">Genre showcase with playable audio samples.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          <Plus size={16} /> Add Genre
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{editingId ? "Edit Genre" : "Add Genre"}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Genre Name</label>
              <input
                type="text"
                value={form.genre_name}
                onChange={(e) => setForm((p) => ({ ...p, genre_name: e.target.value }))}
                placeholder="e.g., Indian Classical"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Cover Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
              />
              {uploadingImage && <p className="mt-2 text-xs text-amber-400">Uploading image...</p>}
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="mt-3 h-28 w-full rounded-lg object-cover border border-white/10" />
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Audio Sample</label>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/x-m4a"
                onChange={handleAudioUpload}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
              />
              {uploadingAudio && <p className="mt-2 text-xs text-amber-400">Uploading audio...</p>}
              {form.audio_url && (
                <audio controls src={form.audio_url} className="mt-3 w-full" />
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">
                Display Order (lower shows first)
              </label>
              <input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Genre"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : genres.length === 0 ? (
        <p className="mt-8 text-gray-500">No genres added yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((g) => (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                {g.image_url ? (
                  <img src={g.image_url} alt={g.genre_name} className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                    <Music size={18} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white">{g.genre_name}</h3>
                  <p className="text-xs text-gray-500">
                    {g.audio_url ? "Audio uploaded" : "No audio yet"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(g)}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs font-semibold text-gray-300 hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  <Pencil size={12} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(g.id)}
                  disabled={deletingId === g.id}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs font-semibold text-gray-300 hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50"
                >
                  {deletingId === g.id ? (
                    <Loader2 size={12} className="inline animate-spin" />
                  ) : (
                    <Trash2 size={12} className="inline mr-1" />
                  )}
                  {deletingId !== g.id && "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}