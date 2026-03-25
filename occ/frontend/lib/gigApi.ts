"use client";

import api from "@/lib/api";
import { clearRequestCache, withRequestCache } from "@/lib/requestCache";

export interface GigSummary {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  bannerUrl?: string | null;
  isActive?: boolean;
  isPublic?: boolean;
  applicationCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GigDetails extends GigSummary {
  fullDescription?: string | null;
  pricing?: string | null;
  instructions?: string | null;
  requirements?: string | null;
}

export interface GigApplicationInput {
  name: string;
  email: string;
  phone: string;
  college: string;
  reason: string;
  relevantExperience?: string;
}

export interface GigApplicationRecord {
  id: string;
  gigId: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  college: string;
  reason: string;
  relevantExperience?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  gig?: GigDetails | null;
  user?: {
    id: string;
    email?: string;
    role?: string;
    status?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    profile?: {
      displayName?: string | null;
      bio?: string | null;
      university?: string | null;
      phoneNumber?: string | null;
      hobbies?: string | null;
      avatarUrl?: string | null;
      coverUrl?: string | null;
      createdAt?: string;
      updatedAt?: string;
    } | null;
  } | null;
  reviewedByAdmin?: {
    id: string;
    email?: string;
    role?: string;
    profile?: {
      displayName?: string | null;
    } | null;
  } | null;
}

export interface AdminApplicationSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface AdminGigInput {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  pricing?: string;
  instructions?: string;
  requirements?: string;
  bannerUrl?: string;
  isActive?: boolean;
  isPublic?: boolean;
}

export async function listPublicGigs() {
  return withRequestCache(
    "gigs:public",
    async () => {
      const response = await api.get("/gigs");
      return (response.data?.data?.items || []) as GigSummary[];
    },
    60_000,
  );
}

export async function fetchPublicGig(slug: string) {
  return withRequestCache(
    `gigs:public:${slug}`,
    async () => {
      const response = await api.get(`/gigs/${slug}/public`);
      return response.data?.data?.gig as GigSummary;
    },
    60_000,
  );
}

export async function fetchProtectedGig(slug: string) {
  const response = await api.get(`/gigs/${slug}/protected`);
  return response.data?.data?.gig as GigDetails;
}

export async function applyToGig(gigId: string, input: GigApplicationInput) {
  const response = await api.post(`/gigs/${gigId}/apply`, input);
  return response.data?.data?.application as GigApplicationRecord;
}

export async function listMyApplications() {
  const response = await api.get("/me/applications");
  return (response.data?.data?.items || []) as GigApplicationRecord[];
}

export async function listAdminGigs() {
  const response = await api.get("/admin/gigs");
  return (response.data?.data?.items || []) as GigDetails[];
}

export async function createAdminGig(input: AdminGigInput) {
  const response = await api.post("/admin/gigs", input);
  clearRequestCache("gigs:public");
  return response.data?.data?.gig as GigDetails;
}

export async function updateAdminGig(gigId: string, input: Partial<AdminGigInput>) {
  const response = await api.put(`/admin/gigs/${gigId}`, input);
  clearRequestCache("gigs:public");
  return response.data?.data?.gig as GigDetails;
}

export async function deleteAdminGig(gigId: string) {
  await api.delete(`/admin/gigs/${gigId}`);
  clearRequestCache("gigs:public");
}

export async function listAdminApplications(status?: string) {
  const response = await api.get("/admin/applications", {
    params: status && status !== "ALL" ? { status } : undefined,
  });
  return {
    items: (response.data?.data?.items || []) as GigApplicationRecord[],
    summary: (response.data?.data?.summary || {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    }) as AdminApplicationSummary,
  };
}

export async function listApplicationsForGig(gigId: string) {
  const response = await api.get(`/admin/gigs/${gigId}/applications`);
  return (response.data?.data?.items || []) as GigApplicationRecord[];
}

export async function updateApplicationStatus(applicationId: string, status: "PENDING" | "APPROVED" | "REJECTED") {
  const response = await api.patch(`/admin/applications/${applicationId}/status`, { status });
  return response.data?.data?.application as GigApplicationRecord;
}
