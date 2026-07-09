"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2, User } from "lucide-react";

export default function Feedback() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim()) {
      alert("Please fill in your name and feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
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
    <section className="relative px-6 py-24 bg-[#050508] text-white overflow-hidden border-t border-gray-900/40">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs tracking-wider uppercase mb-6 font-medium">
            <MessageCircle className="w-3.5 h-3.5" />
            We'd Love to Hear From You
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-gray-100">
            Share Your Feedback
          </h2>
          <p className="mt-4 text-sm md:text-base text-gray-400 max-w-md mx-auto">
            Whether you attended an event, joined as a member, or just want to
            say hello — we'd love to know what you think.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-800/80 bg-gradient-to-b from-[#0b0c10]/80 to-[#07080b]/90 p-8 backdrop-blur-md shadow-2xl">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <MessageCircle size={22} />
              </div>
              <h3 className="text-lg font-bold text-white">Thank you!</h3>
              <p className="mt-2 text-sm text-gray-400">
                Your feedback means a lot to us.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-xs text-amber-400 hover:text-amber-300 transition"
              >
                Share more feedback
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-500" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Priya Sharma"
                    className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium leading-relaxed resize-none"
                />
                <p className="mt-1 text-right text-[10px] text-gray-600">
                  {message.length}/500
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-xl shadow-amber-500/10"
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
    </section>
  );
}