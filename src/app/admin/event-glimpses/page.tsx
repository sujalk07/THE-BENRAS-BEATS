"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Plus, Pencil, Trash2, X, Image as ImageIcon, Video } from "lucide-react";

interface Glimpse {
  id: string;
  media_type: "image" | "video";
  media_url: string;
  caption: string | null;
  display_order: number;
}

export default function AdminEventGlimpsesPage() {
  const { user } = useAuth();
  const [glimpses, setGlimpses] = useState<Glimpse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    media_type: "image" as "image" | "video",
    media_url: "",
    caption: "",
    display_order: 0,
  });

  const fetchGlimpses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/event-glimpses?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) setGlimpses(data.glimpses ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlimpses();
  }, [user]);

  const resetForm = () => {
    setForm({ media_type: "image", media_url: "", caption: "", display_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (g: Glimpse) => {
    setForm({
      media_type: g.media_type,
      media_url: g.media_url,
      caption: g.caption ?? "",
      display_order: g.display_order,
    });
    setEditingId(g.id);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/admin/upload-glimpse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }
      setForm((prev) => ({ ...prev, media_url: data.url, media_type: data.mediaType }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !form.media_url) {
      alert("Please upload a file first.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/event-glimpses/${editingId}` : "/api/admin/event-glimpses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save");
        return;
      }

      resetForm();
      fetchGlimpses();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Delete this glimpse?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/event-glimpses/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }
      setGlimpses((prev) => prev.filter((g) => g.id !== id));
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
          <h1 className="text-3xl font-bold">Event Glimpses</h1>
          <p className="mt-1 text-sm text-gray-400">Photos and videos from past events, shown in a carousel on the homepage.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          <Plus size={16} /> Add Glimpse
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{editingId ? "Edit Glimpse" : "Add Glimpse"}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">
                Upload Image or Video
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
              />
              {uploading && <p className="mt-2 text-xs text-amber-400">Uploading...</p>}
              {form.media_url && form.media_type === "image" && (
                <img src={form.media_url} alt="Preview" className="mt-3 h-40 w-full rounded-lg object-cover border border-white/10" />
              )}
              {form.media_url && form.media_type === "video" && (
                <video src={form.media_url} controls className="mt-3 h-40 w-full rounded-lg object-cover border border-white/10" />
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Caption (optional)</label>
              <input
                type="text"
                value={form.caption}
                onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                placeholder="e.g., Ganga Aarti Night, March 2026"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
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
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Glimpse"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : glimpses.length === 0 ? (
        <p className="mt-8 text-gray-500">No glimpses added yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {glimpses.map((g) => (
            <div key={g.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="relative h-36 w-full overflow-hidden rounded-lg bg-black/40">
                {g.media_type === "image" ? (
                  <img src={g.media_url} alt={g.caption ?? ""} className="h-full w-full object-cover" />
                ) : (
                  <video src={g.media_url} className="h-full w-full object-cover" muted />
                )}
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white">
                  {g.media_type === "image" ? <ImageIcon size={10} /> : <Video size={10} />}
                  {g.media_type}
                </span>
              </div>
              {g.caption && <p className="mt-3 text-sm text-gray-300">{g.caption}</p>}
              <p className="mt-1 text-xs text-gray-500">Order: {g.display_order}</p>

              <div className="mt-3 flex gap-2">
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