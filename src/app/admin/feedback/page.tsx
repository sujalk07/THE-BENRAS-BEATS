"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Loader2,
  Trash2,
  User,
  MessageCircle,
  Sparkles,
  Clock3,
} from "lucide-react";

interface FeedbackEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function AdminFeedbackPage() {
  const { user } = useAuth();

  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFeedback = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/feedback?userId=${user.id}`);
      const data = await res.json();

      if (res.ok) {
        setFeedback(data.feedback ?? []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;

    if (!confirm("Delete this feedback?")) return;

    setDeletingId(id);

    try {
      const res = await fetch(
        `/api/admin/feedback/${id}?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete");
        return;
      }

      setFeedback((prev) => prev.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
              <MessageCircle size={16} />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-400">
              Community Voice
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Feedback
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            See what visitors and members are saying about Benaras Beats.
          </p>
        </div>

        {/* Response count */}
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.025] px-4 py-2.5">
          <Sparkles size={15} className="text-amber-400" />

          <div>
            <p className="text-lg font-bold leading-none text-white">
              {feedback.length}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-gray-600">
              Responses
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-7 h-px bg-gradient-to-r from-amber-400/20 via-white/5 to-transparent" />

      {/* Loading */}
      {loading ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl border border-white/5 bg-white/[0.015] py-16 text-sm text-gray-500">
          <Loader2
            size={17}
            className="mr-2 animate-spin text-amber-400"
          />
          Loading feedback...
        </div>
      ) : feedback.length === 0 ? (
        /* Empty state */
        <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/10 bg-amber-400/5 text-amber-400">
            <MessageCircle size={20} />
          </div>

          <h3 className="mt-4 font-semibold text-white">
            No feedback yet
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Responses from your community will appear here.
          </p>
        </div>
      ) : (
        /* Feedback list */
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {feedback.map((f) => (
            <article
              key={f.id}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[#090a0d] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400/20 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Ambient glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-500/5 blur-3xl transition group-hover:bg-amber-500/10" />

              {/* Top row */}
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/15 bg-amber-400/5 text-amber-400">
                    <User size={17} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white">
                      {f.name || "Anonymous"}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-600">
                      <Clock3 size={11} />

                      {new Date(f.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </div>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  aria-label="Delete feedback"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/8 text-gray-600 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === f.id ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>

              {/* Message */}
              <div className="relative mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <MessageCircle
                  size={15}
                  className="absolute right-3 top-3 text-amber-400/20"
                />

                <p className="pr-5 text-sm leading-6 text-gray-300">
                  {f.message}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="mt-4 h-px w-0 bg-amber-400/50 transition-all duration-500 group-hover:w-10" />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}