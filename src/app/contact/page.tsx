"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0B0C10] px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
        <p className="mt-3 text-sm text-gray-400 sm:text-base">
          Have a question about an event, membership, or your account? We'd
          love to hear from you.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Email</p>
              <a
                href="mailto:thebenarasbeats@gmail.com"
                className="mt-1 block text-white font-medium hover:text-amber-400 transition"
              >
                thebenarasbeats@gmail.com
              </a>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Based In</p>
              <p className="mt-1 text-white font-medium">Varanasi, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          For refund requests, please see our{" "}
          <a href="/refund-policy" className="text-amber-400 underline hover:text-amber-300">
            Refund & Cancellation Policy
          </a>{" "}
          for the fastest resolution.
        </p>
      </div>
    </main>
  );
}