// app/admin/events/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { ArrowLeft } from "lucide-react";

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    venue: "",
    image_url: "",
    capacity: 100,
    ticket_price: 0,
  });

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.title || !form.event_date || !form.venue) {
      alert("Title, date, and venue are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create event");
        return;
      }
      router.push("/admin/events");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={() => router.push("/admin/events")}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-amber-400 transition"
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      <h1 className="text-2xl font-bold mb-6">Create Event</h1>

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
          <label className="mb-1 block text-xs font-semibold uppercase text-gray-400">Image URL</label>
          <input
            type="text"
            value={form.image_url}
            onChange={(e) => handleChange("image_url", e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white focus:border-amber-500 focus:outline-none"
          />
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
          {saving ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );
}