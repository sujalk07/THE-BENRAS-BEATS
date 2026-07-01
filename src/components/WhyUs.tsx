import React from 'react';
import { Music, Users, Heart, Mic } from 'lucide-react';

export default function WhyUs() {
  const cards = [
    {
      icon: <Music className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110" />,
      title: "Live Musical Experiences",
      description: "Enjoy carefully curated live performances across genres.",
      hoverColor: "hover:border-purple-500/40 hover:shadow-[0_0_25px_rgba(168,85,247,0.15)]"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110" />,
      title: "Community Connection",
      description: "Meet like-minded people who share a passion for music.",
      hoverColor: "hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)]"
    },
    {
      icon: <Heart className="w-8 h-8 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110" />,
      title: "Music & Wellbeing",
      description: "Experience the positive impact of music on mind and soul.",
      hoverColor: "hover:border-rose-500/40 hover:shadow-[0_0_25px_rgba(244,63,94,0.15)]"
    },
    {
      icon: <Mic className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110" />,
      title: "Support Emerging Artists",
      description: "Encouraging and showcasing talented local artists.",
      hoverColor: "hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)]"
    }
  ];

  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden">
      {/* Optional ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
            Why The Benaras Beats?
          </h2>
          
          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-xs">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-amber-500 text-sm animate-pulse">🎵</span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`group flex flex-col items-center text-center rounded-2xl border border-gray-800/60 bg-[#0b0c10]/60 p-8 backdrop-blur-sm transition-all duration-300 ease-out cursor-pointer ${card.hoverColor}`}
            >
              {/* Icon Container with Floating Glow Wrapper */}
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900/50 border border-gray-800 group-hover:border-transparent transition-colors duration-300">
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

      </div>
    </section>
  );
}