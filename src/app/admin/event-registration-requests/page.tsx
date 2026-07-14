"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, CheckCircle2, XCircle, ImageOff } from "lucide-react";

interface EventRegistrationRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  eventId: string;
  eventTitle: string;
  eventDate: string | null;
  venue: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  screenshotUrl: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export default function AdminEventRegistrationRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EventRegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const fetchRequests = async () => {
    if (!user) return;
    try {
      // cache: "no-store" ensures we never get a stale cached response for this GET
      const res = await fetch(`/api/admin/event-registration-requests?userId=${user.id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) setRequests(data.requests ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleVerify = async (id: string) => {
    if (!user) return;
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/event-registration-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "verify" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Optimistic local update — the card reflects the new status immediately,
      // regardless of any lag/caching on the follow-up refetch.
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "verified" } : r)));

      await fetchRequests();
    } catch (err: any) {
      alert(err.message);
      // Something went wrong server-side — re-sync with the DB so we don't
      // show a false "verified" state.
      await fetchRequests();
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return;
    setActioningId(id);
    try {
      const res = await fetch(`/api/admin/event-registration-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action: "reject", note: rejectNote || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
      setRejectingId(null);
      setRejectNote("");

      await fetchRequests();
    } catch (err: any) {
      alert(err.message);
      await fetchRequests();
    } finally {
      setActioningId(null);
    }
  };

  const filtered = filter === "pending" ? requests.filter((r) => r.status === "pending") : requests;

  const formatDateTime = (d: string | null) =>
    d ? new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

  return (
    <div>
      <h1 className="text-3xl font-bold">Event Registration Requests</h1>
      <p className="mt-2 text-gray-400">Review payment screenshots and verify or reject ticket requests.</p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            filter === "pending" ? "bg-amber-500 text-black" : "bg-white/5 text-gray-400"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
            filter === "all" ? "bg-amber-500 text-black" : "bg-white/5 text-gray-400"
          }`}
        >
          All
        </button>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading requests...
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-gray-500">No requests found.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-black/40 border border-white/10 mb-3 flex items-center justify-center">
                {r.screenshotUrl ? (
                  <img src={r.screenshotUrl} alt="Payment screenshot" className="w-full h-full object-contain" />
                ) : (
                  <ImageOff className="text-gray-600" size={28} />
                )}
              </div>

              <p className="font-semibold text-white">{r.fullName}</p>
              <p className="text-xs text-gray-400">{r.email}</p>
              <p className="text-xs text-amber-400 mt-1 font-medium">{r.eventTitle}</p>
              <p className="text-xs text-gray-500">{formatDate(r.eventDate)} · {r.venue}</p>
              <p className="text-xs text-gray-500 mt-1">₹{r.amount} · {formatDateTime(r.createdAt)}</p>

              <span
                className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                  r.status === "pending"
                    ? "bg-amber-500/10 text-amber-400"
                    : r.status === "verified"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {r.status}
              </span>

              {r.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleVerify(r.id)}
                    disabled={actioningId === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/90 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition disabled:opacity-50"
                  >
                    {actioningId === r.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Verify
                  </button>
                  <button
                    onClick={() => setRejectingId(r.id)}
                    disabled={actioningId === r.id}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-red-500/90 py-2 text-xs font-bold text-white hover:bg-red-400 transition disabled:opacity-50"
                  >
                    <XCircle size={14} />
                    Reject
                  </button>
                </div>
              )}

              {rejectingId === r.id && (
                <div className="mt-3 rounded-lg border border-white/10 bg-black/30 p-3">
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    placeholder="Optional reason (sent to user)"
                    className="w-full rounded-lg border border-white/10 bg-white/[0.03] p-2 text-xs text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
                    rows={2}
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleReject(r.id)}
                      className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-bold text-white hover:bg-red-400 transition"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => setRejectingId(null)}
                      className="flex-1 rounded-lg border border-white/10 py-1.5 text-xs text-gray-300 hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}