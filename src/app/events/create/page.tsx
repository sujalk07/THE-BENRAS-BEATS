"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Image as ImageIcon, Sparkles, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
  title: "",
  description: "",
  event_date: "",
  venue: "",
  image_url: "",
  capacity: "100",
  ticket_price: "0",
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/events/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      alert("🎉 " + data.message);
      router.push("/events");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🌌 Solid midnight black wrapper matching your global ecosystem style
    <div className="min-h-screen bg-[#0B0C10] py-12 px-4 selection:bg-amber-500 selection:text-black">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation back linking step */}
        <Link 
          href="/events" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors mb-6 text-sm font-medium"
        >
          <ChevronLeft size={16} /> Return to events index
        </Link>

        {/* Form Container Card Layout */}
        <div className="bg-[#1f232d]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <Sparkles className="text-amber-500 shrink-0" size={26} />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Publish <span className="text-amber-500">New Event</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Event Title */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Benaras Beats Underground Live Concert"
                className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Description / Details
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Outline premium perks, schedule variations, or entry rules..."
                className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Date-Time & Capacity Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ticket Price */}
<div>
  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
    Ticket Price (₹)
  </label>

  <div className="relative">
    <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">
      ₹
    </span>

    <input
      type="number"
      name="ticket_price"
      required
      min="0"
      value={formData.ticket_price}
      onChange={handleChange}
      placeholder="0"
      className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
    />
  </div>

  <p className="mt-2 text-xs text-gray-500">
    Enter 0 if this event is free for non-members.
  </p>
</div>
              
              {/* Event Date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Date & Time Configuration
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    name="event_date"
                    required
                    value={formData.event_date}
                    onChange={handleChange}
                    className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium color-scheme-dark [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Total Capacity (Available Seats)
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-3.5 text-gray-500" size={16} />
                  <input
                    type="number"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                  />
                </div>
              </div>

            </div>

            {/* Venue Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Venue Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Assi Ghat Main Amphitheater, Varanasi"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Image URL Banner */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Cover Banner Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/your-premium-asset-id"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Publish Actions Trigger */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-xl shadow-amber-500/10 hover:scale-[1.005] active:scale-[0.995]"
              >
                {loading ? "Publishing to Core System..." : "Publish Premium Event Instance"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}