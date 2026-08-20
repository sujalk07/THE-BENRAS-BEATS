"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  User,
  X,
  Upload,
  Crown,
  Sparkles,
} from "lucide-react";

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
      const res = await fetch(
        `/api/admin/featured-members?userId=${user.id}`
      );

      const data = await res.json();

      if (res.ok) {
        setMembers(data.members ?? []);
      }
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
    setForm({
      name: "",
      profession: "",
      photo_url: "",
      details: "",
      display_order: 0,
    });

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

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

      setForm((prev) => ({
        ...prev,
        photo_url: data.url,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !form.name.trim()) {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          ...form,
        }),
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

    if (!confirm("Remove this member from the showcase?")) {
      return;
    }

    setDeletingId(id);

    try {
      const res = await fetch(
        `/api/admin/featured-members/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }

      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
              <Crown size={16} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              Community
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Esteemed Members
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Curate the members showcased across The Benaras Beats.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-amber-500/10 transition hover:bg-amber-400"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="relative mt-7 overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.025] to-transparent shadow-xl shadow-black/20">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-500/10 blur-[80px]" />

          <div className="relative border-b border-white/5 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                  {editingId ? "Update Profile" : "New Profile"}
                </p>

                <h2 className="mt-1 text-lg font-semibold text-white">
                  {editingId
                    ? "Edit Esteemed Member"
                    : "Add Esteemed Member"}
                </h2>
              </div>

              <button
                onClick={resetForm}
                className="rounded-lg border border-white/10 p-2 text-gray-500 transition hover:border-white/20 hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="relative grid gap-5 p-6">
            {/* Name + Profession */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Member name"
                  className="w-full rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Profession
                </label>

                <input
                  type="text"
                  value={form.profession}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      profession: e.target.value,
                    }))
                  }
                  placeholder="Classical Vocalist, Entrepreneur..."
                  className="w-full rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
                />
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Details / Bio
                <span className="ml-2 font-normal tracking-normal text-gray-700">
                  Optional
                </span>
              </label>

              <textarea
                value={form.details}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    details: e.target.value,
                  }))
                }
                rows={3}
                placeholder="A short description about this member..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-gray-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
              />
            </div>

            {/* Photo + Order */}
            <div className="grid gap-5 md:grid-cols-[1fr_180px]">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Profile Photo
                  <span className="ml-2 font-normal tracking-normal text-gray-700">
                    Optional
                  </span>
                </label>

                <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-4 transition hover:border-amber-400/30 hover:bg-amber-400/[0.02]">
                  <Upload
                    size={20}
                    className="mb-2 text-amber-400"
                  />

                  <span className="text-xs font-medium text-gray-300">
                    {uploading
                      ? "Uploading..."
                      : "Click to upload photo"}
                  </span>

                  <span className="mt-1 text-[10px] text-gray-600">
                    JPG, PNG or WebP
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {form.photo_url && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={form.photo_url}
                      alt="Preview"
                      className="h-14 w-14 rounded-xl border border-white/10 object-cover"
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-300">
                        Photo uploaded
                      </p>
                      <p className="truncate text-[10px] text-gray-600">
                        {form.photo_url}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Display Order
                </label>

                <input
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      display_order: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
                />

                <p className="mt-2 text-[10px] leading-relaxed text-gray-600">
                  Lower numbers appear first.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={saving || uploading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/10 transition hover:from-amber-300 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {saving
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add Member"}
            </button>
          </div>
        </div>
      )}

      {/* Members */}
      {loading ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] py-16 text-sm text-gray-500">
          <Loader2
            size={17}
            className="mr-2 animate-spin text-amber-400"
          />
          Loading members...
        </div>
      ) : members.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
            <Sparkles size={20} />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            No esteemed members yet
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Add your first member to the showcase.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#090a0d] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:shadow-xl hover:shadow-black/30"
            >
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-500/5 blur-3xl transition group-hover:bg-amber-500/10" />

              <div className="relative flex items-center gap-3">
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="h-14 w-14 rounded-full border border-amber-400/20 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400/10 bg-amber-400/5 text-amber-400">
                    <User size={20} />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {member.name}
                  </h3>

                  {member.profession && (
                    <p className="mt-0.5 truncate text-xs text-amber-400">
                      {member.profession}
                    </p>
                  )}
                </div>

                <div className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/5 text-[9px] font-bold text-amber-400/70">
                  {member.display_order}
                </div>
              </div>

              {member.details && (
                <p className="relative mt-4 line-clamp-2 text-xs leading-relaxed text-gray-500">
                  {member.details}
                </p>
              )}

              <div className="relative mt-5 flex gap-2 border-t border-white/5 pt-4">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-semibold text-gray-400 transition hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-amber-400"
                >
                  <Pencil size={12} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(member.id)}
                  disabled={deletingId === member.id}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-semibold text-gray-400 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400 disabled:opacity-50"
                >
                  {deletingId === member.id ? (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={12} />
                  )}

                  {deletingId === member.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}