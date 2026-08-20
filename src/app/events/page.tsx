"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useMembership } from "@/hooks/useMembership";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Users,
  ArrowLeft,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

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
  const { isMember } = useMembership();
  const router = useRouter();

  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const url = user
        ? `/api/events/list?userId=${user.id}`
        : "/api/events/list";

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
      router.push("/login?redirect=/events");
      return;
    }

    if (!isMember) {
      router.push(`/events/${eventId}`);
      return;
    }

    setRegisteringId(eventId);

    try {
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          userId: user.id,
        }),
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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-gray-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#C9A24B]" />
        Loading events...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0908] px-5 py-8 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Home
          </button>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700">
            TBB / Experiences
          </span>
        </div>

        {/* Title */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#B8923F]" />

            <span className="text-[9px] uppercase tracking-[0.3em] text-[#B8923F]">
              What&apos;s happening
            </span>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-4xl text-[#EDE6D9] md:text-5xl">
                Upcoming Events
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Discover performances and reserve your place.
              </p>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
              {events.length} {events.length === 1 ? "Event" : "Events"}
            </span>
          </div>
        </header>

        {/* Empty */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.1] py-14 text-center">
            <Calendar className="mx-auto mb-3 h-6 w-6 text-gray-700" />

            <p className="text-sm text-gray-500">
              No upcoming events.
            </p>
          </div>
        ) : (

          /* Events */
          <div className="space-y-4">
            {events.map((event, index) => {
              const btnDisabled =
                event.isSoldOut || event.isUserRegistered;

              const isRegistering =
                registeringId === event.id;

              return (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E] transition-all duration-300 hover:border-[#B8923F]/30"
                >
                  <div className="grid md:grid-cols-[230px_1fr]">

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden md:h-full md:min-h-[235px]">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-[190px] items-center justify-center bg-gradient-to-br from-[#1B170D] to-[#0D0C0A]">
                          <span className="font-serif text-lg italic text-[#B8923F]/30">
                            Benaras Beats
                          </span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#11100E]/60" />

                      {/* Number */}
                      <span className="absolute left-4 top-4 font-mono text-[9px] tracking-[0.2em] text-white/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-between p-5 md:p-6">

                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <h2 className="font-serif text-2xl text-[#EDE6D9] transition-colors group-hover:text-[#C9A24B]">
                            {event.title}
                          </h2>

                          <ArrowUpRight
                            size={17}
                            className="mt-1 shrink-0 text-gray-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8923F]"
                          />
                        </div>

                        <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-gray-500">
                          {event.description}
                        </p>

                        {/* Event details */}
                        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar
                              size={13}
                              className="text-[#B8923F]"
                            />

                            {new Date(
                              event.event_date
                            ).toLocaleDateString("en-IN", {
                              dateStyle: "medium",
                            })}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin
                              size={13}
                              className="text-[#B8923F]"
                            />

                            <span className="max-w-[220px] truncate">
                              {event.venue}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Users
                              size={13}
                              className="text-[#B8923F]"
                            />

                            {event.isSoldOut
                              ? "Sold Out"
                              : `${event.slotsLeft} slots left`}
                          </div>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          {event.isUserRegistered ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.15em] text-emerald-400">
                              <CheckCircle size={12} />
                              Registered
                            </span>
                          ) : event.isSoldOut ? (
                            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-600">
                              Fully Booked
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase tracking-[0.15em] text-gray-700">
                              {event.capacity} total capacity
                            </span>
                          )}
                        </div>

                        <button
                          disabled={btnDisabled}
                          onClick={() => handleRegister(event.id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-semibold transition-all ${
                            event.isUserRegistered
                              ? "border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-400"
                              : event.isSoldOut
                              ? "cursor-not-allowed border border-white/[0.05] bg-white/[0.02] text-gray-700"
                              : "bg-[#C9A24B] text-[#0A0908] hover:bg-[#D9B662]"
                          }`}
                        >
                          {isRegistering ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Registering
                            </>
                          ) : event.isUserRegistered ? (
                            <>
                              <CheckCircle size={14} />
                              Registered
                            </>
                          ) : event.isSoldOut ? (
                            "Fully Booked"
                          ) : isMember ? (
                            "Claim Free Ticket"
                          ) : (
                            "Buy Ticket"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-between border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-[0.15em] text-gray-700">
          <span>Music · Culture · Community</span>
          <span>Varanasi</span>
        </div>
      </div>
    </main>
  );
}