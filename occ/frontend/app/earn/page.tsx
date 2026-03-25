"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import SiteContainer from "@/components/SiteContainer";

export default function EarnPage() {
  const router = useRouter();
  const { isLoggedIn, isAuthLoading } = useUser();

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/login?next=%2Fearnings");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  if (isAuthLoading || !isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brutal-gray px-4">
        <div className="border-4 border-black bg-white px-10 py-8 shadow-[8px_8px_0_0_#000]">
          <p className="text-2xl font-black uppercase tracking-tight">Loading dashboard status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-gray py-10">
      <SiteContainer size="compact" className="space-y-8">
        <section className="border-4 border-black bg-white p-10 shadow-[10px_10px_0_0_#000]">
          <p className="font-black uppercase tracking-[0.24em] text-brutal-blue">Dashboard First</p>
          <h1 className="mt-4 text-6xl font-black uppercase tracking-tighter">Status Lives In Dashboard</h1>
          <p className="mt-4 max-w-2xl text-lg font-bold text-gray-700">
            Earnings is no longer the primary place to follow gig approvals. Your dashboard now shows pending, approved, and rejected applications, plus unlocked gig access after approval.
          </p>
          <Link
            href="/dashboard"
            className="mt-8 inline-block border-4 border-black bg-black px-6 py-3 font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            Open Dashboard
          </Link>
        </section>

        <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="border-b-4 border-black pb-4 text-3xl font-black uppercase tracking-tighter">Future Scope</h2>
          <p className="mt-6 text-lg font-bold text-gray-700">
            A dedicated earnings and payouts experience can still return later, but it is intentionally out of the main user flow until real payout logic exists.
          </p>
        </section>
      </SiteContainer>
    </div>
  );
}
