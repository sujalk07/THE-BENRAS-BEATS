"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, User, Sparkles } from "lucide-react";

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
    <section className="relative overflow-hidden border-t border-amber-500/10 bg-[#040405] px-6 py-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(160,120,20,0.10),_transparent_28%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            We&apos;d Love to Hear From You
          </div>
          <h2 className="text-4xl font-serif tracking-[0.06em] text-stone-100 md:text-6xl">
            Share Your Feedback
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-400 md:text-base">
            Whether you attended an event, joined as a member, or simply want to say hello,
            your thoughts help shape a more meaningful experience.
          </p>
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-amber-400/15 bg-gradient-to-b from-[#0b0b0f]/95 via-[#09090d]/98 to-[#060607] p-6 shadow-[0_35px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl md:p-8">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Thank you!</h3>
              <p className="mt-2 text-sm text-stone-400">
                Your feedback has been received successfully.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs uppercase tracking-[0.22em] text-amber-300 transition hover:text-amber-200"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.32em] text-amber-300/80">
                  The Benaras Beats
                </p>
                <h3 className="mt-3 text-2xl font-serif text-stone-50 md:text-3xl">
                  Your voice helps shape our music, events, and membership experience.
                </h3>
                <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-stone-400 md:text-base">
                  Share what you enjoyed, what could be better, or any ideas you want us to bring to life.
                </p>
              </div>

              <div className="rounded-[1.4rem] border border-amber-400/10 bg-white/[0.02] p-5 md:p-6">
                <div className="grid gap-5">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Your Name <span className="font-normal tracking-normal text-stone-600">(optional)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-stone-500" size={16} />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Priya Sharma"
                        className="w-full rounded-xl border border-white/10 bg-[#0b0b0f] py-3 pl-12 pr-4 font-medium text-white placeholder:text-stone-600 transition-all duration-200 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Your Feedback
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      maxLength={500}
                      placeholder="Tell us about your experience..."
                      className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0b0f] px-4 py-3 font-medium leading-relaxed text-white placeholder:text-stone-600 transition-all duration-200 focus:border-amber-400/50 focus:outline-none focus:ring-1 focus:ring-amber-400/20"
                    />
                    <p className="mt-1 text-right text-[10px] text-stone-600">
                      {message.length}/500
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300/20 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 py-3.5 text-sm font-bold tracking-wide text-black shadow-[0_12px_30px_rgba(212,175,55,0.18)] transition-all duration-200 hover:from-amber-300 hover:via-yellow-400 hover:to-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}