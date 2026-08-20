"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ImageOff,
  ArrowUpRight,
  FileCheck,
  Clock3,
} from "lucide-react";

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
      const res = await fetch(
        `/api/admin/event-registration-requests?userId=${user.id}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setRequests(data.requests ?? []);
      }
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
      const res = await fetch(
        `/api/admin/event-registration-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            action: "verify",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "verified" } : r
        )
      );

      await fetchRequests();
    } catch (err: any) {
      alert(err.message);
      await fetchRequests();
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!user) return;

    setActioningId(id);

    try {
      const res = await fetch(
        `/api/admin/event-registration-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            action: "reject",
            note: rejectNote || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "rejected" } : r
        )
      );

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

  const filtered =
    filter === "pending"
      ? requests.filter((r) => r.status === "pending")
      : requests;

  const pendingCount = requests.filter(
    (r) => r.status === "pending"
  ).length;

  const formatDateTime = (d: string | null) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  const formatDate = (d: string | null) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })
      : "—";

  return (
    <div className="relative min-h-full overflow-hidden bg-[#090807] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.035] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8 border-b border-white/[0.07] pb-7">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A24B]" />

            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
              <FileCheck size={12} />
              Event Management
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl tracking-wide text-[#EDE6D9] sm:text-5xl">
                Registration Requests
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
                Review payment proofs and manage event ticket
                registrations.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
              <Clock3 size={12} />
              {pendingCount} Pending
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-7 flex items-center gap-1 border-b border-white/[0.06]">
          <button
            onClick={() => setFilter("pending")}
            className={`border-b-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
              filter === "pending"
                ? "border-[#C9A24B] text-[#C9A24B]"
                : "border-transparent text-stone-600 hover:text-stone-300"
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span className="ml-2 text-stone-500">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`border-b-2 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] transition ${
              filter === "all"
                ? "border-[#C9A24B] text-[#C9A24B]"
                : "border-transparent text-stone-600 hover:text-stone-300"
            }`}
          >
            All Requests
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-600">
            <Loader2
              size={18}
              className="mr-2 animate-spin text-[#C9A24B]"
            />
            Loading requests...
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-white/[0.08] bg-[#11100E] px-6 py-20 text-center">
            <FileCheck
              size={30}
              className="mx-auto text-stone-700"
            />

            <p className="mt-4 font-serif text-xl text-stone-400">
              No requests found
            </p>

            <p className="mt-2 text-sm text-stone-600">
              There are no {filter === "pending" ? "pending " : ""}
              registration requests to review.
            </p>
          </div>
        ) : (
          /* Requests */
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className="group overflow-hidden border border-white/[0.08] bg-[#11100E] transition-colors duration-300 hover:border-[#C9A24B]/25"
              >
                {/* Screenshot */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  {r.screenshotUrl ? (
                    <img
                      src={r.screenshotUrl}
                      alt="Payment screenshot"
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageOff
                        size={30}
                        className="text-stone-700"
                      />
                    </div>
                  )}

                  {/* Status */}
                  <div className="absolute left-3 top-3">
                    <span
                      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] backdrop-blur-md ${
                        r.status === "pending"
                          ? "border-[#C9A24B]/20 bg-[#C9A24B]/10 text-[#C9A24B]"
                          : r.status === "verified"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#11100E] to-transparent" />
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl text-[#EDE6D9]">
                        {r.fullName}
                      </h2>

                      <p className="mt-1 truncate text-xs text-stone-600">
                        {r.email}
                      </p>
                    </div>

                    <span className="shrink-0 font-mono text-xs font-bold text-[#C9A24B]">
                      ₹{r.amount}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-white/[0.06] pt-4">
                    <p className="text-sm font-medium text-stone-300">
                      {r.eventTitle}
                    </p>

                    <p className="mt-1 text-xs text-stone-600">
                      {formatDate(r.eventDate)}
                      {" · "}
                      {r.venue}
                    </p>

                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-stone-700">
                      Submitted {formatDateTime(r.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  {r.status === "pending" && (
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleVerify(r.id)}
                        disabled={actioningId === r.id}
                        className="flex items-center justify-center gap-2 bg-emerald-500 px-3 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actioningId === r.id ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Verify
                      </button>

                      <button
                        onClick={() => setRejectingId(r.id)}
                        disabled={actioningId === r.id}
                        className="flex items-center justify-center gap-2 border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Reject form */}
                  {rejectingId === r.id && (
                    <div className="mt-4 border border-white/[0.07] bg-black/20 p-4">
                      <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-stone-600">
                        Rejection Note
                      </p>

                      <textarea
                        value={rejectNote}
                        onChange={(e) =>
                          setRejectNote(e.target.value)
                        }
                        placeholder="Optional reason sent to the user..."
                        className="w-full resize-none border border-white/[0.08] bg-[#0B0A09] p-3 text-xs text-white placeholder:text-stone-700 focus:border-[#C9A24B]/40 focus:outline-none"
                        rows={3}
                      />

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleReject(r.id)}
                          disabled={actioningId === r.id}
                          className="flex-1 bg-red-500 py-2 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
                        >
                          {actioningId === r.id
                            ? "Rejecting..."
                            : "Confirm Reject"}
                        </button>

                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectNote("");
                          }}
                          className="flex-1 border border-white/[0.08] py-2 text-xs text-stone-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed state */}
                  {r.status !== "pending" && (
                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-stone-700">
                        Reviewed
                      </span>

                      <ArrowUpRight
                        size={14}
                        className="text-stone-700"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-700">
            Music · Culture · Community
          </span>

          <span className="text-xs text-stone-600">
            Review payment evidence carefully before verification.
          </span>
        </div>
      </div>
    </div>
  );
}