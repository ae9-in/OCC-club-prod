"use client";

import api from "@/lib/api";
import { withRequestCache, clearRequestCache } from "@/lib/requestCache";
import type { GigApplicationRecord, GigDetails } from "@/lib/gigApi";

export interface DashboardProfile {
  id: string;
  email?: string;
  createdAt?: string;
  profile?: {
    displayName?: string | null;
    university?: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export interface DashboardClubMembership {
  id: string;
  membershipRole: string;
  joinedAt: string;
  club: {
    id: string;
    slug: string;
    name: string;
    description: string;
    bannerUrl?: string | null;
    memberCount?: number;
  };
}

export interface DashboardCreatedClub {
  id: string;
  slug?: string | null;
  name: string;
  description: string;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  category?: { name?: string | null } | string | null;
}

export interface DashboardPayload {
  profile: DashboardProfile;
  joinedClubs: DashboardClubMembership[];
  createdClubs: DashboardCreatedClub[];
  applications: GigApplicationRecord[];
  applicationSummary: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  approvedGigs: GigDetails[];
  activity: {
    postsPlaceholder: unknown[];
    earningsSummary: {
      totalEarnings: number;
      activeGigs: number;
      completedPayouts: number;
      note: string;
    };
  };
}

export async function fetchDashboard() {
  return withRequestCache(
    "dashboard:me",
    async () => {
      const response = await api.get("/me/dashboard");
      return response.data?.data as DashboardPayload;
    },
    20_000,
  );
}

export async function fetchEarningsSummary() {
  const response = await api.get("/me/earnings");
  return response.data?.data?.summary as {
    totalEarnings: number;
    activeGigs: number;
    pendingPayouts: number;
    note: string;
  };
}

export function clearDashboardCache() {
  clearRequestCache("dashboard:");
}
