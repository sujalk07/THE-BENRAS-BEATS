"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mic2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import sticker from "@/assets/sticker.png";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PerformerSection() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const performerUrl = isLoggedIn
    ? "/performer/apply"
    : "/signup?redirectTo=/performer/apply";

  return (
    <section className="relative overflow-hidden bg-[#050508] py-12 px-6">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-purple-600/10 blur-[140px]" />
        <div className="absolute right-10 bottom-10 h-80 w-80 rounded-full bg-amber-500/10 blur-[160px]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-[180px]" />
      </div>

      {/* Main Card */}
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-purple-500/20 bg-gradient-to-br from-[#0b0b14] via-[#090911] to-[#050508] shadow-[0_0_80px_rgba(168,85,247,0.12)]">

        {/* Decorative Glow */}
        <div className="absolute inset-0">
          <div className="absolute left-20 top-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-amber-500/10 blur-[140px]" />
        </div>

        <div className="relative grid items-center gap-10 px-8 py-10 md:grid-cols-2 md:px-16 md:py-12">

          {/* LEFT SIDE */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs uppercase tracking-widest text-amber-300">
              <Sparkles className="h-4 w-4" />
              Artist Spotlight
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 text-5xl font-serif leading-tight text-white md:text-6xl"
            >
              Want To
              <br />
              Perform?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              viewport={{ once: true }}
              className="mt-6 max-w-lg text-lg leading-8 text-gray-400"
            >
              Are you an independent musician interested in performing at
              <span className="font-semibold text-white">
                {" "}
                The Benaras Beats
              </span>
              ? Showcase your music, connect with audiences, and become part of
              our growing artist community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              {/* Updated button classes to use your requested design */}
              <Link
                href={performerUrl}
                className="group inline-flex items-center gap-3 rounded-xl border border-purple-500/40 bg-black/40 backdrop-blur-sm px-8 py-3.5 font-medium text-white shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300 hover:border-purple-400 hover:bg-purple-950/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)] active:scale-[0.98]"
              >
                <Mic2 className="h-5 w-5" />

                <span>Apply as Artist</span>

                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Glow Behind Sticker */}
            <div className="absolute h-[420px] w-[420px] rounded-full bg-purple-500/15 blur-[120px]" />

            <img
              src={sticker.src}
              alt="Artist Illustration"
              className="
                relative
                z-10
                w-full
                max-w-[520px]
                md:max-w-[600px]
                lg:max-w-[680px]
                object-contain
                select-none
                pointer-events-none
                drop-shadow-[0_0_40px_rgba(255,160,60,0.35)]
              "
            />
          </motion.div>

        </div>

        {/* Bottom Border Glow */}
        <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      </div>
    </section>
  );
}