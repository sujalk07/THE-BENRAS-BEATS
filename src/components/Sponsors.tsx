import React from 'react';
import { Handshake, HelpCircle } from 'lucide-react';

export default function Sponsors() {
  // Placeholder array to render elegant, empty structural wireframes for incoming brands
  const placeholderSlots = Array(4).fill(null);

  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      {/* Background ambient decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-950/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl text-center">
        
        {/* Top Section Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-6">
          <Handshake className="w-3.5 h-3.5" />
          Partnerships
        </div>

        {/* Section Headers */}
        <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
          Our Sponsors
        </h2>
        
        {/* Custom Elegant Divider */}
        <div className="flex items-center justify-center gap-4 mt-4 mb-6 w-full max-w-xs mx-auto">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
          <span className="text-amber-500 text-xs opacity-60">🎵</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>

        <p className="mx-auto max-w-xl text-sm md:text-base text-gray-400 leading-relaxed mb-12">
          Sponsorship and corporate alignment opportunities will be officially announced soon. Join us in shaping the cultural movement.
        </p>

        {/* Premium Wireframe Grid for Upcoming Logos */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
          {placeholderSlots.map((_, index) => (
            <div
              key={index}
              className="group relative flex h-24 items-center justify-center rounded-xl border border-gray-900 bg-[#0b0c10]/30 backdrop-blur-sm transition-all duration-300 hover:border-gray-800 hover:bg-[#0b0c10]/60"
            >
              {/* Subtle inner design details making the empty block feel finished */}
              <div className="flex flex-col items-center gap-1.5 opacity-25 group-hover:opacity-40 transition-opacity duration-300">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] tracking-widest uppercase text-gray-400">Reserved</span>
              </div>
              
              {/* Corner accent lines on hover */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-transparent group-hover:border-amber-500/30 transition-colors duration-300 rounded-tl-sm" />
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-transparent group-hover:border-amber-500/30 transition-colors duration-300 rounded-br-sm" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}