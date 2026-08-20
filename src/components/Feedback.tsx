"use client";

import { useState } from "react";
import {
  MessageCircle,
  Send,
  Loader2,
  User,
  ArrowUpRight,
} from "lucide-react";

export default function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      alert("Please fill in your feedback.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to submit feedback.");
        return;
      }

      setSubmitted(true);
      setName("");
      setMessage("");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#0A0908] px-6 py-24 text-white">
      {/* Subtle atmosphere */}
      <div className="pointer-events-none absolute right-[-180px] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#B8923F]/[0.035] blur-[140px]" />

      <div className="relative mx-auto max-w-6xl">

        {/* Section label */}
        <div className="mb-12 flex items-center gap-4">
          <span className="h-px w-12 bg-[#B8923F]/70" />

          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8923F]">
            Your Voice
          </span>

          <span className="font-mono text-[9px] tracking-[0.15em] text-gray-700">
            TBB / FEEDBACK
          </span>
        </div>

        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

          {/* LEFT — Editorial message */}
          <div className="flex flex-col justify-between">

            <div>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                After the music
              </span>

              <h2 className="mt-5 font-serif text-5xl leading-[1.02] tracking-wide text-[#EDE6D9] md:text-6xl">
                Tell us what
                <br />
                <span className="italic text-[#C9A24B]">
                  stayed with you.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm leading-7 text-gray-400 md:text-base">
                Every event leaves something behind — a song, a conversation,
                a feeling, an idea. Tell us about yours.
              </p>
            </div>

            {/* Small editorial note */}
            <div className="mt-14 border-l border-[#B8923F]/40 pl-5">
              <p className="font-serif text-xl italic leading-relaxed text-[#D9CBA0]">
                “The best gatherings continue long after the music stops.”
              </p>

              <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-gray-600">
                The Benaras Beats
              </p>
            </div>
          </div>

          {/* RIGHT — Feedback form */}
          <div className="relative border border-white/[0.08] bg-[#11100E]">

            {/* Form header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Guestbook / 01
              </span>

              <MessageCircle className="h-4 w-4 text-[#B8923F]" />
            </div>

            {submitted ? (
              <div className="flex min-h-[430px] flex-col items-center justify-center px-7 py-12 text-center">

                <div className="mb-6 flex h-14 w-14 items-center justify-center border border-[#B8923F]/30 bg-[#B8923F]/[0.06]">
                  <MessageCircle className="h-6 w-6 text-[#C9A24B]" />
                </div>

                <h3 className="font-serif text-3xl text-[#EDE6D9]">
                  Thank you.
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  Your thoughts have been added to our story.
                </p>

                <button
                  onClick={() => setSubmitted(false)}
                  className="group mt-8 inline-flex items-center gap-2 border-b border-[#B8923F]/50 pb-1 text-xs uppercase tracking-[0.15em] text-[#C9A24B] transition-colors hover:border-[#C9A24B]"
                >
                  Share another thought

                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
              </div>
            ) : (
              <div className="p-7 md:p-9">

                <div className="mb-8">
                  <h3 className="font-serif text-2xl text-[#EDE6D9]">
                    Leave a note.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Tell us what you enjoyed, what could be better, or what
                    you'd love to experience next.
                  </p>
                </div>

                <div className="space-y-7">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-gray-600">
                      Your name
                      <span className="ml-2 normal-case tracking-normal text-gray-700">
                        optional
                      </span>
                    </label>

                    <div className="relative">
                      <User className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border-b border-white/[0.1] bg-transparent py-3 pl-7 pr-2 text-sm text-[#EDE6D9] outline-none transition-colors placeholder:text-gray-700 focus:border-[#B8923F]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-600">
                        Your feedback
                      </label>

                      <span className="font-mono text-[9px] text-gray-700">
                        {message.length}/500
                      </span>
                    </div>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      maxLength={500}
                      placeholder="What did you take away from your experience?"
                      className="w-full resize-none border-b border-white/[0.1] bg-transparent px-0 py-3 text-sm leading-7 text-[#EDE6D9] outline-none transition-colors placeholder:text-gray-700 focus:border-[#B8923F]"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="group flex w-full items-center justify-between border border-[#B8923F]/30 bg-[#B8923F]/[0.06] px-5 py-4 text-sm font-medium text-[#EDE6D9] transition-all duration-300 hover:border-[#B8923F]/70 hover:bg-[#B8923F]/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>
                      {submitting ? "Sending..." : "Share your feedback"}
                    </span>

                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#B8923F]" />
                    ) : (
                      <Send className="h-4 w-4 text-[#B8923F] transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 h-px w-0 bg-[#B8923F] transition-all duration-500 hover:w-full" />
          </div>
        </div>

        {/* Footer metadata */}
        <div className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-600">
            Music · Mind · Community
          </span>

          <span className="text-xs text-gray-600">
            Your feedback helps shape what comes next.
          </span>
        </div>
      </div>
    </section>
  );
}