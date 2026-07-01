"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "../lib/supabase";
import { Calendar, MapPin, Music4, AlertCircle, ArrowUpRight, Music, Users } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image_url: string;
  capacity: number;
}

export default function UpcomingEvents() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [events, setEvents] = useState<Event[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchHomeEventsData() {
      try {
        // Fetch Events
        const { data: eventsData, error: eventsErr } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        // Fetch Registrations
        const { data: regsData, error: regsErr } = await supabase
          .from("event_registrations")
          .select("event_id");

        if (eventsErr || regsErr) throw new Error("Data Sync Failed");

        // Map registration counts per event
        const counts: Record<string, number> = {};
        regsData?.forEach((reg) => {
          counts[reg.event_id] = (counts[reg.event_id] || 0) + 1;
        });

        setEvents(eventsData || []);
        setRegistrationCounts(counts);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        loading && setLoading(false);
      }
    }

    fetchHomeEventsData();
  }, []);

  if (error) {
    return (
      <section className="px-6 py-24 bg-[#050508] text-white">
        <div className="mx-auto max-w-md text-center border border-red-500/20 bg-red-950/20 rounded-2xl p-8 backdrop-blur-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-100 mb-2">Upcoming Events</h2>
          <p className="text-gray-400 text-sm">Failed to sync upcoming events. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#050508] py-24 text-center text-amber-500 font-medium tracking-wide animate-pulse">
        Syncing global showcases...
      </div>
    );
  }

  return (
    /* 🎯 Added id="events-section" right here so your Hero script can scroll to it */
    <section id="events-section" className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-900/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
            Upcoming Events
          </h2>
          <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-amber-500 text-sm">🎵</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <p className="mt-6 max-w-2xl text-gray-400 text-base md:text-lg">
            Join our upcoming gatherings and experience music, culture, and community.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-2xl bg-[#0b0c10]/20 max-w-lg mx-auto">
            <Music4 className="w-10 h-10 text-gray-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-400">No events scheduled at the moment. Stay tuned!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const attendeeCount = registrationCounts[event.id] || 0;
              const slotsLeft = Math.max(0, event.capacity - attendeeCount);
              const isAvailable = slotsLeft > 0;

              const destinationUrl = isLoggedIn 
                ? `/events/${event.id}` 
                : `/signup?redirectTo=/events/${event.id}`;

              return (
                <div
                  key={event.id}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-800/60 bg-[#0b0c10]/60 overflow-hidden backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]"
                >
                  <div>
                    <div className="relative w-full h-48 bg-gradient-to-b from-gray-900 to-[#0b0c10] overflow-hidden border-b border-gray-800/60">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-gradient-to-br from-purple-950/20 via-gray-950 to-amber-950/20">
                          <Music className="w-8 h-8 text-amber-500/20 mb-2" />
                          <span className="text-[10px] tracking-widest uppercase text-gray-600">The Benaras Beats</span>
                        </div>
                      )}

                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <div className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-400 shadow-lg">
                          <Music4 className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded-full backdrop-blur-md border shadow-lg ${
                          isAvailable 
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' 
                            : 'bg-red-500/20 border-red-500/30 text-red-300'
                        }`}>
                          {isAvailable ? 'Tickets Open' : 'Sold Out'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="mb-3 text-xl font-semibold tracking-wide text-gray-100 group-hover:text-amber-400 transition-colors duration-200">
                        {event.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="space-y-3 pb-5 text-xs tracking-wide text-gray-400">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-amber-500/70 group-hover:text-amber-500 transition-colors" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-amber-500/70 group-hover:text-amber-500 transition-colors" />
                        <span>
                          {eventDate.toLocaleDateString("en-IN", {
                            weekday: "short",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-amber-500/70 group-hover:text-amber-500 transition-colors" />
                        <span className={!isAvailable ? "text-red-400 font-bold" : ""}>
                          {isAvailable ? `${slotsLeft} / ${event.capacity} seats left` : "Event Full"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-900/60">
                      {isAvailable ? (
                        <Link
                          href={destinationUrl} 
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-amber-950/20 group/btn"
                        >
                          <span>View Details & Register</span>
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 bg-gray-900 border border-gray-800 text-gray-600 font-bold text-sm rounded-xl cursor-not-allowed text-center"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}