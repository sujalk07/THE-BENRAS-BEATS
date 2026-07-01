// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { LayoutDashboard, Ticket, Crown, ArrowLeft } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
          aria-label="Back to home"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-400">
          Welcome back, {user.email}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <LayoutDashboard className="text-amber-400" />
            <h2 className="mt-4 text-xl font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-gray-400">
              Your membership, events, and account activity in one place.
            </p>
          </div>

          <Link
            href="/dashboard/tickets"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-amber-500/40 transition-colors"
          >
            <Ticket className="text-amber-400" />
            <h2 className="mt-4 text-xl font-semibold">Events</h2>
            <p className="mt-2 text-sm text-gray-400">
              View your registered events and upcoming access.
            </p>
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Crown className="text-amber-400" />
            <h2 className="mt-4 text-xl font-semibold">Membership</h2>
            <p className="mt-2 text-sm text-gray-400">
              Check your plan status and benefits.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}