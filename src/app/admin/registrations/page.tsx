// app/admin/registrations/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Crown, Search, X } from "lucide-react";

interface Registration {
  id: string;
  holder_name: string;
  holder_email: string;
  event_title: string;
  event_date: string | null;
  venue: string;
  is_member: boolean;
  amount_paid: number;
  created_at: string;
}

export default function AdminRegistrationsPage() {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchRegistrations() {
      if (!user) return;

      try {
        const res = await fetch(
          `/api/admin/registrations?userId=${user.id}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (res.ok) {
          setRegistrations(data.registrations ?? []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, [user]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return registrations;

    return registrations.filter(
      (r) =>
        r.holder_name.toLowerCase().includes(query) ||
        r.holder_email.toLowerCase().includes(query) ||
        r.event_title.toLowerCase().includes(query) ||
        r.venue.toLowerCase().includes(query)
    );
  }, [registrations, search]);

  const formatDateTime = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })
      : "—";

  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="rounded-[28px] border border-white/10 bg-[#11141b] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Crown size={19} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Registrations
                  </h1>

                  <p className="mt-1 text-sm text-gray-400">
                    {registrations.length} total ticket
                    {registrations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search attendee, email, event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/10 bg-[#0d1016] pl-11 pr-10 text-sm text-white placeholder-gray-500 outline-none transition focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="mt-8 flex items-center gap-2 text-gray-400">
            <Loader2 size={17} className="animate-spin" />
            Loading registrations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#11141b] py-14 text-center">
            <Crown size={28} className="mx-auto text-gray-600" />

            <p className="mt-3 text-sm text-gray-400">
              {registrations.length === 0
                ? "No registrations found."
                : "No registrations match your search."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-[#11141b]">

            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/[0.025] text-left text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">
                      Attendee
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Event
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Date
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Venue
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Type
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Paid
                    </th>
                    <th className="px-5 py-4 font-semibold">
                      Purchased
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">
                          {r.holder_name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {r.holder_email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[180px] font-medium text-gray-200">
                          {r.event_title}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        {formatDate(r.event_date)}
                      </td>

                      <td className="px-5 py-4 text-gray-400">
                        <span className="block max-w-[180px] truncate">
                          {r.venue}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            r.is_member
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-emerald-500/10 text-emerald-400"
                          }`}
                        >
                          {r.is_member && <Crown size={10} />}
                          {r.is_member ? "Member" : "Paid"}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-300">
                        {r.amount_paid > 0
                          ? `₹${r.amount_paid}`
                          : "Free"}
                      </td>

                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDateTime(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="divide-y divide-white/5 lg:hidden">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className="p-5 transition hover:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-white">
                        {r.holder_name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-gray-500">
                        {r.holder_email}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                        r.is_member
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {r.is_member && <Crown size={10} />}
                      {r.is_member ? "Member" : "Paid"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-600">Event</p>
                      <p className="mt-1 font-medium text-gray-300">
                        {r.event_title}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="mt-1 text-gray-400">
                        {formatDate(r.event_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Venue</p>
                      <p className="mt-1 truncate text-gray-400">
                        {r.venue}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600">Paid</p>
                      <p className="mt-1 font-semibold text-gray-300">
                        {r.amount_paid > 0
                          ? `₹${r.amount_paid}`
                          : "Free"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 border-t border-white/5 pt-3 text-[11px] text-gray-600">
                    Purchased {formatDateTime(r.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search result count */}
        {!loading && registrations.length > 0 && search && (
          <p className="mt-3 text-right text-xs text-gray-600">
            Showing {filtered.length} of {registrations.length} registrations
          </p>
        )}
      </div>
    </div>
  );
}