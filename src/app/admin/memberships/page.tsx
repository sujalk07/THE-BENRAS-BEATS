// app/admin/memberships/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Plus, X, Trash2 } from "lucide-react";

interface Membership {
  id: string;
  holder_name: string;
  holder_email: string;
  status: string;
  starts_at: string | null;
  expires_at: string | null;
  amount: number;
  created_at: string;
  created_with: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function AdminMembershipsPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addAmount, setAddAmount] = useState("4999");
  const [addStartDate, setAddStartDate] = useState(todayISO());
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  const fetchMemberships = async () => {
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
  };

  useEffect(() => {
    fetchMemberships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const previewExpiry = (() => {
    const d = new Date(addStartDate || todayISO());
    d.setMonth(d.getMonth() + 6);
    return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
  })();

  const resetAddForm = () => {
    setAddName("");
    setAddEmail("");
    setAddAmount("4999");
    setAddStartDate(todayISO());
    setAddError(null);
  };

  const handleAddMember = async () => {
    if (!user) return;
    setAddError(null);

    if (!addName.trim() || !addEmail.trim()) {
      setAddError("Name and email are required.");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/admin/memberships/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: addName.trim(),
          email: addEmail.trim(),
          amount: Number(addAmount) || 4999,
          startDate: addStartDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add member.");

      setShowAddModal(false);
      resetAddForm();
      await fetchMemberships();
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!user) return;
    if (!confirm(`Delete ${name}'s membership? This cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/memberships/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete membership");
        return;
      }
      setMemberships((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Memberships</h1>
          <p className="mt-2 text-gray-400">All member accounts and their plan status.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

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
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Start</th>
                <th className="p-3 font-medium">Expiry</th>
                <th className="p-3 font-medium">Amount</th>
                <th className="p-3 font-medium">Created With</th>
                <th className="p-3 font-medium">Purchased At</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const expired = isExpired(m.expires_at);
                return (
                  <tr key={m.id} className="border-t border-white/5">
                    <td className="p-3 font-medium">{m.holder_name}</td>
                    <td className="p-3 text-gray-400">{m.holder_email}</td>
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
                    <td className="p-3">
  <span
    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
      m.created_with === "admin"
        ? "bg-blue-500/10 text-blue-400"
        : m.created_with === "qr"
        ? "bg-purple-500/10 text-purple-400"
        : "bg-amber-500/10 text-amber-400"
    }`}
  >
    {m.created_with}
  </span>
</td>
                    <td className="p-3 text-gray-500">{formatDateTime(m.created_at)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(m.id, m.holder_name)}
                        disabled={deletingId === m.id}
                        className="rounded-lg border border-white/10 p-2 text-gray-300 hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50"
                      >
                        {deletingId === m.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1f232d] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Add Member Manually</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                className="text-gray-500 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <label className="block text-sm text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              placeholder="Full name"
              className="w-full mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />

            <label className="block text-sm text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
            />

            <div className="grid grid-cols-2 gap-3 mb-1">
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={addStartDate}
                  onChange={(e) => setAddStartDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <p className="mt-3 mb-2 text-xs text-gray-500">
              Membership will expire on <span className="text-amber-400 font-medium">{previewExpiry}</span> (6 months from start date).
            </p>

            {addError && <p className="mb-3 text-sm text-red-400">{addError}</p>}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetAddForm();
                }}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-semibold text-gray-300 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
              >
                {adding ? <Loader2 size={16} className="animate-spin" /> : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}