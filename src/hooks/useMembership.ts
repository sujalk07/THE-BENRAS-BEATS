"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export function useMembership() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<any>(null);

  const refreshMembership = async () => {
    if (!user?.id) {
      setMembership(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/membership/my-status?userId=${user.id}`
      );

      const data = await res.json();

      if (data.status === "active") {
        setMembership(data);
      } else {
        setMembership(null);
      }
    } catch (err) {
      console.error(err);
      setMembership(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMembership();
  }, [user]);

  return {
    membership,
    isMember: !!membership,
    loading,
    refreshMembership,
  };
}