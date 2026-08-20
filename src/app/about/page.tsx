"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  HeartHandshake,
  Users,
  Landmark,
  GraduationCap,
  ShieldCheck,
  BrainCircuit,
  ExternalLink,
} from "lucide-react";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import Image from "next/image";

import bannerImg from "@/assets/banner.png";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const cards = [
  {
    icon: HeartHandshake,
    number: "01",
    title: "Mental Wellness",
    description:
      "Music has always been medicine. Every gathering is designed to help people slow down, reconnect with themselves, and experience moments of peace.",
  },
  {
    icon: Users,
    number: "02",
    title: "Genuine Connection",
    description:
      "Every performance creates opportunities for people to meet, connect, and build meaningful friendships through music.",
  },
  {
    icon: Landmark,
    number: "03",
    title: "Community Growth",
    description:
      "Supporting independent artists while preserving the rich musical heritage and cultural identity of Banaras.",
  },
];

const changingMindsPoints = [
  {
    icon: GraduationCap,
    number: "01",
    title: "Experience",
    text: "Led by Dr. Laxman Ji Yadav, PhD from IMS BHU, with 8+ years of experience in psychotherapy and counseling.",
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "Evidence-based care",
    text: "Evidence-based treatment for anxiety, depression, stress, and relationship concerns using CBT, psychodynamic, and mindfulness-based approaches.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "A safe space",
    text: "A safe, confidential, non-judgmental space, with over fifty thousand counseling sessions completed to date.",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#0A0908] text-white">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <button
          onClick={() => router.push("/")}
          className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-gray-500 transition-colors hover:text-[#C9A24B]"
        >
          <ArrowLeft
            size={15}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          Back home
        </button>
      </div>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid items-end gap-10 lg:grid-cols-[1fr_0.55fr]"
        >
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[#B8923F]/70" />

              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B8923F]">
                Our Story
              </span>
            </div>

            <h1
              className={`${playfair.className} text-5xl font-semibold leading-[0.95] tracking-tight text-[#EDE6D9] sm:text-6xl md:text-7xl`}
            >
              About
              <br />

              <span className={`${cormorant.className} italic text-[#C9A24B]`}>
                The Benaras Beats
              </span>
            </h1>
          </div>

          <div className="border-l border-white/[0.08] pl-6 lg:pb-2">
            <p className="text-sm leading-7 text-gray-400 md:text-base">
              A community-driven musical initiative inspired by the timeless
              spirit of Banaras.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
              <span>Music</span>
              <span className="text-[#B8923F]">·</span>
              <span>Culture</span>
              <span className="text-[#B8923F]">·</span>
              <span>Community</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}
      <section className="border-y border-white/[0.06]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:gap-20 md:py-20">

          <p className="font-serif text-2xl leading-relaxed text-[#D9CBA0] md:text-3xl">
            Inspired by the timeless spirit of Banaras, The Benaras Beats is
            a community-driven musical initiative dedicated to celebrating
            local artists, meaningful performances, and unforgettable cultural
            experiences.
          </p>

          <p className="text-sm leading-7 text-gray-500 md:pt-2 md:text-base">
            Our vision is to create evenings where music becomes a bridge
            between people, traditions, and stories. Every performance is
            thoughtfully curated to bring warmth, belonging, and a sense of
            togetherness while showcasing the rich artistic heritage of one
            of the world's oldest living cities.
          </p>
        </div>
      </section>

      {/* =========================================================
          BANARAS IMAGE
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden"
        >
          <Image
            src={bannerImg}
            alt="Benaras"
            className="h-[520px] w-full object-cover md:h-[680px]"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-black/10" />

          {/* Image caption */}
          <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between md:bottom-10 md:left-10 md:right-10">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#C9A24B]">
                Banaras
              </span>

              <p
                className={`${cormorant.className} mt-2 text-2xl italic text-[#EDE6D9] md:text-3xl`}
              >
                A city that has always had its own rhythm.
              </p>
            </div>

            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-white/40 md:block">
              THE BENARAS BEATS / 01
            </span>
          </div>
        </motion.div>
      </section>

      {/* =========================================================
          CHANGING MINDS
      ========================================================= */}
      <section className="border-y border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">

          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">

            {/* Left */}
            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#B8923F]">
                Our Foundation
              </span>

              <h2
                className={`${cormorant.className} mt-4 text-4xl font-semibold leading-tight text-[#EDE6D9] md:text-5xl`}
              >
                A child initiative of
                <br />
                <span className="italic text-[#C9A24B]">
                  Changing Minds.
                </span>
              </h2>

              <p className="mt-7 text-sm leading-7 text-gray-500">
                The Benaras Beats is proudly rooted in Changing Minds
                Counseling & Psychotherapy Centre — a trusted mental health
                center based in Varanasi.
              </p>

              <a
                href="https://changingminds.in"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 border-b border-[#B8923F]/50 pb-2 text-xs uppercase tracking-[0.15em] text-gray-400 transition-colors hover:border-[#C9A24B] hover:text-[#C9A24B]"
              >
                Visit changingminds.in

                <ExternalLink
                  size={13}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>

            {/* Right */}
            <div>
              <div className="border-t border-white/[0.08]">
                {changingMindsPoints.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.number}
                      className="group flex gap-6 border-b border-white/[0.08] py-7"
                    >
                      <div className="flex w-8 shrink-0 flex-col items-center">
                        <span className="font-mono text-[9px] text-gray-700">
                          {point.number}
                        </span>

                        <div className="mt-5">
                          <Icon className="h-5 w-5 text-[#B8923F]" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl text-[#EDE6D9] transition-colors group-hover:text-[#C9A24B]">
                          {point.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {point.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-8 text-sm leading-7 text-gray-500">
                Changing Minds believes that mental health is central to
                overall well-being. Its team offers personalized,
                evidence-based care in a confidential, judgment-free space.
                This same belief — that healing extends beyond the walls of a
                clinic — gave rise to The Benaras Beats: bringing that spirit
                of care into music, culture, and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MISSION
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">

        <div className="mb-14 max-w-3xl">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[#B8923F]/70" />

            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#B8923F]">
              What We Believe
            </span>
          </div>

          <h2
            className={`${playfair.className} text-4xl font-semibold text-[#EDE6D9] md:text-5xl`}
          >
            Our Mission
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-gray-500 md:text-base">
            At The Benaras Beats, every event, every artist we support, and
            every experience we create is inspired by a single purpose:
            bringing people together through music while celebrating the rich
            cultural heritage of Banaras.
          </p>
        </div>

        {/* Mission principles */}
        <div className="border-t border-white/[0.08]">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="group grid gap-6 border-b border-white/[0.08] py-8 md:grid-cols-[80px_280px_1fr] md:items-center"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-gray-700">
                  {card.number}
                </span>

                <div className="flex items-center gap-4">
                  <Icon className="h-5 w-5 text-[#B8923F] transition-transform duration-300 group-hover:-translate-y-1" />

                  <h3
                    className={`${cormorant.className} text-2xl font-semibold text-[#EDE6D9] transition-colors group-hover:text-[#C9A24B]`}
                  >
                    {card.title}
                  </h3>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-gray-500">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bottom spacing */}
      <div className="h-16" />
    </main>
  );
}