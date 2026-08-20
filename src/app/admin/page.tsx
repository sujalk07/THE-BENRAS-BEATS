"use client";

import Link from "next/link";
import {
  CalendarDays,
  Users,
  CreditCard,
  FileCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const adminSections = [
  {
    href: "/admin/events",
    number: "01",
    icon: CalendarDays,
    title: "Events",
    description: "Create, edit, and delete events.",
  },
  {
    href: "/admin/registrations",
    number: "02",
    icon: Users,
    title: "Registrations",
    description: "View all ticket holders per event.",
  },
  {
    href: "/admin/memberships",
    number: "03",
    icon: CreditCard,
    title: "Memberships",
    description: "View and manage member accounts.",
  },
  {
    href: "/admin/membership-requests",
    number: "04",
    icon: FileCheck,
    title: "Membership Requests",
    description:
      "Review payment screenshots and verify or reject requests.",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#090807] text-white">
      {/* Ambient atmosphere */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#C9A24B]/[0.035] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-10 border-b border-white/[0.07] pb-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A24B]" />

            <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] text-[#C9A24B]">
              <Sparkles size={12} />
              Administration
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-serif text-4xl tracking-wide text-[#EDE6D9] sm:text-5xl">
                Admin Overview
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
                Manage the events, registrations, memberships, and
                community requests that keep Benaras Beats moving.
              </p>
            </div>

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-700">
              BENARAS BEATS / CONTROL
            </span>
          </div>
        </div>

        {/* Management grid */}
        <div className="grid overflow-hidden border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {adminSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.href}
                href={section.href}
                className={`group relative flex min-h-[250px] flex-col justify-between bg-[#11100E] p-6 transition-colors duration-300 hover:bg-[#161410] sm:p-7 ${
                  index !== adminSections.length - 1
                    ? "border-b border-white/[0.08] sm:border-r"
                    : ""
                } ${
                  index === 1
                    ? "lg:border-r"
                    : ""
                } ${
                  index === 2
                    ? "sm:border-r lg:border-r"
                    : ""
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-stone-700">
                    ADMIN / {section.number}
                  </span>

                  <ArrowUpRight
                    size={16}
                    className="text-stone-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C9A24B]"
                  />
                </div>

                {/* Main content */}
                <div className="mt-10">
                  <div className="mb-6 flex h-11 w-11 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.04] transition-all duration-300 group-hover:border-[#C9A24B]/50 group-hover:bg-[#C9A24B]/[0.08]">
                    <Icon
                      size={19}
                      className="text-[#C9A24B]"
                    />
                  </div>

                  <h2 className="font-serif text-2xl tracking-wide text-[#EDE6D9] transition-colors duration-300 group-hover:text-[#C9A24B]">
                    {section.title}
                  </h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500 transition-colors duration-300 group-hover:text-stone-400">
                    {section.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-8 h-px w-0 bg-[#C9A24B]/60 transition-all duration-500 group-hover:w-12" />
              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-stone-700">
            Music · Culture · Community
          </span>

          <span className="text-xs text-stone-600">
            Select an area to manage your Benaras Beats operations.
          </span>
        </div>
      </div>
    </div>
  );
}