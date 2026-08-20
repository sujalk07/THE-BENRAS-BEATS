"use client";

import Image from "next/image";
import { ArrowUpRight, Quote } from "lucide-react";

import founderImg from "../assets/founder.png";

export default function Founder() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">
      {/* Subtle atmosphere */}
      <div className="pointer-events-none absolute right-[-120px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#B8923F]/[0.035] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">

        {/* Section label */}
        <div className="mb-12 flex items-center gap-4">
          <span className="h-px w-12 bg-[#B8923F]/70" />

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
            The Person Behind The Beats
          </span>

          <span className="font-mono text-[9px] tracking-[0.15em] text-gray-700">
            TBB / FOUNDER
          </span>
        </div>

        {/* Main editorial layout */}
        <div className="grid overflow-hidden border border-white/[0.08] bg-[#11100E] lg:grid-cols-[0.8fr_1.2fr]">

          {/* Portrait */}
          <div className="relative min-h-[520px] overflow-hidden bg-[#0D0C0A]">

            <Image
              src={founderImg}
              alt="Dr. Laxman Yadav — Founder, The Benaras Beats"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top grayscale-[15%] transition-all duration-700 hover:scale-[1.02] hover:grayscale-0"
              priority
            />

            {/* Image gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent" />

            {/* Image metadata */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.08] bg-[#0A0908]/80 px-6 py-5 backdrop-blur-sm">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-serif text-xl tracking-wide text-[#EDE6D9]">
                    Dr. Laxman Yadav
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">
                    Founder · The Benaras Beats
                  </p>
                </div>

                <span className="font-mono text-[9px] tracking-[0.15em] text-[#B8923F]">
                  EST. / TBB
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">

            {/* Top */}
            <div>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                  About the founder
                </span>

                <ArrowUpRight className="h-4 w-4 text-gray-700" />
              </div>

              <h2 className="max-w-2xl font-serif text-4xl leading-[1.05] tracking-wide text-[#EDE6D9] md:text-5xl">
                Where wellbeing
                <br />
                meets
                <span className="italic text-[#C9A24B]"> music.</span>
              </h2>

              <div className="mt-8 h-px w-full bg-gradient-to-r from-[#B8923F]/40 via-white/[0.08] to-transparent" />

              {/* Credentials */}
              <div className="mt-8 space-y-4">
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Profession
                  </span>

                  <p className="mt-1 text-sm leading-6 text-gray-300">
                    Consultant Counseling Psychologist, IIT (BHU)
                  </p>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Founder
                  </span>

                  <p className="mt-1 text-sm leading-6 text-gray-300">
                    Changing Minds Mental Health Care
                  </p>
                </div>

                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-gray-600">
                    Community
                  </span>

                  <p className="mt-1 text-sm leading-6 text-gray-300">
                    Founding Member, Indian Academy of Mental Health (IAMH)
                    <span className="mx-2 text-gray-700">·</span>
                    The Benaras Beats Music Club
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="mt-9 border-l border-[#B8923F]/40 pl-5">
                <p className="text-sm leading-7 text-gray-400">
                  With over 10 years of experience and having supported the
                  emotional well-being of{" "}
                  <span className="text-[#D9CBA0]">
                    50,000+ individuals
                  </span>
                  , he focuses on making wellness accessible through science,
                  culture, and community.
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="relative mt-12 border-t border-white/[0.08] pt-8">
              <Quote className="absolute -top-3 left-0 h-6 w-6 fill-[#B8923F]/10 text-[#B8923F]/40" />

              <p className="max-w-xl pl-1 font-serif text-xl italic leading-relaxed text-[#D9CBA0] md:text-2xl">
                “Music has the power to heal, unite, and transform lives.”
              </p>

              <div className="mt-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#B8923F]/50" />

                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">
                  The philosophy behind the club
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mt-7 flex flex-col gap-2 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
            Music · Mind · Community
          </span>

          <span className="text-xs text-gray-600">
            Building spaces where people can connect through music.
          </span>
        </div>
      </div>
    </section>
  );
}