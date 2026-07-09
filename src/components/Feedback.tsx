"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, User } from "lucide-react";

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
          message,
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
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden border-t border-gray-900/40 bg-[#050508] px-6 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.16),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(180,83,9,0.08),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[120px]" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-amber-400">
            <MessageCircle className="h-3.5 w-3.5" />
            We&apos;d Love to Hear From You
          </div>
          <h2 className="text-4xl font-serif tracking-wide text-gray-100 md:text-6xl">
            Share Your Feedback
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gray-400 md:text-base">
            Whether you attended an event, joined as a member, or just want to
            say hello — we&apos;d love to know what you think.
          </p>
        </div>

        <div className="rounded-[2rem] border border-amber-500/15 bg-gradient-to-b from-[#0b0c10]/90 via-[#090a0e]/95 to-[#06070a] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-10">
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-8 md:p-10">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-8">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.3em] text-amber-400/80">
                    The Benaras Beats
                  </p>
                  <h3 className="text-3xl leading-tight font-serif text-white md:text-4xl">
                    Your voice helps shape our music, events, and membership experience.
                  </h3>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-400 md:text-base">
                    Share what you enjoyed, what could be better, or any ideas you want us to bring to life.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Response Type</p>
                    <p className="mt-2 font-medium text-white">General feedback</p>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Name</p>
                    <p className="mt-2 font-medium text-white">Optional</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/8 bg-[#0b0c10]/70 p-6 md:p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Thank you!</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    Your feedback means a lot to us.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-xs uppercase tracking-[0.2em] text-amber-400 transition hover:text-amber-300"
                  >
                    Share more feedback
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Your Name <span className="font-normal tracking-normal text-gray-600">(optional)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-gray-500" size={16} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Priya Sharma"
                        className="w-full rounded-xl border border-white/10 bg-[#0B0C10]/80 py-3 pl-12 pr-4 font-medium text-white placeholder-gray-600 transition-all focus:border-amber-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Your Feedback
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      maxLength={500}
                      placeholder="Tell us about your experience..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#0B0C10]/80 px-4 py-3 font-medium leading-relaxed text-white placeholder-gray-600 transition-all focus:border-amber-500/50 focus:outline-none"
                    />
                    <p className="mt-1 text-right text-[10px] text-gray-600">
                      {message.length}/500
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-sm font-bold tracking-wide text-black shadow-xl shadow-amber-500/10 transition-all duration-200 hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}