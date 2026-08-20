"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic2,
  ArrowUpRight,
  Guitar,
  Mic,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import sticker from "@/assets/sticker.png";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PerformerSection() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [artistType, setArtistType] = useState<
    "singer" | "instrumentalist"
  >("singer");

  const performerUrl = isLoggedIn
    ? `/performer/apply?type=${artistType}`
    : `/signup?redirectTo=${encodeURIComponent(
        `/performer/apply?type=${artistType}`
      )}`;

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">

      {/* Background atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[15%] top-1/2 h-[450px] w-[450px] -translate-y-1/2 rounded-full bg-[#B8923F]/[0.035] blur-[140px]" />
        <div className="absolute bottom-0 right-[10%] h-[300px] w-[300px] rounded-full bg-[#7A2331]/[0.035] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">

        {/* Small section identity */}
        <div className="mb-10 flex items-center gap-4">
          <span className="h-px w-12 bg-[#B8923F]/70" />

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
            For Artists
          </span>

          <span className="font-mono text-[9px] tracking-[0.15em] text-gray-700">
            TBB / STAGE
          </span>
        </div>

        {/* Main artist poster */}
        <div className="relative overflow-hidden border border-white/[0.08] bg-[#11100E]">

          {/* Top metadata bar */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4 md:px-8">
            <span className="font-mono text-[9px] tracking-[0.2em] text-gray-600">
              THE BENARAS BEATS
            </span>

            <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#B8923F]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8923F]" />
              Open Call
            </span>
          </div>

          <div className="grid min-h-[520px] lg:grid-cols-[1fr_0.8fr]">

            {/* LEFT — Copy */}
            <div className="relative z-20 flex flex-col justify-center px-7 py-14 md:px-12 lg:px-16">

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="mb-5 block font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
                  The stage is waiting.
                </span>

                <h2 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-wide text-[#EDE6D9] md:text-6xl lg:text-7xl">
                  Bring your
                  <br />
                  <span className="italic text-[#C9A24B]">
                    sound.
                  </span>
                </h2>

                <p className="mt-7 max-w-lg text-sm leading-7 text-gray-400 md:text-base">
                  Are you a singer or instrumentalist looking for a space
                  to perform? Bring your music to The Benaras Beats and
                  become part of a growing community of artists and
                  listeners.
                </p>
              </motion.div>

              {/* Artist type selector */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-9"
              >
                <span className="mb-3 block text-[9px] uppercase tracking-[0.2em] text-gray-600">
                  I perform as a
                </span>

                <div className="inline-flex border border-white/[0.08] bg-[#0D0C0A] p-1">
                  <button
                    type="button"
                    onClick={() => setArtistType("singer")}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium transition-all duration-300 ${
                      artistType === "singer"
                        ? "bg-[#C9A24B] text-[#0A0908]"
                        : "text-gray-500 hover:text-gray-200"
                    }`}
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Singer
                  </button>

                  <button
                    type="button"
                    onClick={() => setArtistType("instrumentalist")}
                    className={`flex items-center gap-2 px-5 py-2.5 text-xs font-medium transition-all duration-300 ${
                      artistType === "instrumentalist"
                        ? "bg-[#C9A24B] text-[#0A0908]"
                        : "text-gray-500 hover:text-gray-200"
                    }`}
                  >
                    <Guitar className="h-3.5 w-3.5" />
                    Instrumentalist
                  </button>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                viewport={{ once: true }}
                className="mt-7"
              >
                <Link
                  href={performerUrl}
                  className="group inline-flex items-center gap-3 border-b border-[#B8923F]/60 pb-2 text-sm font-semibold text-[#EDE6D9] transition-colors duration-300 hover:border-[#C9A24B] hover:text-[#C9A24B]"
                >
                  <Mic2 className="h-4 w-4 text-[#B8923F]" />

                  <span>Apply to perform</span>

                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>

            {/* RIGHT — Artist visual */}
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-t border-white/[0.07] bg-[#0D0C0A] lg:border-l lg:border-t-0">

              {/* Decorative rings */}
              <div className="absolute h-[360px] w-[360px] rounded-full border border-white/[0.04]" />
              <div className="absolute h-[260px] w-[260px] rounded-full border border-[#B8923F]/[0.08]" />

              {/* Vertical typography */}
              <span className="absolute bottom-8 right-6 font-serif text-[10px] uppercase tracking-[0.35em] text-gray-700 [writing-mode:vertical-rl]">
                MUSIC · MIND · SOUL
              </span>

              {/* Illustration */}
              <motion.img
                src={sticker.src}
                alt="Artist illustration"
                animate={{
                  y: [0, -10, 0],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 h-[300px] w-[300px] select-none object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] md:h-[380px] md:w-[380px]"
              />

              {/* Decorative label */}
              <div className="absolute left-6 top-6 flex items-center gap-2 border border-white/[0.08] bg-[#11100E] px-3 py-2">
                <Sparkles className="h-3 w-3 text-[#B8923F]" />

                <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-gray-500">
                  Your stage
                </span>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              Sing · Play · Perform
            </span>

            <span className="text-xs text-gray-600">
              Tell us what you bring to the stage.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}