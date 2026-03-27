"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import PublicPageGrid from "@/components/PublicPageGrid";
import { requestPasswordReset } from "@/lib/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSuccess("If this account exists, a reset link has been sent to the email address.");
    } catch {
      setError("Unable to start password reset right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicPageGrid className="min-h-screen bg-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-4 border-black p-8 md:p-12 shadow-[12px_12px_0_0_#000] relative">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-8 border-b-4 border-black pb-4">
          Reset Access<span className="text-brutal-blue">.</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm font-bold text-black/70">
            Enter the email for the older account. If it exists, we will send a password reset link.
          </p>

          <div>
            <label className="block font-black uppercase text-sm mb-2 tracking-widest">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="occ-field text-lg"
              placeholder="example@gmail.com"
            />
          </div>

          {error ? (
            <p className="border-l-4 border-red-600 pl-3 text-sm font-black uppercase text-red-600">{error}</p>
          ) : null}

          {success ? (
            <p className="border-l-4 border-brutal-blue pl-3 text-sm font-black uppercase text-brutal-blue">{success}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-black uppercase py-5 text-xl border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"} <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        <p className="mt-6 text-sm font-bold text-black/70">
          Remembered it?{" "}
          <Link href="/login" className="font-black uppercase text-brutal-blue hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </PublicPageGrid>
  );
}
