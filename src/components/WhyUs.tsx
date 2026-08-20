'use client';

import React from 'react';
import Link from 'next/link';
import { Music, Users, Heart, Mic, ArrowRight } from 'lucide-react';

export default function WhyUs() {
  const cards = [
    {
      icon: <Music className="w-8 h-8 text-[#C9A24B] transition-transform duration-300 group-hover:-translate-y-1.5" />,
      title: 'Live Musical Experiences',
      description: 'Enjoy carefully curated live performances across genres.',
      ring: 'group-hover:border-[#C9A24B]/40',
    },
    {
      icon: <Users className="w-8 h-8 text-[#D9CBA0] transition-transform duration-300 group-hover:-translate-y-1.5" />,
      title: 'Community Connection',
      description: 'Meet like-minded people who share a passion for music.',
      ring: 'group-hover:border-[#D9CBA0]/40',
    },
    {
      icon: <Heart className="w-8 h-8 text-[#C4707F] transition-transform duration-300 group-hover:-translate-y-1.5" />,
      title: 'Music & Wellbeing',
      description: 'Experience the positive impact of music on mind and soul.',
      ring: 'group-hover:border-[#C4707F]/40',
    },
    {
      icon: <Mic className="w-8 h-8 text-[#A39A8C] transition-transform duration-300 group-hover:-translate-y-1.5" />,
      title: 'Support Emerging Artists',
      description: 'Encouraging and showcasing talented local artists.',
      ring: 'group-hover:border-[#A39A8C]/40',
    },
  ];

  return (
    <section className="relative px-6 py-24 bg-[#0A0908] text-white overflow-hidden">
      {/* Single soft gold glow, centered — no color blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C9A24B]/[0.04] blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-[#EDE6D9]">
            Why The Benaras Beats?
          </h2>

          {/* Waveform divider — echoes the Hero signature element */}
          <div className="flex items-center justify-center gap-4 mt-5 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#B8923F]/50" />
            <div className="flex items-end gap-[3px] h-3.5" aria-hidden="true">
              {[5, 10, 7, 13, 8].map((h, i) => (
                <span
                  key={i}
                  className="w-[2px] rounded-full bg-[#B8923F]"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#B8923F]/50" />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`group flex flex-col items-center text-center rounded-2xl border border-white/[0.08] bg-[#111014]/70 p-8 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer hover:bg-[#141317]/80 ${card.ring}`}
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.03] border border-white/10 group-hover:border-transparent transition-colors duration-300">
                {card.icon}
              </div>

              <h3 className="mb-3 text-lg font-medium tracking-wide text-gray-200 group-hover:text-white transition-colors">
                {card.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-5 rounded-2xl border border-white/10 bg-[#111014]/70 backdrop-blur-sm px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 shrink-0 text-[#C4707F] fill-[#C4707F]/30" />
            <p className="text-sm leading-relaxed text-gray-300 sm:text-base">
              Whether you seek peace, celebration, devotion, or inspiration,
              there's a genre that resonates with every heart.
            </p>
          </div>

          <Link
            href="/genres"
            className="group relative inline-flex shrink-0 items-center justify-center gap-3 rounded-lg bg-[#C9A24B] px-8 py-3.5 font-semibold text-[#0A0908] shadow-[0_0_18px_rgba(201,162,75,0.22)] transition-all duration-200 hover:bg-[#D9B662] hover:shadow-[0_0_26px_rgba(201,162,75,0.4)] active:scale-[0.98]"
          >
            <Music className="h-4 w-4" />
            <span>Explore Our Genres</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}