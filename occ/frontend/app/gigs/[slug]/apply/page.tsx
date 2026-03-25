"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { applyToGig, fetchPublicGig, type GigSummary } from "@/lib/gigApi";
import { useUser } from "@/context/UserContext";
import SiteContainer from "@/components/SiteContainer";

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

export default function ApplyPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, isLoggedIn } = useUser();
  const [gig, setGig] = useState<GigSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    college: user?.university || "",
    reason: "",
    relevantExperience: "",
  });
  const reasonWordCount = countWords(form.reason);

  const updateFormField = (field: "name" | "email" | "phone" | "college" | "relevantExperience", value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReasonChange = (value: string) => {
    const trimmedValue = value.replace(/\s+/g, " ");
    const words = trimmedValue.trim().split(" ").filter(Boolean);
    const nextReason = words.length <= 10 ? value : words.slice(0, 10).join(" ");

    setForm((prev) => ({ ...prev, reason: nextReason }));
    if (error === "Reason for applying must be 10 words or fewer.") {
      setError("");
    }
  };

  useEffect(() => {
    if (!params.slug) return;
    fetchPublicGig(params.slug).then(setGig).catch(() => setGig(null));
  }, [params.slug]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email,
      phone: user?.phoneNumber || prev.phone,
      college: user?.university || prev.college,
    }));
  }, [user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!gig) return;
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/gigs/${gig.slug}/apply`)}`);
      return;
    }
    if (reasonWordCount > 10) {
      setError("Reason for applying must be 10 words or fewer.");
      return;
    }

    setIsSubmitting(true);
    try {
      await applyToGig(gig.id, form);
      setSuccess("Application submitted. Your status is now pending.");
      window.setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (submissionError: unknown) {
      const message =
        typeof submissionError === "object" &&
        submissionError !== null &&
        "response" in submissionError &&
        typeof (submissionError as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (submissionError as { response?: { data?: { message?: string } } }).response!.data!.message!
          : "We couldn't submit your application.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brutal-gray py-10">
      <SiteContainer className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <p className="font-black uppercase tracking-[0.22em] text-brutal-blue">Gig Apply</p>
          <h1 className="mt-4 text-4xl font-black uppercase tracking-tighter">{gig?.title || "Loading..."}</h1>
          <p className="mt-4 border-l-8 border-black bg-brutal-gray p-4 pl-6 text-lg font-bold text-gray-700">
            {gig?.shortDescription || "Preparing gig preview..."}
          </p>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-gray-500">
            Category: {gig?.category || "Loading"}
          </p>
          <p className="mt-8 font-bold text-gray-600">
            Protected fields like pricing, instructions, and full brief are intentionally withheld until your application is approved.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="border-b-4 border-black pb-4 text-3xl font-black uppercase tracking-tighter">Application Form</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <input required value={form.name} onChange={(e) => updateFormField("name", e.target.value)} placeholder="Name" className="occ-field" />
            <input required type="email" value={form.email} onChange={(e) => updateFormField("email", e.target.value)} placeholder="Email" className="occ-field" />
            <input required value={form.phone} onChange={(e) => updateFormField("phone", e.target.value)} placeholder="Phone Number" className="occ-field" />
            <input required value={form.college} onChange={(e) => updateFormField("college", e.target.value)} placeholder="College" className="occ-field" />
          </div>
          <textarea
            required
            value={form.reason}
            onChange={(e) => handleReasonChange(e.target.value)}
            placeholder="Reason for applying"
            rows={6}
            className="occ-textarea mt-5"
          />
          <p className={`mt-2 text-sm font-bold ${reasonWordCount > 10 ? "text-red-600" : "text-gray-500"}`}>
            {reasonWordCount}/10 words
          </p>
          <textarea value={form.relevantExperience} onChange={(e) => updateFormField("relevantExperience", e.target.value)} placeholder="Relevant experience (optional)" rows={4} className="occ-textarea mt-5" />

          {!isLoggedIn ? (
            <p className="mt-5 border-l-4 border-brutal-blue pl-3 font-bold text-gray-700">
              You can view this page publicly, but you need to log in before submitting.
            </p>
          ) : null}
          {error ? <p className="mt-5 border-l-4 border-red-600 pl-3 font-bold text-red-600">{error}</p> : null}
          {success ? <p className="mt-5 border-l-4 border-green-600 pl-3 font-bold text-green-700">{success}</p> : null}

          <button type="submit" disabled={isSubmitting} className="mt-6 border-4 border-black bg-black px-8 py-4 font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
            {isSubmitting ? "Submitting..." : isLoggedIn ? "Submit Application" : "Log In to Apply"}
          </button>
        </form>
      </SiteContainer>
    </div>
  );
}
