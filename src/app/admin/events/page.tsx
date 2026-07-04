// app/admin/events/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Plus, Pencil, Trash2, Loader2, Lock, Unlock } from "lucide-react";

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
      if (res.ok) setEvents(data.events ?? []);
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
      const res = await fetch(`/api/admin/events/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
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
        headers: { "Content-Type": "application/json" },
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
        prev.map((e) => (e.id === event.id ? { ...e, registration_open: newValue } : e))
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          <Plus size={16} /> New Event
        </Link>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading events...
        </div>
      ) : events.length === 0 ? (
        <p className="mt-8 text-gray-500">No events yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-gray-400">
              <tr>
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Venue</th>
                <th className="p-3 font-medium">Capacity</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Bookings</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-t border-white/5">
                  <td className="p-3 font-medium">{event.title}</td>
                  <td className="p-3 text-gray-400">
                    {new Date(event.event_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </td>
                  <td className="p-3 text-gray-400">{event.venue}</td>
                  <td className="p-3 text-gray-400">{event.capacity}</td>
                  <td className="p-3 text-gray-400">₹{event.ticket_price}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleRegistration(event)}
                      disabled={togglingId === event.id}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition disabled:opacity-50 ${
                        event.registration_open
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      }`}
                    >
                      {togglingId === event.id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : event.registration_open ? (
                        <Unlock size={11} />
                      ) : (
                        <Lock size={11} />
                      )}
                      {event.registration_open ? "Open" : "Closed"}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/events/${event.id}/edit`}
                        className="rounded-lg border border-white/10 p-2 text-gray-300 hover:border-amber-500/40 hover:text-amber-400 transition"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                        className="rounded-lg border border-white/10 p-2 text-gray-300 hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50"
                      >
                        {deletingId === event.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}