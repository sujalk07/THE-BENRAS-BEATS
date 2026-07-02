"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login, resendConfirmationEmail, signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <span className="text-sm text-gray-400 animate-pulse">Loading...</span>
        </div>
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
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setUnconfirmedEmail(null);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
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
    const { error } = await resendConfirmationEmail(unconfirmedEmail);
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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight">
          Login
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Welcome back to The Benaras Beats
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {unconfirmedEmail && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Your email isn't confirmed yet.{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold underline hover:text-amber-200 disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend confirmation email"}
            </button>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 py-3 font-semibold text-black transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          New here?{" "}
          <Link
            href={redirectTo ? `/signup?redirectTo=${encodeURIComponent(redirectTo)}` : "/signup"}
            className="font-semibold text-amber-400 transition hover:text-amber-300"
          >
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}