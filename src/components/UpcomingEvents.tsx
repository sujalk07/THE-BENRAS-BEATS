"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "../lib/supabase";
import { Calendar, MapPin, Music4, AlertCircle, ArrowUpRight, Users } from "lucide-react";
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

const PAGE_BG = "#0A0908";

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
        const { data: eventsData, error: eventsErr } = await supabase
          .from("events")
          .select("*")
          .order("event_date", { ascending: true });

        const { data: regsData, error: regsErr } = await supabase
          .from("event_registrations")
          .select("event_id");

        if (eventsErr || regsErr) throw new Error("Data Sync Failed");

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

  // --- Error state ---
  if (error) {
    return (
      <section className="px-6 py-24 bg-[#0A0908] text-white">
        <div className="mx-auto max-w-md text-center border border-[#7A2331]/40 bg-[#7A2331]/10 rounded-2xl p-8">
          <AlertCircle className="w-10 h-10 text-[#C4707F] mx-auto mb-4" />
          <h2 className="text-2xl font-serif text-gray-100 mb-2">Upcoming Events</h2>
          <p className="text-gray-400 text-sm">
            Couldn't load events right now. Refresh the page to try again.
          </p>
        </div>
      </section>
    );
  }

  // --- Loading state: ticket-shaped skeletons, not a spinner sentence ---
  if (loading) {
    return (
      <section className="px-6 py-24 bg-[#0A0908]">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-64 mx-auto rounded bg-white/5 animate-pulse mb-16" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-[#111014] overflow-hidden animate-pulse">
                <div className="h-48 bg-white/[0.04]" />
                <div className="h-px border-t border-dashed border-white/10 mx-6 my-4" />
                <div className="px-6 pb-6 space-y-3">
                  <div className="h-3 w-3/4 bg-white/[0.06] rounded" />
                  <div className="h-3 w-1/2 bg-white/[0.06] rounded" />
                  <div className="h-10 w-full bg-white/[0.04] rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events-section"
      className="relative px-6 py-24 bg-[#0A0908] text-white overflow-hidden border-t border-white/[0.06]"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-[#EDE6D9]">
            Upcoming Events
          </h2>
          <div className="flex items-center justify-center gap-4 mt-5 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#B8923F]/50" />
            <div className="flex items-end gap-[3px] h-3.5" aria-hidden="true">
              {[5, 10, 7, 13, 8].map((h, i) => (
                <span key={i} className="w-[2px] rounded-full bg-[#B8923F]" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#B8923F]/50" />
          </div>
          <p className="mt-6 max-w-2xl text-gray-400 text-base md:text-lg">
            Join our upcoming gatherings and experience music, culture, and community.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/[0.02] max-w-lg mx-auto">
            <Music4 className="w-10 h-10 text-[#B8923F]/40 mx-auto mb-4" />
            <p className="text-gray-400">Nothing on the calendar yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const eventDate = new Date(event.event_date);
              const attendeeCount = registrationCounts[event.id] || 0;
              const slotsLeft = Math.max(0, event.capacity - attendeeCount);
              const isAvailable = slotsLeft > 0;
              const ticketId = `TBB-${event.id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

              const destinationUrl = isLoggedIn
                ? `/events/${event.id}`
                : `/signup?redirectTo=/events/${event.id}`;

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111014] transition-colors duration-300 hover:border-[#B8923F]/30"
                >
                  {/* Poster half */}
                  <div>
                    <div className="relative w-full h-48 rounded-t-2xl overflow-hidden border-b border-white/[0.06]">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0D0C0F]">
                          <Music4 className="w-8 h-8 text-[#B8923F]/25 mb-2" />
                          <span className="text-[10px] tracking-widest uppercase text-gray-700">
                            The Benaras Beats
                          </span>
                        </div>
                      )}

                      {/* Ticket ID, top-left, printed-corner style */}
                      <span className="absolute top-3 left-3 font-mono text-[10px] tracking-wider text-white/70 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                        {ticketId}
                      </span>

                      {/* Availability stamp, top-right, rotated like a rubber stamp */}
                      <span
                        className={`absolute top-3 right-3 -rotate-6 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm border-2 bg-black/40 backdrop-blur-sm ${
                          isAvailable
                            ? "border-emerald-400/60 text-emerald-300"
                            : "border-[#C4707F]/60 text-[#C4707F]"
                        }`}
                      >
                        {isAvailable ? "Open" : "Sold Out"}
                      </span>
                    </div>

                    <div className="px-6 pt-5">
                      <h3 className="mb-2 text-xl font-semibold tracking-wide text-gray-100 group-hover:text-[#C9A24B] transition-colors duration-200">
                        {event.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-400 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Perforated tear line with punch-hole notches */}
                  <div className="relative mx-6 mt-5">
                    <div className="border-t border-dashed border-white/15" />
                    <span
                      className="absolute top-1/2 -left-9 w-6 h-6 rounded-full -translate-y-1/2"
                      style={{ backgroundColor: PAGE_BG }}
                    />
                    <span
                      className="absolute top-1/2 -right-9 w-6 h-6 rounded-full -translate-y-1/2"
                      style={{ backgroundColor: PAGE_BG }}
                    />
                  </div>

                  {/* Stub half */}
                  <div className="px-6 pb-6 pt-4">
                    <div className="space-y-2.5 pb-5 text-xs tracking-wide text-gray-400">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-3.5 h-3.5 text-[#B8923F]/70 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-3.5 h-3.5 text-[#B8923F]/70 shrink-0" />
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
                        <Users className="w-3.5 h-3.5 text-[#B8923F]/70 shrink-0" />
                        <span className={!isAvailable ? "text-[#C4707F] font-semibold" : ""}>
                          {isAvailable ? `${slotsLeft} / ${event.capacity} seats left` : "Event full"}
                        </span>
                      </div>
                    </div>

                    {isAvailable ? (
                      <Link
                        href={destinationUrl}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#C9A24B] hover:bg-[#D9B662] text-[#0A0908] font-semibold text-sm rounded-lg transition-colors duration-200 group/btn"
                      >
                        <span>View details &amp; register</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 px-4 bg-white/[0.03] border border-white/10 text-gray-600 font-semibold text-sm rounded-lg cursor-not-allowed text-center"
                      >
                        Sold out
                      </button>
                    )}
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