"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signInWithGoogle } from "@/lib/auth";
import { User, Mail, Lock, Sparkles } from "lucide-react";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirectTo");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    const { error } = await signUp(name, email, password);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("🎉 Account created! Please check your email to confirm your address before logging in.");

    setName("");
    setEmail("");
    setPassword("");

    router.push(redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login");
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle(redirectTo);
    if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#1f232d]/60 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 animate-pulse">
          <Sparkles size={22} />
        </div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-white">
          Create <span className="text-amber-500">Account</span>
        </h1>
        <p className="mt-2 text-center text-xs tracking-wide text-gray-400">
          Join Benaras Beats to unlock dynamic event access.
        </p>
      </div>

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

      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3.5 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="e.g., Kabir Singh"
            className="w-full rounded-xl border border-white/10 bg-[#0B0C10]/60 py-3 pl-12 pr-4 font-medium text-white placeholder-gray-600 transition-all focus:border-amber-500/50 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 text-gray-500" size={16} />
          <input
            type="email"
            placeholder="name@domain.com"
            className="w-full rounded-xl border border-white/10 bg-[#0B0C10]/60 py-3 pl-12 pr-4 font-medium text-white placeholder-gray-600 transition-all focus:border-amber-500/50 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-500" size={16} />
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-white/10 bg-[#0B0C10]/60 py-3 pl-12 pr-4 font-medium text-white placeholder-gray-600 transition-all focus:border-amber-500/50 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold tracking-wide text-black shadow-xl shadow-amber-500/10 transition-all duration-200 hover:scale-[1.005] hover:bg-amber-400 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Sign Up & Continue"}
      </button>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
          className="font-semibold text-amber-400 transition hover:text-amber-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#0B0C10] px-6 selection:bg-amber-500 selection:text-black">
      <div className="absolute top-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  );
}