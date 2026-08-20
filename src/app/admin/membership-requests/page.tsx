"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  ImageOff,
  CreditCard,
  Clock3,
  User,
  Mail,
  IndianRupee,
} from "lucide-react";

interface MembershipRequest {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  screenshotUrl: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export default function AdminMembershipRequestsPage() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const fetchRequests = async () => {
    if (!user) return;

    try {
      const res = await fetch(
        `/api/admin/membership-requests?userId=${user.id}`,
        { cache: "no-store" }
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
        `/api/admin/membership-requests/${id}`,
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
        prev.map((request) =>
          request.id === id
            ? { ...request, status: "verified" }
            : request
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
        `/api/admin/membership-requests/${id}`,
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
        prev.map((request) =>
          request.id === id
            ? {
                ...request,
                status: "rejected",
                adminNote: rejectNote || null,
              }
            : request
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
      ? requests.filter((request) => request.status === "pending")
      : requests;

  const pendingCount = requests.filter(
    (request) => request.status === "pending"
  ).length;

  const formatDateTime = (date: string | null) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "—";

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <CreditCard size={16} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400">
              Membership Management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Membership Requests
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review payment proofs and manage membership approvals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
          <Clock3 size={15} className="text-amber-400" />

          <span className="text-xs text-gray-400">
            Pending
          </span>

          <span className="text-sm font-bold text-white">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* FILTER */}
      <div className="mt-7 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.025] p-1 w-fit">
        <button
          onClick={() => setFilter("pending")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
            filter === "pending"
              ? "bg-amber-500 text-black shadow-sm"
              : "text-gray-500 hover:text-white"
          }`}
        >
          Pending
          {pendingCount > 0 && (
            <span
              className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] ${
                filter === "pending"
                  ? "bg-black/10"
                  : "bg-white/5"
              }`}
            >
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
            filter === "all"
              ? "bg-amber-500 text-black shadow-sm"
              : "text-gray-500 hover:text-white"
          }`}
        >
          All Requests
        </button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="mt-8 flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.015] py-16 text-sm text-gray-500">
          <Loader2
            size={17}
            className="mr-2 animate-spin text-amber-400"
          />
          Loading membership requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <CreditCard size={20} />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            No requests found
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            There are no membership requests in this view.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((request) => {
            const isActioning = actioningId === request.id;

            return (
              <div
                key={request.id}
                className="group overflow-hidden rounded-2xl border border-white/8 bg-[#0d0f14] transition-all duration-300 hover:border-amber-400/20 hover:shadow-xl hover:shadow-black/20"
              >
                {/* SCREENSHOT */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  {request.screenshotUrl ? (
                    <img
                      src={request.screenshotUrl}
                      alt={`Payment screenshot from ${request.fullName}`}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-700">
                      <ImageOff size={30} />
                      <span className="mt-2 text-[10px] uppercase tracking-wider">
                        No Screenshot
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* STATUS */}
                  <span
                    className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider backdrop-blur ${
                      request.status === "pending"
                        ? "border-amber-400/20 bg-amber-500/10 text-amber-400"
                        : request.status === "verified"
                        ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                        : "border-red-400/20 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {request.status}
                  </span>

                  {/* AMOUNT */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1 text-sm font-bold text-white">
                    <IndianRupee size={14} />
                    {request.amount}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                      <User size={15} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-white">
                        {request.fullName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                        <Mail size={11} />
                        <span className="truncate">
                          {request.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/5 pt-3">
                    <p className="text-[10px] uppercase tracking-wider text-gray-600">
                      Submitted
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDateTime(request.createdAt)}
                    </p>
                  </div>

                  {/* ADMIN NOTE */}
                  {request.adminNote && (
                    <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">
                        Admin Note
                      </p>

                      <p className="mt-1 text-xs leading-relaxed text-gray-400">
                        {request.adminNote}
                      </p>
                    </div>
                  )}

                  {/* ACTIONS */}
                  {request.status === "pending" && (
                    <div className="mt-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleVerify(request.id)
                          }
                          disabled={isActioning}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isActioning ? (
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
                          onClick={() =>
                            setRejectingId(request.id)
                          }
                          disabled={isActioning}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>

                      {/* REJECT PANEL */}
                      {rejectingId === request.id && (
                        <div className="mt-3 rounded-xl border border-red-500/10 bg-red-500/[0.03] p-3">
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                            Rejection Reason
                          </p>

                          <textarea
                            value={rejectNote}
                            onChange={(e) =>
                              setRejectNote(e.target.value)
                            }
                            placeholder="Optional reason sent to the user..."
                            rows={3}
                            className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-2.5 text-xs text-white outline-none placeholder:text-gray-700 focus:border-red-400/30"
                          />

                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() =>
                                handleReject(request.id)
                              }
                              disabled={isActioning}
                              className="flex-1 rounded-lg bg-red-500 py-2 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
                            >
                              {isActioning
                                ? "Rejecting..."
                                : "Confirm Reject"}
                            </button>

                            <button
                              onClick={() => {
                                setRejectingId(null);
                                setRejectNote("");
                              }}
                              disabled={isActioning}
                              className="rounded-lg border border-white/10 px-4 py-2 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}