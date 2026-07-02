"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      const { data, error } = await supabase.auth.getSession();

      const redirectTo = searchParams.get("redirectTo");
      const finalRedirect = redirectTo ? decodeURIComponent(redirectTo) : "/";

      if (error || !data.session) {
        router.push("/login?error=oauth_failed");
        return;
      }

      router.push(finalRedirect);
      router.refresh();
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
      Signing you in...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-gray-400">
          Loading...
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}