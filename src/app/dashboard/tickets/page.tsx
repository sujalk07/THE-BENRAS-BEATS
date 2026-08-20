"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Ticket,
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  Crown,
  ArrowUpRight,
} from "lucide-react";

import { useAuth } from "@/components/providers/AuthProvider";

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

        if (res.ok) {
          setTickets(data.tickets ?? []);
        }
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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-gray-500">
        Loading...
      </div>
    );
  }

  const formatDate = (dateStr: string | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })
      : "—";

  return (
    <main className="min-h-screen bg-[#0A0908] px-5 py-8 text-white">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="group flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Dashboard
          </button>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700">
            TBB / Tickets
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8923F]">
            Your Access
          </span>

          <h1 className="mt-2 font-serif text-4xl text-[#EDE6D9]">
            My Tickets
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your registered events and upcoming experiences.
          </p>
        </div>

        {/* Loading */}
        {dataLoading ? (
          <div className="flex items-center gap-2 py-10 text-sm text-gray-500">
            <Loader2 size={16} className="animate-spin text-[#B8923F]" />
            Loading tickets...
          </div>
        ) : tickets.length === 0 ? (

          /* Empty state */
          <div className="rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] px-6 py-12 text-center">
            <Ticket className="mx-auto mb-4 h-7 w-7 text-gray-700" />

            <p className="text-sm text-gray-500">
              You haven't claimed any tickets yet.
            </p>

            <Link
              href="/events"
              className="mt-5 inline-flex items-center gap-2 text-xs text-[#C9A24B] transition hover:text-[#E0BE69]"
            >
              Explore events
              <ArrowUpRight size={13} />
            </Link>
          </div>

        ) : (

          /* Tickets */
          <div className="grid gap-4 md:grid-cols-2">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/dashboard/tickets/${ticket.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E] transition-all duration-300 hover:-translate-y-1 hover:border-[#B8923F]/40"
              >

                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  {ticket.image_url ? (
                    <img
                      src={ticket.image_url}
                      alt={ticket.event_title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#17140D] to-[#0D0C0A]">
                      <Ticket className="h-8 w-8 text-[#B8923F]/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-transparent to-transparent" />

                  {/* Ticket type */}
                  <div className="absolute right-4 top-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] backdrop-blur-md ${
                        ticket.is_member
                          ? "border-[#B8923F]/30 bg-[#B8923F]/10 text-[#D9B662]"
                          : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      }`}
                    >
                      {ticket.is_member && <Crown size={10} />}
                      {ticket.is_member ? "Member" : "Paid"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-xl text-[#EDE6D9] transition-colors group-hover:text-[#C9A24B]">
                        {ticket.event_title}
                      </h2>
                    </div>

                    <ArrowUpRight
                      size={16}
                      className="mt-1 shrink-0 text-gray-700 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8923F]"
                    />
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar
                        size={13}
                        className="shrink-0 text-[#B8923F]"
                      />
                      {formatDate(ticket.event_date)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin
                        size={13}
                        className="shrink-0 text-[#B8923F]"
                      />
                      <span className="truncate">
                        {ticket.venue}
                      </span>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                    <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-gray-700">
                      Event Access
                    </span>

                    <span className="text-xs font-medium text-gray-300">
                      {ticket.amount_paid > 0
                        ? `₹${ticket.amount_paid}`
                        : "Free"}
                    </span>
                  </div>
                </div>

                {/* Accent */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-between border-t border-white/[0.06] pt-5 text-[9px] uppercase tracking-[0.15em] text-gray-700">
          <span>Music · Culture · Community</span>
          <span>Varanasi</span>
        </div>
      </div>
    </main>
  );
}