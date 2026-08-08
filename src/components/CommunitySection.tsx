"use client";

import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";

export default function CommunitySection() {
  return (
    <section className="relative px-6 py-20 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-6 font-medium">
          <Users className="w-3.5 h-3.5" />
          Our Community
        </div>

        <h2 className="mb-4 text-3xl md:text-4xl font-serif tracking-wide text-gray-100">
          Meet Our Members
        </h2>

        <p className="mx-auto mb-8 max-w-xl text-sm md:text-base leading-relaxed text-gray-400">
          The Benaras Beats is powered by a growing community of music
          lovers, artists, and changemakers. Sign in to explore our full
          members directory and see who's part of the journey.
        </p>

        <Link
          href="/dashboard/members"
          className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98]"
        >
          <Users className="w-4 h-4" />
          <span>View Our Members</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}