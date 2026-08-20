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
      alt: "Bhairavi - A Unit of S.B Rajasthan Marbles",
    },
    {
      image: sponsorPhoto2,
      name: "CHETMANI",
      subtitle: "Ornaments & Jewellers Pvt. Ltd.",
      alt: "Chetmani Ornaments & Jewellers Pvt. Ltd.",
    },
    {
      image: sponsorPhoto3,
      name: "RADIO CITY",
      subtitle: "A Jagran Initiative",
      alt: "Radio City - A Jagran Initiative",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B8923F]/[0.025] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#B8923F]/60" />

            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
              <Handshake className="h-3.5 w-3.5" />
              In Partnership
            </span>

            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#B8923F]/60" />
          </div>

          <h2 className="font-serif text-4xl tracking-wide text-[#EDE6D9] md:text-5xl">
            The people behind the movement.
          </h2>

          <p className="mt-6 max-w-xl text-sm leading-7 text-gray-400 md:text-base">
            Our partners help us create spaces where music, culture, and
            community can come together.
          </p>
        </div>

        {/* Sponsor wall */}
        <div className="grid border border-white/[0.08] bg-[#11100E] md:grid-cols-3">

          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.name}
              className={`group relative flex min-h-[390px] flex-col ${
                index !== sponsors.length - 1
                  ? "border-b border-white/[0.08] md:border-b-0 md:border-r"
                  : ""
              }`}
            >

              {/* Sponsor number */}
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                <span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">
                  PARTNER / 0{index + 1}
                </span>

                <ArrowUpRight
                  className="h-4 w-4 text-gray-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#B8923F]"
                />
              </div>

              {/* Image */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#F5F3EE] p-6">
                <Image
                  src={sponsor.image}
                  alt={sponsor.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`transition-transform duration-700 group-hover:scale-[1.03] ${
                    index === 0
                      ? "object-cover"
                      : "object-contain p-8"
                  }`}
                />

                {/* Image overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Sponsor details */}
              <div className="border-t border-white/[0.07] bg-[#11100E] px-6 py-5">
                <h3 className="font-serif text-xl tracking-wide text-[#EDE6D9] transition-colors duration-300 group-hover:text-[#C9A24B]">
                  {sponsor.name}
                </h3>

                <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#B8923F]">
                  {sponsor.subtitle}
                </p>
              </div>

              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 group-hover:w-full" />
            </div>
          ))}
        </div>

        {/* Partnership footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:text-left">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
            Music · Culture · Community
          </span>

          <p className="max-w-md text-xs leading-5 text-gray-600">
            Interested in becoming part of the Benaras Beats journey?
            Partnership opportunities will be announced soon.
          </p>
        </div>
      </div>
    </section>
  );
}