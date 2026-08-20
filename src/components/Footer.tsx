"use client";

import React from "react";
import { ArrowUpRight, Music4 } from "lucide-react";
import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa6";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Refunds", href: "/refund-policy" },
    { label: "Delivery", href: "/delivery-policy" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0A0908] text-white">

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-[-220px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#B8923F]/[0.035] blur-[140px]" />

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#B8923F]/30 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">

        {/* MASSIVE CLOSING STATEMENT */}
        <div className="relative border-b border-white/[0.07] py-20 md:py-28">

          {/* Small identity */}
          <div className="mb-10 flex items-center gap-4">
            <Music4 className="h-4 w-4 text-[#B8923F]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-600">
              The Benaras Beats
            </span>
          </div>

          <h2 className="max-w-6xl font-serif text-[15vw] leading-[0.78] tracking-[-0.04em] text-[#EDE6D9] md:text-[9rem]">
            Keep the
            <br />
            <span className="italic text-[#C9A24B]">
              music alive.
            </span>
          </h2>

          {/* Bottom part of hero footer */}
          <div className="mt-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <p className="max-w-md text-sm leading-7 text-gray-500">
              A community built around music, culture, artists, and the
              timeless spirit of Benaras.
            </p>

            <a
              href="#top"
              className="group inline-flex items-center gap-3 self-start border-b border-[#B8923F]/40 pb-2 text-xs uppercase tracking-[0.18em] text-gray-400 transition-colors hover:border-[#C9A24B] hover:text-[#C9A24B]"
            >
              Back to top

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        {/* LOWER FOOTER */}
        <div className="grid gap-10 border-b border-white/[0.07] py-10 md:grid-cols-[1fr_auto] md:items-start">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-[#B8923F]/25 bg-[#B8923F]/[0.05]">
                <Music4 className="h-4 w-4 text-[#B8923F]" />
              </div>

              <div>
                <span className="block font-serif text-lg text-[#EDE6D9]">
                  The Benaras Beats
                </span>

                <span className="block text-[8px] uppercase tracking-[0.2em] text-gray-600">
                  Music for Mind & Soul
                </span>
              </div>
            </div>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/thebenarasbeats?igsh=MXZzMjRldHFzbzFqdQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-600 transition-colors hover:text-[#C9A24B]"
            >
              <FaInstagram className="h-4 w-4" />
            </a>

            <a
              href="https://www.facebook.com/share/18cWLBSfN2/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-gray-600 transition-colors hover:text-[#C9A24B]"
            >
              <FaFacebook className="h-4 w-4" />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="text-gray-600 transition-colors hover:text-[#C9A24B]"
            >
              <FaYoutube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col gap-7 border-b border-white/[0.07] py-8 md:flex-row md:items-center md:justify-between">

          <nav className="flex flex-wrap gap-x-7 gap-y-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-[#EDE6D9]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.15em] text-gray-700">
            <span>Varanasi</span>
            <span className="h-1 w-1 rounded-full bg-[#B8923F]/50" />
            <span>India</span>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="flex flex-col gap-3 py-6 text-[9px] uppercase tracking-[0.15em] text-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {currentYear} The Benaras Beats
          </span>

          <span>
            Music · Culture · Community
          </span>

          <span>
            All rights reserved
          </span>
        </div>
      </div>
    </footer>
  );
}