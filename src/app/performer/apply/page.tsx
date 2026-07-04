"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Music, Radio, Link as LinkIcon, Disc, AlignLeft, User, Phone, Mail } from "lucide-react";

export default function PerformerApplyPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artistName: "",
    genre: "",
    bio: "",
    socialLink: "",
    sampleTrackUrl: "",
    contactNumber: "",
    email: "",
  });

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
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      alert("🎉 " + data.message);
      // Reset form on success
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

            {/* Biography */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Artist Bio
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

            {/* Social Link */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Instagram or Spotify Link
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

            {/* Sample Track URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Demo / Sample Performance Link (SoundCloud, YouTube, Drive)
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