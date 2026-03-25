"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProtectedGig, type GigDetails } from "@/lib/gigApi";
import SiteContainer from "@/components/SiteContainer";

export default function ProtectedGigPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [gig, setGig] = useState<GigDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.slug) return;
    fetchProtectedGig(params.slug)
      .then(setGig)
      .catch((err) => {
        setError(err?.response?.data?.message || "You don't have access to this gig yet.");
      });
  }, [params.slug]);

  if (!gig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brutal-gray px-4">
        <div className="max-w-xl border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0_0_#000]">
          <p className="text-2xl font-black uppercase tracking-tight">{error || "Loading protected gig..."}</p>
          {error ? (
            <button onClick={() => router.push("/dashboard")} className="mt-6 border-4 border-black bg-black px-6 py-3 font-black uppercase text-white shadow-[4px_4px_0_0_#1d2cf3]">
              Back to Dashboard
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-gray py-10">
      <SiteContainer size="compact" className="space-y-8">
        <section className="border-4 border-black bg-white p-10 shadow-[10px_10px_0_0_#000]">
          <p className="font-black uppercase tracking-[0.22em] text-brutal-blue">Approved Access</p>
          <h1 className="mt-4 text-5xl font-black uppercase tracking-tighter">{gig.title}</h1>
          <p className="mt-4 text-lg font-bold text-gray-700">{gig.fullDescription}</p>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-500">Category</p>
            <p className="mt-3 text-2xl font-black">{gig.category}</p>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-500">Pricing</p>
            <p className="mt-3 text-2xl font-black">{gig.pricing || "Shared directly"}</p>
          </div>
          <div className="border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_#000]">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-gray-500">Requirements</p>
            <p className="mt-3 text-lg font-bold">{gig.requirements || "No extra requirements listed"}</p>
          </div>
        </section>
        <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="border-b-4 border-black pb-4 text-3xl font-black uppercase tracking-tighter">Instructions</h2>
          <p className="mt-6 text-lg font-bold text-gray-700">{gig.instructions || "No instructions attached yet."}</p>
        </section>
      </SiteContainer>
    </div>
  );
}
