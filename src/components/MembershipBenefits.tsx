import React from 'react';
import { Sparkles, Ticket, Users2, Percent } from 'lucide-react';

export default function MembershipBenefits() {
  const benefits = [
    {
      icon: <Ticket className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />,
      title: "Priority Access",
      description: "Get early access to registrations, front-row seats, and limited special events.",
      glowColor: "group-hover:border-purple-500/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
    },
    {
      icon: <Percent className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />,
      title: "Member Discounts",
      description: "Enjoy exclusive, recurring discounts on selected premium events and curated merchandise.",
      glowColor: "group-hover:border-amber-500/30 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
    },
    {
      icon: <Users2 className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      title: "Community Network",
      description: "Connect safely and collaborate with local artists, classical performers, and fellow enthusiasts.",
      glowColor: "group-hover:border-cyan-500/30 group-hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-rose-500 group-hover:text-rose-400 transition-colors" />,
      title: "Exclusive Experiences",
      description: "Access unique acoustic gatherings, local masterclasses, and interactive member-only opportunities.",
      glowColor: "group-hover:border-rose-500/30 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]"
    }
  ];

  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      {/* Background radial atmosphere overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-950/5 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
            Membership Benefits
          </h2>
          
          {/* Custom Elegant Divider */}
          <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-amber-500 text-sm">🎵</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

          <p className="mt-6 max-w-2xl text-gray-400 text-base md:text-lg">
            Become a part of The Benaras Beats community and unlock exclusive access to the rhythms of heritage.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className={`group flex flex-col items-start rounded-2xl border border-gray-800/60 bg-[#0b0c10]/60 p-6 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer ${benefit.glowColor}`}
            >
              {/* Icon Badging */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900/50 border border-gray-800/80 group-hover:scale-105 group-hover:bg-gray-900 transition-all duration-300">
                {benefit.icon}
              </div>

              <h3 className="mb-2 text-lg font-semibold tracking-wide text-gray-200 group-hover:text-white transition-colors duration-200">
                {benefit.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}