"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock3, FolderOpen, ShieldCheck, XCircle } from "lucide-react";
import { fetchDashboard, type DashboardPayload } from "@/lib/dashboardApi";
import { useUser } from "@/context/UserContext";
import SiteContainer from "@/components/SiteContainer";

const badgeClasses: Record<string, string> = {
  PENDING: "bg-[#fff2bf] text-black",
  APPROVED: "bg-[#d5f5df] text-black",
  REJECTED: "bg-[#ffd9d9] text-black",
};

const statusCopy: Record<string, { title: string; body: string }> = {
  PENDING: {
    title: "Awaiting admin review",
    body: "Your application is in the review queue. Protected gig details stay locked until approval.",
  },
  APPROVED: {
    title: "Approved and unlocked",
    body: "This application has been accepted. You can now open the protected gig brief and instructions.",
  },
  REJECTED: {
    title: "Not approved",
    body: "This application was rejected. Protected gig details remain unavailable for this listing.",
  },
};

const clubStatusCopy: Record<string, { title: string; body: string }> = {
  PENDING: {
    title: "Awaiting admin review",
    body: "Your club submission is pending review and stays hidden from the public directory until approval.",
  },
  APPROVED: {
    title: "Approved and public",
    body: "Your club is now approved, public, and ready for members to discover and join.",
  },
  REJECTED: {
    title: "Submission rejected",
    body: "This club was not approved and remains hidden from the public clubs directory.",
  },
};

function SummaryCard({
  label,
  value,
  tone = "occ-surface",
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className={`p-6 ${tone}`}>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className="mt-3 text-4xl font-black">{value}</p>
    </div>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const { isLoggedIn, isAuthLoading } = useUser();
  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn) {
      router.push("/login?next=%2Fdashboard");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const payload = await fetchDashboard();
        if (!active) return;
        setDashboard(payload);
      } catch {
        if (!active) return;
        setError("We couldn't load your dashboard right now.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  const joinedClubs = dashboard?.joinedClubs || [];
  const createdClubs = dashboard?.createdClubs || [];
  const applications = dashboard?.applications || [];
  const approvedGigs = dashboard?.approvedGigs || [];
  const profile = dashboard?.profile;
  const applicationSummary = dashboard?.applicationSummary || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const latestApproved = applications.find((application) => application.status === "APPROVED") || null;

  if (isAuthLoading || isLoading || !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brutal-gray px-4">
        <div className="border-4 border-black bg-white px-10 py-8 shadow-[8px_8px_0_0_#000]">
          <p className="text-2xl font-black uppercase tracking-tight">{error || "Loading dashboard..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brutal-gray py-10">
      <SiteContainer className="space-y-10">
        <section className="border-4 border-black bg-white p-8 shadow-[10px_10px_0_0_#000] md:p-12">
          <p className="font-black uppercase tracking-[0.24em] text-brutal-blue">Personal Dashboard</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
                {profile?.profile?.displayName || "OCC Member"}
              </h1>
              <p className="mt-4 text-xl font-bold text-gray-700">{profile?.email}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="border-2 border-black bg-brutal-gray px-3 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  College: {profile?.profile?.university || "Not added yet"}
                </span>
                <span className="border-2 border-black bg-brutal-gray px-3 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  Joined Clubs: {joinedClubs.length}
                </span>
                <span className="border-2 border-black bg-brutal-gray px-3 py-2 text-xs font-black uppercase tracking-[0.18em]">
                  Total Applications: {applicationSummary.total}
                </span>
              </div>
            </div>

            <div className="border-4 border-black bg-black p-8 text-white shadow-[8px_8px_0_0_#1d2cf3]">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-white/60">Application Status</p>
              <p className="mt-5 text-4xl font-black">{applicationSummary.approved} Approved</p>
              <p className="mt-2 font-bold text-white/75">
                {latestApproved
                  ? `${latestApproved.gig?.title || "A gig"} is unlocked in the approval section below.`
                  : "As soon as an admin approves a gig, it will unlock in the approval section below."}
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs font-black uppercase tracking-[0.16em]">
                <div className="occ-dark-inset px-3 py-3">
                  <p>{applicationSummary.pending}</p>
                  <p className="mt-1">Pending</p>
                </div>
                <div className="occ-dark-inset px-3 py-3">
                  <p>{applicationSummary.approved}</p>
                  <p className="mt-1">Approved</p>
                </div>
                <div className="occ-dark-inset px-3 py-3">
                  <p>{applicationSummary.rejected}</p>
                  <p className="mt-1">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Pending Reviews" value={applicationSummary.pending} tone="occ-surface-warm" />
          <SummaryCard label="Approved Gigs" value={applicationSummary.approved} tone="occ-surface-success" />
          <SummaryCard label="Rejected" value={applicationSummary.rejected} tone="occ-surface-danger" />
          <SummaryCard label="Joined Clubs" value={joinedClubs.length} tone="occ-surface" />
        </section>

        <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">My Created Clubs</h2>
              <p className="mt-2 font-bold text-gray-600">
                New clubs now go through admin approval before they appear publicly in the OCC clubs directory.
              </p>
            </div>
            <Link
              href="/clubs"
              className="border-2 border-black bg-white px-4 py-3 font-black uppercase shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Submit Another Club
            </Link>
          </div>

          {createdClubs.length > 0 ? (
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {createdClubs.map((club) => {
                const copy = clubStatusCopy[club.approvalStatus || "PENDING"] || clubStatusCopy.PENDING;
                const clubCategory = typeof club.category === "string" ? club.category : club.category?.name || "Club";
                return (
                  <article key={club.id} className="border-2 border-black bg-[#f3f4f7] p-5 shadow-[4px_4px_0_0_#000]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black uppercase">{club.name}</p>
                        <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-gray-500">
                          Submitted {club.createdAt ? new Date(club.createdAt).toLocaleDateString("en-IN") : "Recently"} | {clubCategory}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${badgeClasses[club.approvalStatus || "PENDING"] || "bg-white text-black"}`}>
                          {club.approvalStatus || "PENDING"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 border-2 border-black bg-white p-4">
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-brutal-blue">{copy.title}</p>
                      <p className="mt-2 font-bold text-gray-700">{copy.body}</p>
                    </div>

                    <div className="mt-4 space-y-2 text-sm font-bold text-gray-700">
                      <p>Description: {club.description}</p>
                      <p>Visibility: {club.approvalStatus === "APPROVED" ? "Approved / Public" : club.approvalStatus === "REJECTED" ? "Rejected / Hidden" : "Pending / Hidden"}</p>
                      {club.reviewedAt ? <p>Reviewed {new Date(club.reviewedAt).toLocaleDateString("en-IN")}</p> : null}
                      {club.rejectionReason ? <p>Rejection reason: {club.rejectionReason}</p> : null}
                    </div>

                    <Link
                      href={`/clubs/${club.slug || club.id}`}
                      className="mt-5 inline-flex items-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-[4px_4px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                    >
                      Open Club
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 border-2 border-dashed border-black p-6 font-bold text-gray-600">
              You haven&apos;t submitted any clubs yet. Use the clubs page to create one for admin review.
            </div>
          )}
        </section>

        <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Approval Status</h2>
              <p className="mt-2 font-bold text-gray-600">
                This section shows the result of every gig you applied for, and unlocked approved gigs live here too.
              </p>
            </div>
            <Link
              href="/gigs"
              className="border-2 border-black bg-white px-4 py-3 font-black uppercase shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Browse Gigs
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="mt-6 space-y-8">
              <div className="grid gap-5 lg:grid-cols-2">
                {applications.map((application) => {
                  const copy = statusCopy[application.status] || statusCopy.PENDING;
                  const canOpenProtectedGig = application.status === "APPROVED" && application.gig?.slug;

                  return (
                    <article key={application.id} className="border-2 border-black bg-[#f3f4f7] p-5 shadow-[4px_4px_0_0_#000]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-2xl font-black uppercase">{application.gig?.title || "Gig"}</p>
                          <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-gray-500">
                            {application.gig?.category || "Opportunity"} | Applied{" "}
                            {new Date(application.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <span className={`border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${badgeClasses[application.status] || "bg-white text-black"}`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="mt-5 border-2 border-black bg-white p-4">
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-brutal-blue">{copy.title}</p>
                        <p className="mt-2 font-bold text-gray-700">{copy.body}</p>
                      </div>

                      <div className="mt-4 space-y-2 text-sm font-bold text-gray-700">
                        <p>Reason: {application.reason}</p>
                        <p>Experience: {application.relevantExperience || "No extra experience added."}</p>
                        {application.reviewedAt ? (
                          <p>
                            Reviewed {new Date(application.reviewedAt).toLocaleDateString("en-IN")}
                            {application.reviewedByAdmin?.profile?.displayName || application.reviewedByAdmin?.email
                              ? ` by ${application.reviewedByAdmin?.profile?.displayName || application.reviewedByAdmin?.email}`
                              : ""}
                          </p>
                        ) : null}
                      </div>

                      {canOpenProtectedGig ? (
                        <Link
                          href={`/gigs/${application.gig!.slug}`}
                          className="mt-5 inline-flex items-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-[4px_4px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <FolderOpen className="h-4 w-4" />
                          Open Unlocked Gig
                        </Link>
                      ) : null}
                    </article>
                  );
                })}
              </div>

              <div className="border-t-4 border-black pt-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Unlocked Approved Gigs</h3>
                    <p className="mt-1 font-bold text-gray-600">
                      Approved gigs unlock their protected brief, pricing, requirements, and instructions here.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 border-2 border-black bg-[#d5f5df] px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                    <ShieldCheck className="h-4 w-4" />
                    Protected Access
                  </div>
                </div>

                {approvedGigs.length > 0 ? (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {approvedGigs.map((gig) => (
                      <div key={gig.id} className="border-2 border-black bg-[#f3f4f7] p-6 shadow-[4px_4px_0_0_#000]">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-2xl font-black uppercase">{gig.title}</p>
                            <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-gray-500">{gig.category}</p>
                          </div>
                          <span className="border-2 border-black bg-[#d5f5df] px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">
                            Approved
                          </span>
                        </div>

                        <p className="mt-4 font-bold text-gray-700">{gig.fullDescription}</p>
                        <div className="mt-4 space-y-2 text-sm font-bold text-gray-700">
                          <p>Pricing: {gig.pricing || "Assigned after approval"}</p>
                          <p>Requirements: {gig.requirements || "Shared during onboarding"}</p>
                          <p>Instructions: {gig.instructions || "Shared during onboarding"}</p>
                        </div>

                        <Link
                          href={`/gigs/${gig.slug}`}
                          className="mt-5 inline-flex items-center gap-2 border-2 border-black bg-black px-4 py-3 font-black uppercase text-white shadow-[4px_4px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Open Protected Gig
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-black p-6 font-bold text-gray-600">
                    Your approved gigs will appear here once an admin accepts an application.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 border-2 border-dashed border-black p-6 font-bold text-gray-600">
              No gig applications yet. Explore gigs and submit your first application.
            </div>
          )}
        </section>

        <div className="grid gap-10 xl:grid-cols-2">
          <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
            <h2 className="border-b-4 border-black pb-4 text-3xl font-black uppercase tracking-tighter">Joined Clubs</h2>
            {joinedClubs.length > 0 ? (
              <div className="mt-6 space-y-4">
                {joinedClubs.map((membership) => (
                  <Link
                    key={membership.id}
                    href={`/clubs/${membership.club.slug || membership.club.id}`}
                    className="block border-2 border-black bg-brutal-gray p-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]"
                  >
                    <p className="text-xl font-black uppercase">{membership.club.name}</p>
                    <p className="mt-2 font-bold text-gray-700">{membership.club.description}</p>
                    <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                      {membership.membershipRole} | Joined {new Date(membership.joinedAt).toLocaleDateString("en-IN")}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-6 border-2 border-dashed border-black p-6 font-bold text-gray-600">
                You haven&apos;t joined any clubs yet. Browse the clubs directory to start.
              </div>
            )}
          </section>

          <section className="border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
            <h2 className="border-b-4 border-black pb-4 text-3xl font-black uppercase tracking-tighter">Review Snapshot</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 border-2 border-black bg-[#fff9d9] p-4">
                <Clock3 className="h-7 w-7" />
                <div>
                  <p className="font-black uppercase">Pending Applications</p>
                  <p className="font-bold text-gray-700">
                    {applicationSummary.pending} application{applicationSummary.pending === 1 ? "" : "s"} waiting for admin action.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-2 border-black bg-[#e8faef] p-4">
                <CheckCircle2 className="h-7 w-7" />
                <div>
                  <p className="font-black uppercase">Unlocked Access</p>
                  <p className="font-bold text-gray-700">
                    {applicationSummary.approved} gig{applicationSummary.approved === 1 ? "" : "s"} approved and available above.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 border-2 border-black bg-[#ffe7e7] p-4">
                <XCircle className="h-7 w-7" />
                <div>
                  <p className="font-black uppercase">Rejected Applications</p>
                  <p className="font-bold text-gray-700">
                    {applicationSummary.rejected} application{applicationSummary.rejected === 1 ? "" : "s"} not approved.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </SiteContainer>
    </div>
  );
}
