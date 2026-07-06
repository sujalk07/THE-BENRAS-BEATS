"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  HeartHandshake,
  Users,
  Landmark,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";

import bannerImg from "@/assets/banner.png";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const cards = [
  {
    icon: HeartHandshake,
    title: "Mental Wellness",
    description:
      "Music has always been medicine. Every gathering is designed to help people slow down, reconnect with themselves, and experience moments of peace.",
    border: "border-red-500/40",
    glow: "bg-red-500/20",
    iconBg: "from-red-500 via-rose-500 to-pink-500",
    titleColor: "text-red-300",
  },
  {
    icon: Users,
    title: "Genuine Connection",
    description:
      "Every performance creates opportunities for people to meet, connect, and build meaningful friendships through music.",
    border: "border-amber-500/40",
    glow: "bg-amber-500/20",
    iconBg: "from-yellow-400 via-amber-500 to-orange-500",
    titleColor: "text-amber-300",
  },
  {
    icon: Landmark,
    title: "Community Growth",
    description:
      "Supporting independent artists while preserving the rich musical heritage and cultural identity of Banaras.",
    border: "border-emerald-500/40",
    glow: "bg-emerald-500/20",
    iconBg: "from-emerald-400 via-green-500 to-teal-500",
    titleColor: "text-emerald-300",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090704] text-white">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-amber-500/10 blur-[180px]" />

        <div className="absolute right-[-180px] top-20 h-[650px] w-[650px] rounded-full bg-orange-500/10 blur-[180px]" />

        <div className="absolute bottom-[-150px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[200px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">

        {/* ================= BACK BUTTON ================= */}

        <button
          onClick={() => router.push("/")}
          className="group inline-flex items-center gap-3 rounded-full border border-amber-500/20 bg-black/20 px-6 py-3 backdrop-blur-xl transition-all duration-300 hover:border-amber-400 hover:bg-black/30"
        >
          <ArrowLeft
            size={18}
            className="transition group-hover:-translate-x-1"
          />

          <span className="text-sm uppercase tracking-[0.25em] text-amber-300">
            Back Home
          </span>
        </button>

        {/* ================= HEADING ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
          className="mx-auto mt-16 max-w-5xl text-center"
        >

          <h1
            className={`${playfair.className} text-5xl font-bold sm:text-6xl lg:text-7xl`}
          >

            About

            <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">

              The Benaras Beats

            </span>

          </h1>

          <p className="mx-auto mt-10 max-w-4xl text-lg leading-9 text-gray-300">

            Inspired by the timeless spirit of Banaras, The Benaras Beats is a
            community-driven musical initiative dedicated to celebrating local
            artists, meaningful performances and unforgettable cultural
            experiences.

          </p>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-slate-300">

            Our vision is to create evenings where music becomes a bridge
            between people, traditions and stories. Every performance is
            thoughtfully curated to bring warmth, belonging and a sense of
            togetherness while showcasing the rich artistic heritage of one of
            the world's oldest living cities.

          </p>

        </motion.div>

        {/* ================= IMAGE ================= */}

        <motion.div
          initial={{ opacity: 0, scale: .97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .8 }}
          className="relative mt-20 overflow-hidden rounded-[36px] border border-amber-500/20 shadow-[0_25px_80px_rgba(0,0,0,.45)]"
        >

          <img
            src={bannerImg.src}
            alt="Benaras"
            className="h-[700px] w-full object-cover"
          />

          {/* Blend */}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090704]/70 via-transparent to-black/30" />

          <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-[#090704] to-transparent" />

        </motion.div>
                {/* ================= MISSION ================= */}

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-28 max-w-6xl"
        >
          <div className="text-center">

            <h2
              className={`${playfair.className} text-4xl font-bold sm:text-5xl`}
            >
              Our Mission
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
              At The Benaras Beats, every event, every artist we support, and
              every experience we create is inspired by a single purpose—to
              bring people together through music while celebrating the rich
              cultural heritage of Banaras.
            </p>

          </div>

          {/* Cards */}

          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {cards.map((card, index) => {

              const Icon = card.icon;

              return (

                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}
                  className="group relative"
                >

                  {/* Glow */}

                  <div
                    className={`absolute -inset-3 rounded-[34px] ${card.glow} opacity-0 blur-3xl transition duration-500 group-hover:opacity-100`}
                  />

                  {/* Card */}

                  <div
                    className={`relative h-full overflow-hidden rounded-[32px] border ${card.border} bg-gradient-to-br
from-[#18181b]
via-[#111827]
to-[#0f172a] p-8 shadow-[0_25px_70px_rgba(0,0,0,.35)] transition-all duration-500 group-hover:border-amber-400/40`}
                  >

                    {/* Top Accent */}

                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400" />

                    {/* Icon */}

                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.iconBg} shadow-[0_0_35px_rgba(245,158,11,.35)]`}
                    >
                      <Icon
                        className="h-8 w-8 text-white"
                      />
                    </div>

                    {/* Title */}

                    <h3
  className={`mt-8 text-2xl font-bold ${card.titleColor}`}
>
  {card.title}
</h3>

                    {/* Divider */}

                    <div className="mt-5 h-1 w-20 rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400" />

                    {/* Description */}

                    <p className="mt-6 leading-8 text-slate-300">
                      {card.description}
                    </p>

                  </div>

                </motion.div>

              );

            })}

          </div>

        </motion.section>

        {/* Bottom spacing */}

        <div className="h-24" />

      </div>

    </main>
  );
}