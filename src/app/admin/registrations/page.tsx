// app/admin/registrations/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Crown } from "lucide-react";

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
        const res = await fetch(`/api/admin/registrations?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) setRegistrations(data.registrations ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [user]);

  const filtered = registrations.filter(
    (r) =>
      r.holder_name.toLowerCase().includes(search.toLowerCase()) ||
      r.holder_email.toLowerCase().includes(search.toLowerCase()) ||
      r.event_title.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
      : "—";

  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

  return (
    <div>
      <h1 className="text-3xl font-bold">Registrations</h1>
      <p className="mt-2 text-gray-400">All tickets claimed or purchased, across every event.</p>

      <input
        type="text"
        placeholder="Search by name, email, or event..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6 w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
      />

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading registrations...
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-gray-500">No registrations found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-gray-400">
              <tr>
                <th className="p-3 font-medium">Attendee</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Event</th>
                <th className="p-3 font-medium">Event Date</th>
                <th className="p-3 font-medium">Venue</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium">Paid</th>
                <th className="p-3 font-medium">Purchased At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="p-3 font-medium">{r.holder_name}</td>
                  <td className="p-3 text-gray-400">{r.holder_email}</td>
                  <td className="p-3 text-gray-300">{r.event_title}</td>
                  <td className="p-3 text-gray-400">{formatDate(r.event_date)}</td>
                  <td className="p-3 text-gray-400">{r.venue}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                        r.is_member ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {r.is_member && <Crown size={10} />}
                      {r.is_member ? "Member" : "Paid"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {r.amount_paid > 0 ? `₹${r.amount_paid}` : "Free"}
                  </td>
                  <td className="p-3 text-gray-500">{formatDateTime(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}