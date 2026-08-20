"use client";

import Link from "next/link";
import { ArrowUpRight, Users } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">
      {/* Subtle ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8923F]/[0.045] blur-[120px]" />

      {/* Subtle architectural lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div className="absolute left-[12%] top-0 h-full w-px bg-white" />
        <div className="absolute right-[12%] top-0 h-full w-px bg-white" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Left — identity */}
          <div className="relative">
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#B8923F]/70" />

              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#B8923F]">
                The Community
              </span>
            </div>

            <h2 className="max-w-lg font-serif text-4xl leading-[1.08] tracking-wide text-[#EDE6D9] md:text-5xl lg:text-6xl">
              More than
              <br />
              <span className="italic text-[#C9A24B]">an audience.</span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-gray-400 md:text-base">
              The Benaras Beats brings together music lovers, artists,
              creators, and people who believe that music can create
              meaningful connections.
            </p>

            <Link
              href="/dashboard/members"
              className="group mt-9 inline-flex items-center gap-3 border-b border-[#B8923F]/50 pb-2 text-sm font-medium tracking-wide text-[#EDE6D9] transition-colors duration-300 hover:border-[#C9A24B] hover:text-[#C9A24B]"
            >
              <Users className="h-4 w-4 text-[#B8923F]" />

              <span>Explore the community</span>

              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Right — community statement */}
          <div className="relative">
            <div className="relative overflow-hidden border border-white/[0.08] bg-[#11100E]">

              {/* Top editorial strip */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
                <span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">
                  TBB / COMMUNITY
                </span>

                <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#B8923F]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B8923F]" />
                  Together
                </span>
              </div>

              {/* Main content */}
              <div className="px-7 py-9 md:px-10 md:py-12">
                <div className="mb-8 flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#B8923F]/25 bg-[#B8923F]/[0.06]">
                    <Users className="h-5 w-5 text-[#C9A24B]" />
                  </div>

                  <div>
                    <p className="font-serif text-2xl tracking-wide text-[#EDE6D9]">
                      Music connects us.
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-600">
                      People make it meaningful.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-[#B8923F]/40 via-white/[0.08] to-transparent" />

                <p className="mt-7 max-w-xl text-sm leading-7 text-gray-400">
                  Every gathering is shaped by the people who walk through
                  the doors. Discover the members, artists, and supporters
                  who are becoming part of the Benaras Beats story.
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="grid grid-cols-3 border-t border-white/[0.07]">
                <div className="border-r border-white/[0.07] px-5 py-4">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-gray-600">
                    People
                  </span>
                  <span className="mt-1 block text-xs text-gray-300">
                    Music lovers
                  </span>
                </div>

                <div className="border-r border-white/[0.07] px-5 py-4">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-gray-600">
                    Spirit
                  </span>
                  <span className="mt-1 block text-xs text-gray-300">
                    Shared experiences
                  </span>
                </div>

                <div className="px-5 py-4">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-gray-600">
                    Place
                  </span>
                  <span className="mt-1 block text-xs text-gray-300">
                    Benaras
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative offset border */}
            <div className="pointer-events-none absolute -bottom-2 -right-2 -z-0 h-full w-full border border-[#B8923F]/10" />
          </div>
        </div>
      </div>
    </section>
  );
}