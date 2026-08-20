"use client";

import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Music,
  Link as LinkIcon,
  Disc,
  User,
  Phone,
  Mail,
  Mic,
  Guitar,
  ArrowLeft,
  Sparkles,
  Check,
} from "lucide-react";

function PerformerApplyForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType =
    searchParams.get("type") === "instrumentalist"
      ? "instrumentalist"
      : "singer";

  const [loading, setLoading] = useState(false);

  const [artistType, setArtistType] = useState<
    "singer" | "instrumentalist"
  >(initialType);

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

    if (
      typeParam === "instrumentalist" ||
      typeParam === "singer"
    ) {
      setArtistType(typeParam);
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          artistType,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to submit application."
        );
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
    <main className="min-h-screen bg-[#090807] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[#C9A24B]/[0.035] blur-[130px]" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#7D4354]/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mb-12 inline-flex items-center gap-2 text-sm text-stone-500 transition-colors hover:text-[#C9A24B]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          {/* LEFT — Editorial intro */}
          <div className="lg:sticky lg:top-10">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C9A24B]" />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A24B]">
                Artist Application
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[0.95] tracking-tight text-[#EDE6D9] sm:text-6xl">
              Bring your
              <br />
              <span className="text-[#C9A24B]">sound</span>
              <br />
              to Benaras.
            </h1>

            <p className="mt-7 max-w-md text-sm leading-7 text-stone-400 sm:text-base">
              The Benaras Beats is a space for musicians,
              performers, and storytellers to share their craft
              with an audience that listens.
            </p>

            {/* Small editorial details */}
            <div className="mt-10 border-y border-white/[0.07] py-5">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={16}
                  className="text-[#C9A24B]"
                />

                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Music · Culture · Community
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {[
                "Showcase your sound",
                "Connect with new audiences",
                "Become part of our artist circle",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-stone-400"
                >
                  <span className="flex h-6 w-6 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.05]">
                    <Check
                      size={13}
                      className="text-[#C9A24B]"
                    />
                  </span>

                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="border border-white/[0.08] bg-[#11100E]">
            {/* Form header */}
            <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-stone-600">
                    PERFORMER / 01
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#EDE6D9]">
                    Your Profile
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center border border-[#C9A24B]/20 bg-[#C9A24B]/[0.05]">
                  {artistType === "singer" ? (
                    <Mic
                      size={19}
                      className="text-[#C9A24B]"
                    />
                  ) : (
                    <Guitar
                      size={19}
                      className="text-[#C9A24B]"
                    />
                  )}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-7 p-6 sm:p-8"
            >
              {/* Artist Type */}
              <div>
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                  I am applying as
                </label>

                <div className="grid grid-cols-2 gap-px border border-white/[0.08] bg-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setArtistType("singer")}
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition ${
                      artistType === "singer"
                        ? "bg-[#C9A24B] text-[#090807]"
                        : "bg-[#090807] text-stone-500 hover:text-stone-200"
                    }`}
                  >
                    <Mic size={16} />
                    Singer
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setArtistType("instrumentalist")
                    }
                    className={`flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition ${
                      artistType === "instrumentalist"
                        ? "bg-[#C9A24B] text-[#090807]"
                        : "bg-[#090807] text-stone-500 hover:text-stone-200"
                    }`}
                  >
                    <Guitar size={16} />
                    Instrumentalist
                  </button>
                </div>
              </div>

              {/* Artist Name */}
              <Field
                label="Artist / Stage Name"
                icon={<User size={16} />}
              >
                <input
                  type="text"
                  name="artistName"
                  required
                  value={formData.artistName}
                  onChange={handleChange}
                  placeholder="e.g. MC Kabir / DJ Kashi"
                  className={inputClass}
                />
              </Field>

              {/* Genre */}
              <Field
                label="Genre / Performance Style"
                icon={<Music size={16} />}
              >
                <input
                  type="text"
                  name="genre"
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Classical Fusion, Electronic, Hip-Hop..."
                  className={inputClass}
                />
              </Field>

              {/* Contact */}
              <div className="grid gap-7 sm:grid-cols-2">
                <Field
                  label="Contact Number"
                  icon={<Phone size={16} />}
                >
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Email Address"
                  icon={<Mail size={16} />}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Bio */}
              <div>
                <label className={labelClass}>
                  Artist Bio{" "}
                  <span className="normal-case tracking-normal text-stone-600">
                    (optional)
                  </span>
                </label>

                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your musical journey, previous performances, and your sound..."
                  className={`${inputClass} resize-none px-4 py-3`}
                />
              </div>

              {/* Social */}
              <Field
                label={
                  <>
                    Instagram or Spotify Link{" "}
                    <span className="normal-case tracking-normal text-stone-600">
                      (optional)
                    </span>
                  </>
                }
                icon={<LinkIcon size={16} />}
              >
                <input
                  type="url"
                  name="socialLink"
                  value={formData.socialLink}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourhandle"
                  className={inputClass}
                />
              </Field>

              {/* Sample */}
              <Field
                label={
                  <>
                    Demo / Sample Performance Link{" "}
                    <span className="normal-case tracking-normal text-stone-600">
                      (optional)
                    </span>
                  </>
                }
                icon={<Disc size={16} />}
              >
                <input
                  type="url"
                  name="sampleTrackUrl"
                  value={formData.sampleTrackUrl}
                  onChange={handleChange}
                  placeholder="SoundCloud, YouTube, Drive..."
                  className={inputClass}
                />
              </Field>

              {/* Submit */}
              <div className="border-t border-white/[0.07] pt-7">
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-between bg-[#C9A24B] px-5 py-4 text-sm font-semibold text-[#090807] transition-all duration-300 hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? "Submitting Application..."
                      : "Submit Artist Application"}
                  </span>

                  {!loading && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>

                <p className="mt-4 text-center text-[10px] leading-5 text-stone-600">
                  Our team will review your profile and contact
                  you regarding upcoming performance opportunities.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------
   Reusable field component
------------------------------------------------------------ */

function Field({
  label,
  icon,
  children,
}: {
  label: React.ReactNode;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-600">
          {icon}
        </div>

        {children}
      </div>
    </div>
  );
}

const labelClass =
  "mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500";

const inputClass =
  "w-full border border-white/[0.08] bg-[#090807] py-3.5 pl-12 pr-4 text-sm font-medium text-white placeholder:text-stone-700 outline-none transition-all duration-200 focus:border-[#C9A24B]/50 focus:bg-[#0C0B09]";
  
export default function PerformerApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#090807] text-stone-500">
          Loading...
        </div>
      }
    >
      <PerformerApplyForm />
    </Suspense>
  );
}