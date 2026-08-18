import React from 'react';
import { Handshake } from 'lucide-react';

import sponsorPhoto1 from '../assets/sponser_image1.jpg'; // BHAIRAVI
import sponsorPhoto2 from '../assets/sponser_image2.jpeg';      // CHETMANI
import sponsorPhoto3 from '../assets/sponser_image3.jpeg';   // RADIO CITY

export default function Sponsors() {
  return (
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-950/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-5xl text-center">

        {/* Heading */}
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
          Sponsorship and corporate alignment opportunities will be officially
          announced soon. Join us in shaping the cultural movement.
        </p>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Sponsor 1 - BHAIRAVI */}
          <div className="overflow-hidden rounded-2xl border border-gray-900 bg-[#0b0c10]/40 backdrop-blur-sm shadow-lg">
            <img
              src={sponsorPhoto1.src ?? sponsorPhoto1}
              alt="Bhairavi - A Unit of S.B Rajasthan Marbles"
              className="w-full h-64 object-cover"
            />

            <div className="p-5 text-left">
              <h3 className="text-lg font-semibold text-gray-100">
                BHAIRAVI
              </h3>

              <p className="text-sm text-amber-400 mt-1">
                A Unit of S.B Rajasthan Marbles
              </p>

              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Proud sponsor and partner supporting our cultural journey.
              </p>
            </div>
          </div>


          {/* Sponsor 2 - CHETMANI */}
          <div className="overflow-hidden rounded-2xl border border-gray-900 bg-[#0b0c10]/40 backdrop-blur-sm shadow-lg">
            <img
              src={sponsorPhoto2.src ?? sponsorPhoto2}
              alt="Chetmani Ornaments & Jewellers Pvt. Ltd."
              className="w-full h-64 object-contain bg-white p-4"
            />

            <div className="p-5 text-left">
              <h3 className="text-lg font-semibold text-gray-100">
                Chetmani
              </h3>

              <p className="text-sm text-amber-400 mt-1">
                Ornaments & Jewellers Pvt. Ltd.
              </p>

              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Proud sponsor and partner supporting our cultural journey.
              </p>
            </div>
          </div>


          {/* Sponsor 3 - RADIO CITY */}
          <div className="overflow-hidden rounded-2xl border border-gray-900 bg-[#0b0c10]/40 backdrop-blur-sm shadow-lg">
            <img
              src={sponsorPhoto3.src ?? sponsorPhoto3}
              alt="Radio City - A Jagran Initiative"
              className="w-full h-64 object-contain bg-white p-4"
            />

            <div className="p-5 text-left">
              <h3 className="text-lg font-semibold text-gray-100">
                Radio City
              </h3>

              <p className="text-sm text-amber-400 mt-1">
                A Jagran Initiative
              </p>

              <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                Proud sponsor and partner supporting our cultural journey.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}