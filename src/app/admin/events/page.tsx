"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Lock,
  Unlock,
  CalendarDays,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

interface AdminEvent {
  id: string;
  title: string;
  event_date: string;
  venue: string;
  capacity: number;
  ticket_price: number;
  registration_open: boolean;
}

export default function AdminEventsPage() {
  const { user } = useAuth();

  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/events?userId=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setEvents(data.events ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;

    if (!confirm("Delete this event? This cannot be undone.")) return;

    setDeletingId(id);

    try {
      const res = await fetch(
        `/api/admin/events/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete event");
        return;
      }

      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleRegistration = async (event: AdminEvent) => {
    if (!user) return;

    const newValue = !event.registration_open;

    setTogglingId(event.id);

    try {
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          title: event.title,
          registration_open: newValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update event");
        return;
      }

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? {
                ...e,
                registration_open: newValue,
              }
            : e
        )
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[#090807] text-white">
      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.035] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/[0.07] pb-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A24B]" />

            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
              <CalendarDays size={12} />
              Event Management
            </span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl tracking-wide text-[#EDE6D9] sm:text-5xl">
                Events
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                Create, manage, and control registrations for upcoming
                Benaras Beats events.
              </p>
            </div>

            <Link
              href="/admin/events/new"
              className="inline-flex w-fit items-center gap-2 bg-[#C9A24B] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#090807] transition hover:bg-[#D9B662]"
            >
              <Plus size={15} />
              New Event
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-600">
            <Loader2
              size={18}
              className="mr-2 animate-spin text-[#C9A24B]"
            />
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-white/[0.08] bg-[#11100E] px-6 py-20 text-center">
            <CalendarDays
              size={30}
              className="mx-auto text-stone-700"
            />

            <p className="mt-4 font-serif text-xl text-stone-400">
              No events yet
            </p>

            <p className="mt-2 text-sm text-stone-600">
              Create your first event to get started.
            </p>

            <Link
              href="/admin/events/new"
              className="mt-6 inline-flex items-center gap-2 bg-[#C9A24B] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-[#090807] transition hover:bg-[#D9B662]"
            >
              <Plus size={14} />
              Create Event
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-hidden border border-white/[0.08] bg-[#11100E] lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-white/[0.07] bg-white/[0.015]">
                  <tr className="text-left">
                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Event
                    </th>

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Date
                    </th>

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Venue
                    </th>

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Capacity
                    </th>

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Price
                    </th>

                    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Registration
                    </th>

                    <th className="px-5 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.02]"
                    >
                      {/* Event */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.04]">
                            <CalendarDays
                              size={15}
                              className="text-[#C9A24B]"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-stone-200">
                              {event.title}
                            </p>

                            <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-stone-700">
                              {event.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-5 text-stone-400">
                        {new Date(event.event_date).toLocaleDateString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                          }
                        )}
                      </td>

                      {/* Venue */}
                      <td className="max-w-[220px] px-5 py-5">
                        <div className="flex items-center gap-2 text-stone-400">
                          <MapPin
                            size={13}
                            className="shrink-0 text-stone-600"
                          />

                          <span className="truncate">
                            {event.venue}
                          </span>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-5 font-mono text-xs text-stone-400">
                        {event.capacity}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-5 font-mono text-xs font-semibold text-[#C9A24B]">
                        ₹{event.ticket_price}
                      </td>

                      {/* Registration */}
                      <td className="px-5 py-5">
                        <button
                          onClick={() =>
                            handleToggleRegistration(event)
                          }
                          disabled={togglingId === event.id}
                          className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] transition disabled:opacity-50 ${
                            event.registration_open
                              ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 hover:bg-emerald-500/10"
                              : "border-red-500/20 bg-red-500/[0.06] text-red-400 hover:bg-red-500/10"
                          }`}
                        >
                          {togglingId === event.id ? (
                            <Loader2
                              size={11}
                              className="animate-spin"
                            />
                          ) : event.registration_open ? (
                            <Unlock size={11} />
                          ) : (
                            <Lock size={11} />
                          )}

                          {event.registration_open
                            ? "Open"
                            : "Closed"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/events/${event.id}/edit`}
                            aria-label={`Edit ${event.title}`}
                            className="flex h-8 w-8 items-center justify-center border border-white/[0.08] text-stone-500 transition hover:border-[#C9A24B]/30 hover:text-[#C9A24B]"
                          >
                            <Pencil size={13} />
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(event.id)
                            }
                            disabled={deletingId === event.id}
                            aria-label={`Delete ${event.title}`}
                            className="flex h-8 w-8 items-center justify-center border border-white/[0.08] text-stone-500 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                          >
                            {deletingId === event.id ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={13} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group border border-white/[0.08] bg-[#11100E] p-5 transition-colors hover:border-[#C9A24B]/25"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.04]">
                        <CalendarDays
                          size={16}
                          className="text-[#C9A24B]"
                        />
                      </div>

                      <div>
                        <h2 className="font-serif text-xl text-[#EDE6D9]">
                          {event.title}
                        </h2>

                        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.15em] text-stone-700">
                          EVENT / {event.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="text-stone-700"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-5">
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-stone-700">
                        Date
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        {new Date(
                          event.event_date
                        ).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-stone-700">
                        Capacity
                      </p>

                      <p className="mt-1 text-xs text-stone-400">
                        {event.capacity} seats
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-stone-700">
                        Price
                      </p>

                      <p className="mt-1 font-mono text-xs font-semibold text-[#C9A24B]">
                        ₹{event.ticket_price}
                      </p>
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-[0.18em] text-stone-700">
                        Venue
                      </p>

                      <p className="mt-1 truncate text-xs text-stone-400">
                        {event.venue}
                      </p>
                    </div>
                  </div>

                  {/* Registration */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="text-[9px] uppercase tracking-[0.18em] text-stone-600">
                      Registration
                    </span>

                    <button
                      onClick={() =>
                        handleToggleRegistration(event)
                      }
                      disabled={togglingId === event.id}
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] transition disabled:opacity-50 ${
                        event.registration_open
                          ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400"
                          : "border-red-500/20 bg-red-500/[0.06] text-red-400"
                      }`}
                    >
                      {togglingId === event.id ? (
                        <Loader2
                          size={11}
                          className="animate-spin"
                        />
                      ) : event.registration_open ? (
                        <Unlock size={11} />
                      ) : (
                        <Lock size={11} />
                      )}

                      {event.registration_open
                        ? "Open"
                        : "Closed"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="flex items-center justify-center gap-2 border border-white/[0.08] py-2.5 text-xs font-semibold text-stone-400 transition hover:border-[#C9A24B]/30 hover:text-[#C9A24B]"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(event.id)
                      }
                      disabled={deletingId === event.id}
                      className="flex items-center justify-center gap-2 border border-white/[0.08] py-2.5 text-xs font-semibold text-stone-400 transition hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === event.id ? (
                        <Loader2
                          size={13}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-700">
            Music · Culture · Community
          </span>

          <span className="text-xs text-stone-600">
            Manage event availability and registration status.
          </span>
        </div>
      </div>
    </div>
  );
}