"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    venue: "",
    image_url: "",
    capacity: 0,
    ticket_price: 0,
  });

  useEffect(() => {
    async function fetchEvent() {
      if (!user) return;
      try {
        const res = await fetch(`/api/admin/events?userId=${user.id}`);
        const data = await res.json();
        const event = data.events?.find((e: any) => e.id === id);
        if (event) {
          setForm({
            title: event.title ?? "",
            description: event.description ?? "",
            event_date: event.event_date ? event.event_date.slice(0, 16) : "",
            venue: event.venue ?? "",
            image_url: event.image_url ?? "",
            capacity: event.capacity ?? 0,
            ticket_price: event.ticket_price ?? 0,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [user, id]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

      handleChange("image_url", data.url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update event");
        return;
      }
      router.push("/admin/events");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 size={16} className="animate-spin" /> Loading event...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push("/admin/events")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition"
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Date & Time</label>
            <input
              type="datetime-local"
              value={form.event_date}
              onChange={(e) => handleChange("event_date", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Venue</label>
            <input
              type="text"
              value={form.venue}
              onChange={(e) => handleChange("venue", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">
            Event Image
          </label>

          <div className="mb-2 flex gap-2">
            <button
              type="button"
              onClick={() => setImageMode("url")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                imageMode === "url"
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => setImageMode("upload")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                imageMode === "upload"
                  ? "bg-amber-500 text-black"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Upload Image
            </button>
          </div>

          {imageMode === "url" ? (
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          ) : (
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-black hover:file:bg-amber-400"
              />
              {uploading && <p className="mt-2 text-xs text-amber-400">Uploading...</p>}
            </div>
          )}

          {form.image_url && (
            <img
              src={form.image_url}
              alt="Preview"
              className="mt-3 h-32 w-full rounded-lg object-cover border border-white/10"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => handleChange("capacity", Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Ticket Price (₹)</label>
            <input
              type="number"
              value={form.ticket_price}
              onChange={(e) => handleChange("ticket_price", Number(e.target.value))}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}