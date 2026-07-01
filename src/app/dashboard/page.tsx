"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { LayoutDashboard, Ticket, Crown } from "lucide-react";

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

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Ticket className="text-amber-400" />
            <h2 className="mt-4 text-xl font-semibold">Events</h2>
            <p className="mt-2 text-sm text-gray-400">
              View your registered events and upcoming access.
            </p>
          </div>

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