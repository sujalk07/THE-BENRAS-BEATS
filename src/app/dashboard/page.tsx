"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Ticket, Crown, ArrowLeft, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

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
      <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0908] px-5 py-8 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-[#C9A24B]"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-700">
            TBB / Dashboard
          </span>
        </div>

        {/* Welcome */}
        <div className="mb-8">
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#B8923F]">
            Member Area
          </span>

          <h1 className="mt-2 font-serif text-4xl text-[#EDE6D9]">
            Welcome back.
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {user.email}
          </p>
        </div>

        {/* Dashboard */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E]">

          <Link
            href="/dashboard/tickets"
            className="group flex items-center gap-5 border-b border-white/[0.08] p-5 transition hover:bg-white/[0.025]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#B8923F]/[0.08] text-[#C9A24B]">
              <Ticket size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl text-[#EDE6D9]">
                Events
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                View registered events and tickets.
              </p>
            </div>

            <ArrowUpRight
              size={17}
              className="text-gray-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C9A24B]"
            />
          </Link>

          <Link
            href="/dashboard/members"
            className="group flex items-center gap-5 p-5 transition hover:bg-white/[0.025]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/[0.07] text-violet-300">
              <Crown size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-xl text-[#EDE6D9]">
                Members
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Explore the Benaras Beats community.
              </p>
            </div>

            <ArrowUpRight
              size={17}
              className="text-gray-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
            />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-between text-[9px] uppercase tracking-[0.15em] text-gray-700">
          <span>Music · Culture · Community</span>
          <span>Varanasi</span>
        </div>
      </div>
    </main>
  );
}