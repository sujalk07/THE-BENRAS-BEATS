"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  UserCircle,
  Mail,
  CreditCard,
  CalendarDays,
  Clock,
  Ticket,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface MembershipInfo {
  membership_status: "active" | "inactive";
  plan: "intro" | "regular" | null;
  start_date: string | null;
  expiry_date: string | null;
}

interface EventTicket {
  id: string;
  event_title: string;
  event_date: string;
  venue: string;
  status: "confirmed" | "cancelled" | string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [membership, setMembership] = useState<MembershipInfo>({
    membership_status: "inactive",
    plan: null,
    start_date: null,
    expiry_date: null,
  });
  const [tickets, setTickets] = useState<EventTicket[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/profile");
      return;
    }

    async function fetchProfileData() {
      if (!user) return;

      try {
        const [membershipRes, ticketsRes] = await Promise.all([
          fetch(`/api/membership-status?userId=${user.id}`),
          fetch(`/api/events/my-tickets?userId=${user.id}`),
        ]);

        if (membershipRes.ok) {
          const membershipData = await membershipRes.json();
          setMembership({
            membership_status: membershipData.membership_status ?? "inactive",
            plan: membershipData.plan ?? null,
            start_date: membershipData.start_date ?? null,
            expiry_date: membershipData.expiry_date ?? null,
          });
        }

        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setTickets(ticketsData.tickets ?? []);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchProfileData();
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { dateStyle: "medium" });
  };

  const planLabel =
    membership.membership_status !== "active"
      ? "No Active Plan"
      : membership.plan === "intro"
      ? "Introductory Membership"
      : membership.plan === "regular"
      ? "Regular Membership"
      : membership.plan
      ? membership.plan
      : "No Active Plan";

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        {/* Back to Home */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="rounded-3xl border border-white/10 bg-[#1f232d]/60 p-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <UserCircle size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-gray-400">Your account details</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {/* Full Name */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <UserCircle size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Full Name</span>
              </div>
              <p className="mt-2 text-white">
                {user.user_metadata?.full_name || user.user_metadata?.name || "Not set"}
              </p>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Email</span>
              </div>
              <p className="mt-2 text-white">{user.email}</p>
            </div>

            {/* Membership Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <CreditCard size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Membership Plan</span>
              </div>
              {dataLoading ? (
                <div className="mt-2 h-5 w-32 animate-pulse rounded bg-white/5" />
              ) : (
                <p
                  className={`mt-2 font-semibold ${
                    membership.membership_status === "active" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {planLabel}
                </p>
              )}
            </div>

            {/* Membership Start Date */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <CalendarDays size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Membership Start Date</span>
              </div>
              {dataLoading ? (
                <div className="mt-2 h-5 w-32 animate-pulse rounded bg-white/5" />
              ) : (
                <p className="mt-2 text-white">{formatDate(membership.start_date)}</p>
              )}
            </div>

            {/* Membership Expiry Date */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Clock size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">Membership Expiry Date</span>
              </div>
              {dataLoading ? (
                <div className="mt-2 h-5 w-32 animate-pulse rounded bg-white/5" />
              ) : (
                <p className="mt-2 text-white">{formatDate(membership.expiry_date)}</p>
              )}
            </div>

            {/* My Event Tickets */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Ticket size={18} className="text-amber-400" />
                <span className="text-sm uppercase tracking-wider">My Event Tickets</span>
              </div>

              {dataLoading ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin" /> Loading tickets...
                </div>
              ) : tickets.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">
                  You haven't booked any event tickets yet.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{ticket.event_title}</p>
                        <p className="text-xs text-gray-400">
                          {formatDate(ticket.event_date)} · {ticket.venue}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          ticket.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}