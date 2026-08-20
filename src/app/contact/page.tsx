"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0A09] text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-violet-500/[0.07] blur-[150px]" />
        <div className="absolute right-[-150px] bottom-0 h-[500px] w-[500px] rounded-full bg-amber-500/[0.06] blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-8 md:py-10">

        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-gray-500 transition-colors hover:text-[#EDE6D9]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-all group-hover:border-[#C9A24B]/50 group-hover:bg-[#C9A24B]/[0.05]">
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />
            </span>

            Back
          </button>

          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-700">
            TBB / CONTACT
          </span>
        </div>

        {/* HERO */}
        <section className="relative py-20 md:py-28">

          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 font-serif text-[18rem] leading-none text-white/[0.015] lg:block">
            H
          </div>

          <div className="relative max-w-5xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
              Get in touch
            </span>

            <h1 className="mt-6 font-serif text-[18vw] leading-[0.72] tracking-[-0.06em] text-[#EDE6D9] sm:text-[8rem] md:text-[10rem]">
              HELLO
              <span className="text-[#C9A24B]">.</span>
            </h1>

            <div className="mt-12 grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-end">
              <p className="max-w-xl text-base leading-8 text-gray-400 md:text-lg">
                Have a question about an event, membership, your account,
                or simply want to connect with The Benaras Beats?
              </p>

              <p className="border-l border-[#B8923F]/40 pl-5 text-xs leading-6 text-gray-600">
                We believe meaningful communities begin with meaningful
                conversations.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT INFORMATION */}
        <section className="border-t border-white/[0.08]">

          {/* EMAIL */}
          <a
            href="mailto:thebenarasbeats@gmail.com"
            className="group grid gap-6 border-b border-white/[0.08] py-8 transition-all duration-500 md:grid-cols-[160px_1fr_auto] md:items-center md:py-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-violet-300">
                <Mail size={15} />
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Email
              </span>
            </div>

            <span className="break-all text-xl text-[#EDE6D9] transition-colors duration-300 group-hover:text-violet-300 md:text-2xl">
              thebenarasbeats@gmail.com
            </span>

            <ArrowUpRight
              className="hidden h-5 w-5 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-300 md:block"
            />
          </a>

          {/* PHONE */}
          <a
            href="tel:+919696384984"
            className="group grid gap-6 border-b border-white/[0.08] py-8 transition-all duration-500 md:grid-cols-[160px_1fr_auto] md:items-center md:py-10"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-300">
                <Phone size={15} />
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Phone
              </span>
            </div>

            <span className="text-xl text-[#EDE6D9] transition-colors duration-300 group-hover:text-cyan-300 md:text-2xl">
              +91 96963 84984
            </span>

            <ArrowUpRight
              className="hidden h-5 w-5 text-gray-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300 md:block"
            />
          </a>

          {/* LOCATION */}
          <div className="group grid gap-6 border-b border-white/[0.08] py-8 md:grid-cols-[160px_1fr_auto] md:items-start md:py-10">

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-300">
                <MapPin size={15} />
              </div>

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Location
              </span>
            </div>

            <p className="max-w-3xl text-base leading-7 text-gray-400 md:text-lg">
              HG COMPLEX, Chitaipur - Chunar Rd, near Petrol pump,
              Kanchanpur Petrol Pump, Gokul Nagar, DLW Colony, Chitaipur,
              Kanchanpur, Varanasi, Uttar Pradesh 221004
            </p>

            <MapPin className="hidden h-5 w-5 text-gray-700 md:block" />
          </div>
        </section>

        {/* COLOR STRIP */}
        <div className="mt-14 grid grid-cols-4 gap-1">
          <div className="h-1 bg-violet-400/60" />
          <div className="h-1 bg-cyan-400/60" />
          <div className="h-1 bg-[#C9A24B]/70" />
          <div className="h-1 bg-rose-400/50" />
        </div>

        {/* REFUND NOTE */}
        <section className="flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">

          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gray-600">
              Payment assistance
            </span>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
              For refund requests, please see our Refund & Cancellation
              Policy for the fastest resolution.
            </p>
          </div>

          <a
            href="/refund-policy"
            className="group inline-flex items-center gap-2 self-start border-b border-[#C9A24B]/40 pb-2 text-xs uppercase tracking-[0.16em] text-[#C9A24B] transition-colors hover:border-[#C9A24B]"
          >
            Refund Policy

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </section>

        {/* BOTTOM */}
        <div className="flex flex-col gap-3 border-t border-white/[0.06] py-6 text-[9px] uppercase tracking-[0.2em] text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <span>The Benaras Beats</span>

          <span>
            Music · Culture · Community
          </span>

          <span>Varanasi · India</span>
        </div>
      </div>
    </main>
  );
}