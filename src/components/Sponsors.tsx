"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Handshake } from "lucide-react";

import sponsorPhoto1 from "../assets/sponser_image1.jpg";
import sponsorPhoto2 from "../assets/sponser_image2.jpeg";
import sponsorPhoto3 from "../assets/sponser_image3.jpeg";

export default function Sponsors() {
  const sponsors = [
    {
      image: sponsorPhoto1,
      name: "BHAIRAVI",
      subtitle: "A Unit of S.B Rajasthan Marbles",
      role: "Partner",
      alt: "Bhairavi - A Unit of S.B Rajasthan Marbles",
    },
    {
      image: sponsorPhoto2,
      name: "CHETMANI",
      subtitle: "Ornaments & Jewellers Pvt. Ltd.",
      role: "Presenting Partner",
      alt: "Chetmani Ornaments & Jewellers Pvt. Ltd.",
    },
    {
      image: sponsorPhoto3,
      name: "RADIO CITY",
      subtitle: "A Jagran Initiative",
      role: "Radio Partner",
      alt: "Radio City - A Jagran Initiative",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0A0908] px-6 py-28 text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8923F]/[0.025] blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* ───────── HEADER ───────── */}
        <div className="mb-20 text-center">

          <div className="mb-7 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#B8923F]/50" />

            <div className="flex items-center gap-2">
              <Handshake className="h-3.5 w-3.5 text-[#B8923F]" />

              <span className="text-[9px] uppercase tracking-[0.35em] text-[#B8923F]">
                In Partnership
              </span>
            </div>

            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#B8923F]/50" />
          </div>

          <h2 className="font-serif text-4xl tracking-wide text-[#EDE6D9] md:text-5xl lg:text-6xl">
            The people behind the movement.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-500 md:text-base">
            Our partners help us create spaces where music, culture,
            and community come together.
          </p>
        </div>

        {/* ───────── PARTNERS ───────── */}
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.35fr_1fr]">

          {/* ───── BHAIRAVI ───── */}
          <div className="group relative">

            <div className="mb-4 flex items-center justify-between px-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gray-600">
                Partner / 01
              </span>

              <ArrowUpRight className="h-4 w-4 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#B8923F]" />
            </div>

            <div className="relative overflow-hidden border border-white/[0.07] bg-[#11100E] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#B8923F]/30">

              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EE]">
                <Image
                  src={sponsorPhoto1}
                  alt={sponsors[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="px-6 py-6">

                <span className="text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
                  Partner
                </span>

                <h3 className="mt-2 font-serif text-2xl tracking-wide text-[#EDE6D9]">
                  BHAIRAVI
                </h3>

                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-gray-500">
                  A Unit of S.B Rajasthan Marbles
                </p>

              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-full" />
            </div>
          </div>


          {/* ───── CHETMANI / FEATURED ───── */}
          <div className="group relative">

            {/* Featured label */}
            <div className="mb-4 flex items-center justify-between px-2">

              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
                Presenting Partner / 02
              </span>

              <ArrowUpRight className="h-4 w-4 text-[#B8923F]/60 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#C9A24B]" />
            </div>

            <div className="relative overflow-hidden border border-[#B8923F]/25 bg-[#14120F] shadow-[0_0_80px_rgba(184,146,63,0.04)] transition-all duration-500 group-hover:-translate-y-2 group-hover:border-[#B8923F]/50">

              {/* Gold top line */}
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#B8923F] to-transparent" />

              {/* Logo area */}
              <div className="relative aspect-[5/3] overflow-hidden bg-[#F5F3EE]">

                <Image
                  src={sponsorPhoto2}
                  alt={sponsors[1].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.04]"
                />

              </div>

              {/* Details */}
              <div className="px-7 py-7 text-center">

                <div className="mb-3 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-[#B8923F]/40" />

                  <span className="text-[8px] uppercase tracking-[0.35em] text-[#C9A24B]">
                    Presenting Partner
                  </span>

                  <span className="h-px w-8 bg-[#B8923F]/40" />
                </div>

                <h3 className="font-serif text-3xl tracking-wide text-[#EDE6D9] md:text-4xl">
                  CHETMANI
                </h3>

                <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#B8923F]">
                  Ornaments & Jewellers Pvt. Ltd.
                </p>

              </div>

              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#B8923F] transition-all duration-700 group-hover:w-full" />
            </div>
          </div>


          {/* ───── RADIO CITY ───── */}
          <div className="group relative">

            <div className="mb-4 flex items-center justify-between px-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-gray-600">
                Radio Partner / 03
              </span>

              <ArrowUpRight className="h-4 w-4 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#B8923F]" />
            </div>

            <div className="relative overflow-hidden border border-white/[0.07] bg-[#11100E] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#B8923F]/30">

              <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EE]">

                <Image
                  src={sponsorPhoto3}
                  alt={sponsors[2].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-contain p-10 transition-transform duration-700 group-hover:scale-[1.04]"
                />

              </div>

              <div className="px-6 py-6">

                <span className="text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
                  Radio Partner
                </span>

                <h3 className="mt-2 font-serif text-2xl tracking-wide text-[#EDE6D9]">
                  RADIO CITY
                </h3>

                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-gray-500">
                  A Jagran Initiative
                </p>

              </div>

              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-full" />
            </div>
          </div>

        </div>


        {/* ───────── FOOTER ───────── */}
        <div className="mt-16 flex flex-col items-center gap-5">

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <div className="flex items-center gap-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-600">
              Music
            </span>

            <span className="h-1 w-1 rounded-full bg-[#B8923F]" />

            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-600">
              Culture
            </span>

            <span className="h-1 w-1 rounded-full bg-[#B8923F]" />

            <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-600">
              Community
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}