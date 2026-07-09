"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Loader2, Mail, Bell, Send } from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminMembershipWaitlistPage() {
  const { user } = useAuth();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifying, setNotifying] = useState(false);

  const fetchWaitlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/membership-waitlist?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) setWaitlist(data.waitlist ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
  }, [user]);

  const handleNotifyAll = async () => {
    if (!user) return;
    if (
      !confirm(
        `Send "Memberships are now open" email to all ${waitlist.length} people on the waitlist? This cannot be undone.`
      )
    )
      return;

    setNotifying(true);
    try {
      const res = await fetch("/api/admin/membership-waitlist/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send notifications");
        return;
      }
      alert(data.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membership Waitlist</h1>
          <p className="mt-1 text-sm text-gray-400">
            People who asked to be notified when memberships open.
          </p>
        </div>

        <button
          onClick={handleNotifyAll}
          disabled={notifying || waitlist.length === 0}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-50"
        >
          {notifying ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Notify Everyone ({waitlist.length})
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-300">
        <Bell size={13} className="shrink-0" />
        Only use "Notify Everyone" once you've flipped MEMBERSHIPS_ENABLED to true and redeployed.
      </div>

      {loading ? (
        <div className="mt-8 flex items-center gap-2 text-gray-500">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      ) : waitlist.length === 0 ? (
        <p className="mt-8 text-gray-500">No one on the waitlist yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-left text-gray-400">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined Waitlist</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {waitlist.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3 flex items-center gap-2 text-white">
                    <Mail size={13} className="text-gray-500" />
                    {entry.email}
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(entry.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
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