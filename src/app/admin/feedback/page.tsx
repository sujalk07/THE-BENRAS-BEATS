"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, MessageCircle, Trash2, User } from "lucide-react";

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
      if (res.ok) setFeedback(data.feedback ?? []);
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
      const res = await fetch(`/api/admin/feedback/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
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
    <div>
      <h1 className="text-3xl font-bold">Feedback</h1>
      <p className="mt-2 text-gray-400">{feedback.length} responses from visitors and members.</p>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : feedback.length === 0 ? (
        <p className="mt-8 text-gray-500">No feedback yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {feedback.map((f) => (
            <div key={f.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{f.name}</h3>
                    <p className="text-xs text-gray-500">
                      {new Date(f.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(f.id)}
                  disabled={deletingId === f.id}
                  className="rounded-lg border border-white/10 p-2 text-gray-400 hover:border-red-500/40 hover:text-red-400 transition disabled:opacity-50 shrink-0"
                >
                  {deletingId === f.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-300 leading-relaxed">{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}