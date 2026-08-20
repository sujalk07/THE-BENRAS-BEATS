"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Music,
  X,
  Upload,
  Image as ImageIcon,
  Headphones,
  Sparkles,
} from "lucide-react";

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

      if (res.ok) {
        setGenres(data.genres ?? []);
      }
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
    setForm({
      genre_name: "",
      description: "",
      image_url: "",
      audio_url: "",
      display_order: 0,
    });

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    setUploadingImage(true);

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
        alert(data.error || "Image upload failed");
        return;
      }

      setForm((prev) => ({
        ...prev,
        image_url: data.url,
      }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAudioUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    setUploadingAudio(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("userId", user.id);

      const res = await fetch("/api/admin/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Audio upload failed");
        return;
      }

      setForm((prev) => ({
        ...prev,
        audio_url: data.url,
      }));
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
      const url = editingId
        ? `/api/admin/genres/${editingId}`
        : "/api/admin/genres";

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
      const res = await fetch(
        `/api/admin/genres/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

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
    <div className="min-h-screen text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
              <Music size={16} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400">
              Music Library
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Music Genres
          </h1>

          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Manage the genres, artwork, and playable samples featured
            across The Benaras Beats.
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
          Add Genre
        </button>
      </div>

      {/* HEADER LINE */}
      <div className="mt-7 h-px bg-gradient-to-r from-amber-400/20 via-white/5 to-transparent" />

      {/* FORM */}
      {showForm && (
        <div className="relative mt-7 overflow-hidden rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.06] via-white/[0.025] to-transparent shadow-xl shadow-black/20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-amber-500/10 blur-[90px]" />

          <div className="relative flex items-center justify-between border-b border-white/5 px-6 py-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
                {editingId ? "Update Genre" : "New Genre"}
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {editingId ? "Edit Music Genre" : "Create Music Genre"}
              </h2>
            </div>

            <button
              onClick={resetForm}
              className="rounded-lg border border-white/10 p-2 text-gray-500 transition hover:border-white/20 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="relative space-y-6 p-6">
            {/* NAME */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Genre Name
              </label>

              <input
                type="text"
                value={form.genre_name}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    genre_name: e.target.value,
                  }))
                }
                placeholder="e.g. Indian Classical"
                className="w-full rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Describe the genre..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#090a0d] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-gray-700 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/10"
              />
            </div>

            {/* IMAGE + AUDIO */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Cover Artwork
                </label>

                <label className="group flex min-h-[150px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/10 bg-black/20 transition hover:border-amber-400/30 hover:bg-amber-400/[0.02]">
                  {form.image_url ? (
                    <img
                      src={form.image_url}
                      alt="Genre preview"
                      className="h-full max-h-48 w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                        <ImageIcon size={19} />
                      </div>

                      <span className="text-xs font-medium text-gray-300">
                        {uploadingImage
                          ? "Uploading..."
                          : "Upload cover image"}
                      </span>

                      <span className="mt-1 text-[10px] text-gray-600">
                        JPG, PNG or WebP
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {form.image_url && (
                  <p className="mt-2 truncate text-[10px] text-gray-600">
                    Image uploaded successfully
                  </p>
                )}
              </div>

              {/* AUDIO */}
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Audio Sample
                </label>

                <label className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-black/20 px-5 transition hover:border-amber-400/30 hover:bg-amber-400/[0.02]">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                    <Headphones size={19} />
                  </div>

                  <span className="text-xs font-medium text-gray-300">
                    {uploadingAudio
                      ? "Uploading audio..."
                      : form.audio_url
                      ? "Replace audio sample"
                      : "Upload audio sample"}
                  </span>

                  <span className="mt-1 text-[10px] text-gray-600">
                    MP3, WAV, OGG or M4A
                  </span>

                  <input
                    type="file"
                    accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/x-m4a"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                </label>

                {form.audio_url && (
                  <audio
                    controls
                    src={form.audio_url}
                    className="mt-3 w-full"
                  />
                )}
              </div>
            </div>

            {/* DISPLAY ORDER */}
            <div className="max-w-xs">
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

              <p className="mt-2 text-[10px] text-gray-600">
                Lower numbers appear first.
              </p>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              disabled={saving || uploadingImage || uploadingAudio}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/10 transition hover:from-amber-300 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
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
                : "Add Genre"}
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {loading ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.015] py-16 text-sm text-gray-500">
          <Loader2
            size={17}
            className="mr-2 animate-spin text-amber-400"
          />
          Loading genres...
        </div>
      ) : genres.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
            <Music size={20} />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            No genres yet
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Add your first music genre to the showcase.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {genres.map((genre) => (
            <div
              key={genre.id}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#090a0d] transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:shadow-xl hover:shadow-black/30"
            >
              {/* IMAGE */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-amber-500/10 to-black">
                {genre.image_url ? (
                  <img
                    src={genre.image_url}
                    alt={genre.genre_name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Music
                      size={38}
                      className="text-amber-400/20"
                    />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0d] via-transparent to-transparent" />

                {/* ORDER */}
                <div className="absolute right-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full border border-white/10 bg-black/50 px-2 text-[10px] font-bold text-amber-400 backdrop-blur">
                  #{genre.display_order}
                </div>
              </div>

              {/* BODY */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">
                      {genre.genre_name}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-600">
                      <Headphones size={10} />

                      {genre.audio_url
                        ? "Audio available"
                        : "No audio"}
                    </div>
                  </div>

                  <Sparkles
                    size={14}
                    className="shrink-0 text-amber-400/30 transition group-hover:text-amber-400"
                  />
                </div>

                {genre.description && (
                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-gray-500">
                    {genre.description}
                  </p>
                )}

                {genre.audio_url && (
                  <audio
                    controls
                    src={genre.audio_url}
                    className="mt-4 w-full"
                  />
                )}

                {/* ACTIONS */}
                <div className="mt-5 flex gap-2 border-t border-white/5 pt-4">
                  <button
                    onClick={() => handleEdit(genre)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-semibold text-gray-400 transition hover:border-amber-400/30 hover:bg-amber-400/5 hover:text-amber-400"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(genre.id)}
                    disabled={deletingId === genre.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs font-semibold text-gray-400 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400 disabled:opacity-50"
                  >
                    {deletingId === genre.id ? (
                      <Loader2
                        size={12}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={12} />
                    )}

                    {deletingId === genre.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}