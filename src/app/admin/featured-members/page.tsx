"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Plus, Pencil, Trash2, User, X } from "lucide-react";

interface FeaturedMember {
  id: string;
  name: string;
  profession: string | null;
  photo_url: string | null;
  details: string | null;
  display_order: number;
}

export default function AdminFeaturedMembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<FeaturedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    profession: "",
    photo_url: "",
    details: "",
    display_order: 0,
  });

  const fetchMembers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/featured-members?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) setMembers(data.members ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  const resetForm = () => {
    setForm({ name: "", profession: "", photo_url: "", details: "", display_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (member: FeaturedMember) => {
    setForm({
      name: member.name,
      profession: member.profession ?? "",
      photo_url: member.photo_url ?? "",
      details: member.details ?? "",
      display_order: member.display_order,
    });
    setEditingId(member.id);
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

      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, photo_url: data.url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !form.name) {
      alert("Name is required.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId
        ? `/api/admin/featured-members/${editingId}`
        : "/api/admin/featured-members";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to save member");
        return;
      }

      resetForm();
      fetchMembers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!confirm("Remove this member from the showcase?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/featured-members/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== id));
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
          <h1 className="text-3xl font-bold">Esteemed Members</h1>
          <p className="mt-1 text-sm text-gray-400">Curated member showcase shown to all members.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">{editingId ? "Edit Member" : "Add Member"}</h2>
            <button onClick={resetForm} className="text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Profession</label>
              <input
                type="text"
                value={form.profession}
                onChange={(e) => setForm((p) => ({ ...p, profession: e.target.value }))}
                placeholder="e.g., Classical Vocalist, Entrepreneur, Musician"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Details / Bio (optional)</label>
              <textarea
                value={form.details}
                onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">
                Photo (optional — leave blank if not available)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
              />
              {uploading && <p className="mt-2 text-xs text-amber-400">Uploading...</p>}
              {form.photo_url && (
                <img
                  src={form.photo_url}
                  alt="Preview"
                  className="mt-3 h-24 w-24 rounded-full object-cover border border-white/10"
                />
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
              {saving ? "Saving..." : editingId ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : members.length === 0 ? (
        <p className="mt-8 text-gray-500">No esteemed members added yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <User size={18} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white">{m.name}</h3>
                  {m.profession && <p className="text-xs text-amber-400">{m.profession}</p>}
                </div>
              </div>
              {m.details && <p className="mt-3 text-sm text-gray-400 line-clamp-2">{m.details}</p>}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs font-semibold text-gray-300 hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  <Pencil size={12} className="inline mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  disabled={deletingId === m.id}
                  className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs font-semibold text-gray-300 hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50"
                >
                  {deletingId === m.id ? (
                    <Loader2 size={12} className="inline animate-spin" />
                  ) : (
                    <Trash2 size={12} className="inline mr-1" />
                  )}
                  {deletingId !== m.id && "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}