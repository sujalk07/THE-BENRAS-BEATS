// app/auth/confirmed/page.tsx
"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function EmailConfirmedPage() {
  return (
    <main className="min-h-screen bg-[#0B0C10] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1f232d]/60 p-8 text-center">
        <CheckCircle className="mx-auto text-emerald-400" size={48} />
        <h1 className="mt-4 text-xl font-bold">Email Confirmed!</h1>
        <p className="mt-2 text-sm text-gray-400">
          Your account is now active. You can log in now.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}