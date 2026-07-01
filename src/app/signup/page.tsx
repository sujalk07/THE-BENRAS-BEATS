"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth";
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

    alert("🎉 Account created successfully!");

    setName("");
    setEmail("");
    setPassword("");

    if (redirectTo) {
      router.push(decodeURIComponent(redirectTo));
    } else {
      router.push("/");
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