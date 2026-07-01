"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, CheckCircle, Users, ArrowLeft, Loader2 } from "lucide-react";

interface FormattedEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_url: string;
  capacity: number;
  slotsLeft: number;
  isSoldOut: boolean;
  isUserRegistered: boolean;
}

export default function EventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const url = user ? `/api/events/list?userId=${user.id}` : "/api/events/list";
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleRegister = async (eventId: string) => {
    if (!user) {
      router.push(`/login?redirect=/events`);
      return;
    }

    setRegisteringId(eventId);
    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      alert("🎉 " + data.message);
      fetchEvents();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRegisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-amber-500 font-medium tracking-wide">
          <Loader2 className="h-8 w-8 animate-spin" />
          Loading amazing experiences...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] py-6 px-4 selection:bg-amber-500 selection:text-black">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Upcoming <span className="text-amber-500">Events</span>
          </h1>
          <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
            Exclusive entry gates open exclusively for registered Benaras Beats crew members.
          </p>
        </header>

        {events.length === 0 ? (
          <div className="text-center text-gray-500 border border-white/5 bg-white/[0.01] rounded-2xl p-12 max-w-md mx-auto mt-12">
            No dynamic event instances discovered in this tracking block. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const btnDisabled = event.isUserRegistered || event.isSoldOut;
              const isRegistering = registeringId === event.id;

              return (
                <div
                  key={event.id}
                  className="bg-[#1f232d]/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300"
                >
                  <div>
                    {event.image_url ? (
                      <div className="relative w-full h-48 bg-gray-900">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1f232d] via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-amber-500/10 to-gray-800 flex items-center justify-center text-amber-500/40 text-sm font-semibold border-b border-white/5">
                        Benaras Beats Experience
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight line-clamp-1">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {event.description || "No specific details provided for this session entry."}
                      </p>

                      <div className="space-y-3 text-sm font-medium border-t border-white/5 pt-4">
                        <div className="flex items-center gap-3 text-gray-200">
                          <Calendar size={16} className="text-amber-500 shrink-0" />
                          <span>{new Date(event.event_date).toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-200">
                          <MapPin size={16} className="text-amber-500 shrink-0" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users size={16} className="text-amber-500 shrink-0" />
                          <span className={event.isSoldOut ? "text-red-400 font-bold" : "text-gray-200"}>
                            {event.isSoldOut ? "🔴 Sold Out / Event Full" : `🟢 ${event.slotsLeft} / ${event.capacity} slots remaining`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-4">
                    <button
                      disabled={btnDisabled}
                      onClick={() => handleRegister(event.id)}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
                        event.isUserRegistered
                          ? "bg-green-500/10 text-green-400 border border-green-500/30 cursor-not-allowed"
                          : event.isSoldOut
                          ? "bg-gray-900 text-gray-600 border border-white/5 cursor-not-allowed"
                          : "bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-amber-500/10"
                      }`}
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Registering...
                        </>
                      ) : event.isUserRegistered ? (
                        <>
                          <CheckCircle size={18} className="text-green-400" /> Registered ✓
                        </>
                      ) : event.isSoldOut ? (
                        "Fully Booked"
                      ) : (
                        "Secure Your Ticket Spot"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}