"use client";

import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Music, Link as LinkIcon, Disc, User, Phone, Mail, Mic, Guitar, ArrowLeft } from "lucide-react";

function PerformerApplyForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType = searchParams.get("type") === "instrumentalist" ? "instrumentalist" : "singer";

  const [loading, setLoading] = useState(false);
  const [artistType, setArtistType] = useState<"singer" | "instrumentalist">(initialType);
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    bio: "",
    socialLink: "",
    sampleTrackUrl: "",
    contactNumber: "",
    email: "",
  });

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam === "instrumentalist" || typeParam === "singer") {
      setArtistType(typeParam);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to submit your performer application.");
      router.push(`/login?redirect=/performer/apply`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/performer-requests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          artistType,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      alert("🎉 " + data.message);
      setFormData({
        artistName: "",
        genre: "",
        bio: "",
        socialLink: "",
        sampleTrackUrl: "",
        contactNumber: "",
        email: "",
      });
      router.push("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] py-16 px-4 selection:bg-amber-500 selection:text-black">
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-white/10 hover:text-amber-300"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Perform at <span className="text-amber-500">Benaras Beats</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            Are you a musician, DJ, or live performer? Drop your profile details below to join our upcoming showcase lineups.
          </p>
        </div>

        <div className="bg-[#1f232d]/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artist Type Toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                I am applying as a
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setArtistType("singer")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    artistType === "singer"
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-[#0B0C10]/60 text-gray-400 hover:text-white"
                  }`}
                >
                  <Mic size={16} />
                  Singer
                </button>
                <button
                  type="button"
                  onClick={() => setArtistType("instrumentalist")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    artistType === "instrumentalist"
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-[#0B0C10]/60 text-gray-400 hover:text-white"
                  }`}
                >
                  <Guitar size={16} />
                  Instrumentalist
                </button>
              </div>
            </div>

            {/* Artist Stage Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Artist / Stage Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  name="artistName"
                  required
                  value={formData.artistName}
                  onChange={handleChange}
                  placeholder="e.g., MC Kabir / DJ Kashi"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Music Genre */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Genre / Performance Style
              </label>
              <div className="relative">
                <Music className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="text"
                  name="genre"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g., Classical Fusion, Electronic, Hip-Hop"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Contact Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Biography — optional */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Artist Bio{" "}
                <span className="normal-case font-medium text-gray-500">(optional)</span>
              </label>
              <textarea
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your musical journey, past gigs, and performance energy..."
                className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium leading-relaxed resize-none"
              />
            </div>

            {/* Social Link — optional */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Instagram or Spotify Link{" "}
                <span className="normal-case font-medium text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="url"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Sample Track URL — optional */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Demo / Sample Performance Link (SoundCloud, YouTube, Drive){" "}
                <span className="normal-case font-medium text-gray-500">(optional)</span>
              </label>
              <div className="relative">
                <Disc className="absolute left-4 top-3.5 text-gray-500" size={16} />
                <input
                  type="url"
                  name="sampleTrackUrl"
                  value={formData.sampleTrackUrl}
                  onChange={handleChange}
                  placeholder="https://soundcloud.com/your-track-link"
                  className="w-full bg-[#0B0C10]/60 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide shadow-xl shadow-amber-500/10"
              >
                {loading ? "Submitting Application..." : "Submit Application Portfolio"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PerformerApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <PerformerApplyForm />
    </Suspense>
  );
}