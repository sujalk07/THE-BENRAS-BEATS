import React from 'react';
import { Handshake } from 'lucide-react';
import sponsorPhoto from '../assets/your-sponsor-photo.jpg';

export default function Sponsors() {
  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-950/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-6">
          <Handshake className="w-3.5 h-3.5" />
          Partnerships
        </div>

        <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
          Our Sponsors
        </h2>

        <div className="flex items-center justify-center gap-4 mt-4 mb-6 w-full max-w-xs mx-auto">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-amber-500/40" />
          <span className="text-amber-500 text-xs opacity-60">🎵</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>

        <p className="mx-auto max-w-xl text-sm md:text-base text-gray-400 leading-relaxed mb-12">
          Sponsorship and corporate alignment opportunities will be officially announced soon. Join us in shaping the cultural movement.
        </p>

        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-gray-900 bg-[#0b0c10]/40 backdrop-blur-sm shadow-lg">
          <img
            src={sponsorPhoto.src ?? sponsorPhoto}
            alt="Sponsor"
            className="w-full h-64 object-cover"
          />
          <div className="p-5 text-left">
            <h3 className="text-lg font-semibold text-gray-100">BHAIRAVI :
               a unit of S.B Rajasthan marbles
            </h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
              Proud sponsor and partner supporting our cultural journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}