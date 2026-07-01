"use client";

import React from 'react';
import { Mic2, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function PerformSection() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Dynamically set path: Redirect back to apply page after registration if anonymous
  const performerUrl = isLoggedIn 
  ? '/performer/apply' 
  : '/signup?redirectTo=/performer/apply';

  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-gray-800/80 bg-gradient-to-b from-[#0b0c10]/80 to-[#07080b]/90 p-12 md:p-16 text-center backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.5)]">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-6 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Artist Spotlight
        </div>

        <h2 className="mb-4 text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
          Want To Perform?
        </h2>

        <p className="mx-auto mb-10 max-w-2xl text-sm md:text-base leading-relaxed text-gray-400">
          We are creating a dedicated platform designed to discover, support, and uplift independent creators and local talent. Drop your portfolio details, audio samples, and coordinates below to secure your spotlight in our upcoming lineups.
        </p>

        <div className="inline-block relative group">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 blur opacity-30 group-hover:opacity-70 transition duration-300" />
          
          <Link 
            href={performerUrl}
            className="relative flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 border border-amber-500/20 px-8 py-3.5 font-bold tracking-wide text-black shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mic2 className="w-4 h-4" />
            <span>Apply Now as Performer</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}