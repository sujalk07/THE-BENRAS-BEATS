"use client";

import Link from "next/link";
import {
  CalendarDays,
  Users,
  CreditCard,
  FileCheck,
} from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Overview</h1>
      <p className="mt-2 text-gray-400">
        Manage events, registrations, memberships, and membership requests.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/events"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-amber-500/40"
        >
          <CalendarDays className="text-amber-400" />
          <h2 className="mt-4 text-lg font-semibold">Events</h2>
          <p className="mt-2 text-sm text-gray-400">
            Create, edit, and delete events.
          </p>
        </Link>

        <Link
          href="/admin/registrations"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-amber-500/40"
        >
          <Users className="text-amber-400" />
          <h2 className="mt-4 text-lg font-semibold">Registrations</h2>
          <p className="mt-2 text-sm text-gray-400">
            View all ticket holders per event.
          </p>
        </Link>

        <Link
          href="/admin/memberships"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-amber-500/40"
        >
          <CreditCard className="text-amber-400" />
          <h2 className="mt-4 text-lg font-semibold">Memberships</h2>
          <p className="mt-2 text-sm text-gray-400">
            View and manage member accounts.
          </p>
        </Link>

        <Link
          href="/admin/membership-requests"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-amber-500/40"
        >
          <FileCheck className="text-amber-400" />
          <h2 className="mt-4 text-lg font-semibold">
            Membership Requests
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Review payment screenshots and verify or reject requests.
          </p>
        </Link>
      </div>
    </div>
  );
}