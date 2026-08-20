"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  ImageIcon,
  Users,
  IndianRupee,
  Upload,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  Plus,
} from "lucide-react";

export default function NewEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    venue: "",
    image_url: "",
    capacity: 100,
    ticket_price: 0,
  });

  const handleChange = (
    field: string,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

      handleChange("image_url", data.url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
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
    <div className="relative min-h-full overflow-hidden bg-[#090807] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.04] blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500 transition hover:text-[#C9A24B]"
        >
          <ArrowLeft size={14} />
          Back to Events
        </button>

        {/* Header */}
        <div className="mb-8 border-b border-white/[0.07] pb-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A24B]" />

            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
              Event Management
            </span>
          </div>

          <h1 className="font-serif text-4xl tracking-wide text-[#EDE6D9] sm:text-5xl">
            Create Event
          </h1>

          <p className="mt-2 text-sm text-stone-500">
            Add a new experience to The Benaras Beats calendar.
          </p>
        </div>

        {/* Main form */}
        <div className="border border-white/[0.08] bg-[#11100E]">
          {/* Section heading */}
          <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
            <div className="flex h-8 w-8 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.06]">
              <Sparkles size={14} className="text-[#C9A24B]" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                New Experience
              </p>
              <p className="mt-0.5 text-[10px] text-stone-600">
                Event information
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            {/* Title */}
            <div>
              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                Event Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  handleChange("title", e.target.value)
                }
                placeholder="e.g. Benaras Beats Live"
                className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-[#C9A24B]/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                rows={5}
                placeholder="Tell people what makes this experience special..."
                className="w-full resize-none border border-white/[0.08] bg-[#090807] px-4 py-3 text-sm leading-6 text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-[#C9A24B]/50"
              />
            </div>

            {/* Date + Venue */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  Date & Time
                </label>

                <div className="relative">
                  <CalendarDays
                    size={15}
                    className="pointer-events-none absolute left-4 top-3.5 text-stone-600"
                  />

                  <input
                    type="datetime-local"
                    value={form.event_date}
                    onChange={(e) =>
                      handleChange(
                        "event_date",
                        e.target.value
                      )
                    }
                    className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 pl-11 text-sm text-stone-200 outline-none [color-scheme:dark] focus:border-[#C9A24B]/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  Venue
                </label>

                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-4 top-3.5 text-stone-600"
                  />

                  <input
                    type="text"
                    value={form.venue}
                    onChange={(e) =>
                      handleChange("venue", e.target.value)
                    }
                    placeholder="e.g. Assi Ghat, Varanasi"
                    className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 pl-11 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-[#C9A24B]/50"
                  />
                </div>
              </div>
            </div>

            {/* Capacity + Price */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  Total Capacity
                </label>

                <div className="relative">
                  <Users
                    size={15}
                    className="pointer-events-none absolute left-4 top-3.5 text-stone-600"
                  />

                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) =>
                      handleChange(
                        "capacity",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 pl-11 text-sm text-stone-200 outline-none transition focus:border-[#C9A24B]/50"
                  />
                </div>

                <p className="mt-2 text-[10px] text-stone-700">
                  Maximum number of attendees.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                  Ticket Price
                </label>

                <div className="relative">
                  <IndianRupee
                    size={15}
                    className="pointer-events-none absolute left-4 top-3.5 text-stone-600"
                  />

                  <input
                    type="number"
                    min="0"
                    value={form.ticket_price}
                    onChange={(e) =>
                      handleChange(
                        "ticket_price",
                        Number(e.target.value)
                      )
                    }
                    className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 pl-11 text-sm text-stone-200 outline-none transition focus:border-[#C9A24B]/50"
                  />
                </div>

                <p className="mt-2 text-[10px] text-stone-700">
                  Enter 0 for a free event.
                </p>
              </div>
            </div>

            {/* Artwork */}
            <div className="border-t border-white/[0.06] pt-6">
              <div className="mb-4 flex items-center gap-2">
                <ImageIcon
                  size={15}
                  className="text-[#C9A24B]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Event Artwork
                </span>
              </div>

              {/* Mode selector */}
              <div className="mb-4 flex w-fit border border-white/[0.08] bg-[#090807] p-1">
                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                    imageMode === "url"
                      ? "bg-[#C9A24B] text-[#090807]"
                      : "text-stone-500 hover:text-stone-200"
                  }`}
                >
                  <LinkIcon size={12} />
                  Paste URL
                </button>

                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-2 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.15em] transition ${
                    imageMode === "upload"
                      ? "bg-[#C9A24B] text-[#090807]"
                      : "text-stone-500 hover:text-stone-200"
                  }`}
                >
                  <Upload size={12} />
                  Upload
                </button>
              </div>

              {imageMode === "url" ? (
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) =>
                    handleChange("image_url", e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full border border-white/[0.08] bg-[#090807] px-4 py-3 text-sm text-stone-200 outline-none transition placeholder:text-stone-700 focus:border-[#C9A24B]/50"
                />
              ) : (
                <label className="flex cursor-pointer items-center justify-center border border-dashed border-white/[0.12] bg-[#090807] px-5 py-9 text-center transition hover:border-[#C9A24B]/40">
                  <div>
                    {uploading ? (
                      <Loader2
                        size={22}
                        className="mx-auto animate-spin text-[#C9A24B]"
                      />
                    ) : (
                      <Upload
                        size={22}
                        className="mx-auto text-stone-600"
                      />
                    )}

                    <p className="mt-3 text-xs font-medium text-stone-400">
                      {uploading
                        ? "Uploading image..."
                        : "Choose event artwork"}
                    </p>

                    <p className="mt-1 text-[10px] text-stone-700">
                      JPG, PNG or WEBP
                    </p>

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </div>
                </label>
              )}

              {/* Preview */}
              {form.image_url && (
                <div className="mt-4 overflow-hidden border border-white/[0.08] bg-[#090807]">
                  <div className="relative h-48 sm:h-64">
                    <img
                      src={form.image_url}
                      alt="Event preview"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute bottom-3 left-3 border border-white/10 bg-black/60 px-2 py-1 text-[8px] uppercase tracking-[0.15em] text-stone-300 backdrop-blur">
                      Artwork Preview
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/admin/events")}
                className="border border-white/[0.08] px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 transition hover:border-white/20 hover:text-stone-200"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || uploading}
                className="flex items-center justify-center gap-2 bg-[#C9A24B] px-7 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#090807] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-700">
            The Benaras Beats
          </span>

          <span className="text-[10px] text-stone-700">
            Event Creator
          </span>
        </div>
      </div>
    </div>
  );
}