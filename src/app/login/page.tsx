"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/lib/auth";

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

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await login(email, password);

    setLoading(false);

    if (error) {
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight">
          Login
        </h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          Welcome back to The Benaras Beats
        </p>

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
          className="mb-6 w-full rounded-lg border border-white/10 bg-white/[0.03] p-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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