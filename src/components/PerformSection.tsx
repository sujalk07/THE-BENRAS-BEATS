"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic2, ArrowRight, Guitar, Mic } from "lucide-react";
import Link from "next/link";

import sticker from "@/assets/sticker.png";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PerformerSection() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [artistType, setArtistType] = useState<"singer" | "instrumentalist">("singer");

  const performerUrl = isLoggedIn
    ? `/performer/apply?type=${artistType}`
    : `/signup?redirectTo=${encodeURIComponent(`/performer/apply?type=${artistType}`)}`;

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050508] px-4 py-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[160px]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-[#0b0b14] via-[#090911] to-[#050508] shadow-[0_0_80px_rgba(168,85,247,0.12)]">
        <div className="relative min-h-[460px] flex items-center justify-between gap-10 px-6 py-16 md:px-20 md:py-24">
          <div className="relative z-20 w-full max-w-2xl text-left flex flex-col items-start">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-white via-gray-100 to-purple-300/80 bg-clip-text font-serif text-5xl font-medium leading-tight text-transparent md:text-6xl"
            >
              Want to
              <br />
              Perform?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              className="mt-4 max-w-md text-left text-base leading-6 text-purple-200/70 md:text-lg mix-blend-plus-lighting"
            >
              Are you a musician interested in performing at{" "}
              <span className="font-semibold text-amber-300 shadow-amber-500/10">
                The Benaras Beats
              </span>
              ? Showcase your talent, connect with audiences, and become part of
              our vibrant artist community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-6 flex flex-col items-start gap-3 w-full"
            >
              <Link
                href={performerUrl}
                className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-semibold text-black shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98] inline-flex items-center gap-3 text-base"
              >
                <Mic2 className="h-5 w-5" />
                <span>Apply as Artist</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Artist type selector */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => setArtistType("singer")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    artistType === "singer"
                      ? "bg-amber-500 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Mic size={13} />
                  Singer
                </button>
                <button
                  type="button"
                  onClick={() => setArtistType("instrumentalist")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    artistType === "instrumentalist"
                      ? "bg-amber-500 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Guitar size={13} />
                  Instrumentalist
                </button>
              </div>
            </motion.div>
          </div>

          <motion.img
            src={sticker.src}
            alt="Artist Illustration"
            animate={{
              y: [0, -10, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-2 top-1/2 z-10 h-[320px] w-[320px] select-none object-contain drop-shadow-[0_0_25px_rgba(255,160,60,0.16)] md:right-4 md:h-[420px] md:w-[420px] -translate-y-1/2"
          />
        </div>

        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
      </div>
    </section>
  );
}