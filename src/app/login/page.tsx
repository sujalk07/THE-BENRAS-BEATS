"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  login,
  resendConfirmationEmail,
  signInWithGoogle,
} from "@/lib/auth";
import { Music2, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0A0908] text-white">
          <span className="text-sm text-gray-500 animate-pulse">
            Loading...
          </span>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";
  const selectedTier = searchParams.get("tier");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(
    null
  );
  const [resending, setResending] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setUnconfirmedEmail(null);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      if (
        error.message.toLowerCase().includes("email not confirmed")
      ) {
        setUnconfirmedEmail(email);
        return;
      }

      alert(error.message);
      return;
    }

    if (selectedTier) {
      router.push(`${redirectTo}?tier=${selectedTier}`);
    } else {
      router.push(redirectTo);
    }

    router.refresh();
  };

  const handleResend = async () => {
    if (!unconfirmedEmail) return;

    setResending(true);

    const { error } =
      await resendConfirmationEmail(unconfirmedEmail);

    setResending(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Confirmation email resent — check your inbox.");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle(redirectTo);

    if (error) {
      alert(error.message);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0908] text-white">

      {/* Ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-180px] top-[10%] h-[500px] w-[500px] rounded-full bg-[#B8923F]/[0.045] blur-[150px]" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[450px] w-[450px] rounded-full bg-rose-500/[0.025] blur-[140px]" />
      </div>

      {/* Top brand line */}
      <div className="absolute left-1/2 top-0 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#B8923F]/50 to-transparent" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-5 py-10">

        <div className="grid w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11100E] md:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT BRAND PANEL */}
          <div className="relative hidden min-h-[600px] overflow-hidden border-r border-white/[0.07] md:flex">

            <div className="absolute inset-0 bg-gradient-to-br from-[#1A160D] via-[#11100E] to-[#0A0908]" />

            <div className="relative z-10 flex flex-col justify-between p-9">

              {/* Logo */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#B8923F]/30 bg-[#B8923F]/[0.06]">
                    <Music2
                      size={17}
                      className="text-[#C9A24B]"
                    />
                  </div>

                  <span className="font-serif text-xl tracking-wide text-[#EDE6D9]">
                    The Benaras Beats
                  </span>
                </div>
              </div>

              {/* Main statement */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C9A24B]" />

                  <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
                    Music · Culture · Community
                  </span>
                </div>

                <h2 className="max-w-sm font-serif text-4xl leading-[1.1] tracking-wide text-[#F2EBDD]">
                  Come closer
                  <br />
                  to the music.
                </h2>

                <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600">
                  Sign in to discover performances, manage your
                  tickets, connect with the community, and experience
                  Benaras through music.
                </p>
              </div>

              {/* Bottom */}
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gray-700">
                <Sparkles size={11} />
                Varanasi · India
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN PANEL */}
          <div className="flex min-h-[600px] flex-col justify-center p-6 sm:p-9 md:p-12">

            {/* Mobile logo */}
            <div className="mb-10 flex items-center justify-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#B8923F]/30 bg-[#B8923F]/[0.06]">
                <Music2
                  size={15}
                  className="text-[#C9A24B]"
                />
              </div>

              <span className="font-serif text-lg text-[#EDE6D9]">
                The Benaras Beats
              </span>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#B8923F]">
                Welcome back
              </p>

              <h1 className="mt-3 font-serif text-4xl tracking-wide text-[#F2EBDD]">
                Sign in
              </h1>

              <p className="mt-2 text-sm text-gray-600">
                Continue your Benaras Beats journey.
              </p>
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/[0.1] bg-white/[0.03] py-3 text-sm font-medium text-gray-300 transition hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>

              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.07]" />

              <span className="font-mono text-[8px] tracking-[0.2em] text-gray-700">
                OR
              </span>

              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* Email */}
            <div className="space-y-5">

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-gray-500"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-gray-500"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700"
                  />

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-[#0A0908] py-3.5 pl-11 pr-4 text-sm text-[#EDE6D9] outline-none transition placeholder:text-gray-700 focus:border-[#B8923F]/50"
                  />
                </div>
              </div>
            </div>

            {/* Unconfirmed */}
            {unconfirmedEmail && (
              <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-4 text-xs leading-5 text-amber-300">
                <p>
                  Your email hasn&apos;t been confirmed yet.
                </p>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="mt-1 font-semibold text-[#D9B662] underline underline-offset-2 transition hover:text-[#F0D98A] disabled:opacity-50"
                >
                  {resending
                    ? "Resending..."
                    : "Resend confirmation email"}
                </button>
              </div>
            )}

            {/* Login */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#C9A24B] py-3.5 text-xs font-semibold text-[#0A0908] transition hover:bg-[#D9B662] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            {/* Signup */}
            <p className="mt-7 text-center text-xs text-gray-600">
              New to The Benaras Beats?{" "}
              <Link
                href={
                  redirectTo
                    ? `/signup?redirectTo=${encodeURIComponent(
                        redirectTo
                      )}`
                    : "/signup"
                }
                className="font-medium text-[#C9A24B] transition hover:text-[#E0C56E]"
              >
                Create an account
              </Link>
            </p>

            {/* Bottom divider */}
            <div className="mt-8 border-t border-white/[0.06] pt-5 text-center">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-gray-700">
                Music · Culture · Community
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}