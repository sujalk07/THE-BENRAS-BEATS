// app/admin/memberships/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2 } from "lucide-react";

interface Membership {
  id: string;
  holder_name: string;
  holder_email: string;
  plan_name: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  amount: number;
  created_at: string;
}

export default function AdminMembershipsPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMemberships() {
      if (!user) return;
      try {
        const res = await fetch(`/api/admin/memberships?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) setMemberships(data.memberships ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMemberships();
  }, [user]);

  const filtered = memberships.filter(
    (m) =>
      m.holder_name.toLowerCase().includes(search.toLowerCase()) ||
      m.holder_email.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

  const formatDateTime = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
      : "—";

  const isExpired = (dateStr: string | null) =>
    dateStr ? new Date(dateStr) < new Date() : false;

  return (
    <div>
      <h1 className="text-3xl font-bold">Memberships</h1>
      <p className="mt-2 text-gray-400">All member accounts and their plan status.</p>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-6 w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
      />

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading memberships...
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-gray-500">No memberships found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-gray-400">
              <tr>
                <th className="p-3 font-medium">Member</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Plan</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Start</th>
                <th className="p-3 font-medium">Expiry</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Purchased At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const expired = isExpired(m.expires_at);
                return (
                  <tr key={m.id} className="border-t border-white/5">
                    <td className="p-3 font-medium">{m.holder_name}</td>
                    <td className="p-3 text-gray-400">{m.holder_email}</td>
                    <td className="p-3 text-gray-300 capitalize">{m.plan_name}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                          m.status === "active" && !expired
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {m.status === "active" && !expired ? "Active" : expired ? "Expired" : m.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-400">{formatDate(m.starts_at)}</td>
                    <td className="p-3 text-gray-400">{formatDate(m.expires_at)}</td>
                    <td className="p-3 text-gray-400">₹{m.amount}</td>
                    <td className="p-3 text-gray-500">{formatDateTime(m.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}