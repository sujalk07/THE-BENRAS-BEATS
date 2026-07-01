// app/dashboard/tickets/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Ticket, Calendar, MapPin, ArrowLeft, Loader2, Crown } from "lucide-react";

interface TicketSummary {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  venue: string;
  image_url: string | null;
  is_member: boolean;
  amount_paid: number;
}

export default function TicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard/tickets");
      return;
    }

    async function fetchTickets() {
      if (!user) return;
      try {
        const res = await fetch(`/api/tickets?userId=${user.id}`);
        const data = await res.json();
        if (res.ok) setTickets(data.tickets ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchTickets();
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  const formatDate = (dateStr: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—";

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold mb-2">My Tickets</h1>
        <p className="text-gray-400 mb-8">All event tickets you've claimed or purchased.</p>

        {dataLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={16} className="animate-spin" /> Loading tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-gray-500">
            You haven't claimed any tickets yet.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.id}`}
                className="group rounded-2xl border border-white/10 bg-[#1f232d]/60 overflow-hidden hover:border-amber-500/40 transition-all"
              >
                {ticket.image_url ? (
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={ticket.image_url}
                      alt={ticket.event_title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full flex items-center justify-center bg-gradient-to-br from-amber-950/20 to-gray-950">
                    <Ticket className="text-amber-500/30" size={28} />
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-bold text-white text-sm line-clamp-1">{ticket.event_title}</h3>

                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} className="text-amber-500" />
                    {formatDate(ticket.event_date)}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <MapPin size={12} className="text-amber-500" />
                    <span className="line-clamp-1">{ticket.venue}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        ticket.is_member
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {ticket.is_member && <Crown size={10} />}
                      {ticket.is_member ? "Member" : "Paid"}
                    </span>
                    <span className="text-xs font-semibold text-gray-300">
                      {ticket.amount_paid > 0 ? `₹${ticket.amount_paid}` : "Free"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}