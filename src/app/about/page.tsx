"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
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

const changingMindsPoints = [
  {
    icon: GraduationCap,
    text: "Led by Dr. Laxman Ji Yadav, PhD from IMS BHU, with 8+ years of experience in psychotherapy and counseling.",
  },
  {
    icon: BrainCircuit,
    text: "Evidence-based treatment for anxiety, depression, stress, and relationship concerns using CBT, psychodynamic, and mindfulness-based approaches.",
  },
  {
    icon: ShieldCheck,
    text: "A safe, confidential, non-judgmental space, with over fifty thousand counseling sessions completed to date.",
  },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090704] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[650px] w-[650px] rounded-full bg-amber-500/10 blur-[180px]" />
        <div className="absolute right-[-180px] top-20 h-[650px] w-[650px] rounded-full bg-orange-500/10 blur-[180px]" />
        <div className="absolute bottom-[-150px] left-1/2 h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[200px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <button
          onClick={() => router.push("/")}
          className="group inline-flex items-center gap-3 rounded-full border border-amber-500/20 bg-black/20 px-6 py-3 backdrop-blur-xl transition-all duration-300 hover:border-amber-400 hover:bg-black/30"
        >
          <ArrowLeft size={18} className="transition group-hover:-translate-x-1" />
          <span className="text-sm uppercase tracking-[0.25em] text-amber-300">
            Back Home
          </span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mt-16 max-w-5xl text-center"
        >
          <h1 className={`${playfair.className} text-5xl font-bold sm:text-6xl lg:text-7xl`}>
            About
            <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              The Benaras Beats
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-4xl text-lg leading-9 text-gray-300">
            Inspired by the timeless spirit of Banaras, The Benaras Beats is a community-driven musical 
            initiative dedicated to celebrating local artists, meaningful performances and unforgettable cultural experiences.
          </p>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-slate-300">
            Our vision is to create evenings where music becomes a bridge between people, traditions and stories. Every performance is
             thoughtfully curated to bring warmth, belonging and a sense of togetherness while showcasing the rich artistic heritage
             of one of the world's oldest living cities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative mt-20 overflow-hidden rounded-[36px] border border-amber-500/20 shadow-[0_25px_80px_rgba(0,0,0,.45)]"
        >
          <Image
            src={bannerImg}
            alt="Benaras"
            className="h-[700px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090704]/70 via-transparent to-black/30" />
          <div className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-[#090704] to-transparent" />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-28 max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-[36px] border border-amber-500/20 bg-gradient-to-br from-[#18181b] via-[#111827] to-[#0f172a] p-8 shadow-[0_25px_70px_rgba(0,0,0,.35)] sm:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/10 blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-5 lg:gap-12">
              <div className="lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80">
                  A Child Initiative Of
                </p>
                <h2 className={`${cormorant.className} mt-3 text-3xl font-bold text-white sm:text-4xl`}>
                  Changing Minds Mental Health Care
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                  The Benaras Beats is proudly rooted in{" "}
                  <span className="font-medium text-white">
                    Changing Minds Counseling & Psychotherapy Centre
                  </span>
                  , a trusted mental health center based in Varanasi, dedicated to helping people lead fulfilling, emotionally healthier lives-the very same mission that inspired this musical community.
                </p>

                <a
                  href="https://changingminds.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-300 transition hover:border-amber-400/50 hover:bg-amber-500/20"
                >
                  Visit changingminds.in
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="lg:col-span-3">
                <div className="space-y-5">
                  {changingMindsPoints.map((point, idx) => {
                    const Icon = point.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                          <Icon size={18} />
                        </div>
                        <p className="text-sm leading-relaxed text-slate-300">
                          {point.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <p className="mt-6 text-sm leading-relaxed text-slate-400">
                  Changing Minds believes that mental health is central to overall well-being. Its team offers personalized, evidence-based care in a confidential, judgment-free space and it's this same belief, that healing extends beyond the walls of a clinic, that gave rise to The Benaras Beats: bringing that same spirit of care into music, culture, and community.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="mx-auto mt-28 max-w-6xl px-4"
>
  <div className="text-center">
    <h2 className={`${playfair.className} text-4xl font-bold sm:text-5xl`}>
      Our Mission
    </h2>
    <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
      At The Benaras Beats, every event, every artist we support, and every experience we create is inspired by a single purpose to bring people together through music while celebrating the rich cultural heritage of Banaras.
    </p>
  </div>

  <div className="mt-16 grid gap-8 md:grid-cols-3">
    {cards.map((card, index) => {
      const Icon = card.icon;
      return (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: index * 0.12 }}
          whileHover={{ y: -6 }}
          className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-all duration-300 hover:border-amber-400/30 hover:bg-white/[0.035]"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-amber-400 ring-1 ring-white/10 transition group-hover:bg-amber-500/10 group-hover:ring-amber-400/20">
              <Icon className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <h3 className={`text-xl font-semibold ${card.titleColor}`}>
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>
</motion.section>

        <div className="h-24" />
      </div>
    </main>
  );
}