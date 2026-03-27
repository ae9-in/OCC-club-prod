// @ts-nocheck
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";
import { serializeClub, serializeGigApplication, serializeGigProtected, serializeUser } from "../utils/serializers";

const router = Router();

const dashboardClubSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  university: true,
  locationName: true,
  latitude: true,
  longitude: true,
  logoUrl: true,
  bannerUrl: true,
  visibility: true,
  isActive: true,
  approvalStatus: true,
  reviewedAt: true,
  rejectionReason: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  category: true,
  owner: {
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      privacy: true,
      passwordHash: true,
    }
  },
  reviewedByAdmin: {
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
      privacy: true,
      passwordHash: true,
    }
  },
  members: true,
  joinRequests: true,
  _count: { select: { members: true, posts: true, joinRequests: true } }
} as const;

const dashboardApplicationSelect = {
  id: true,
  userId: true,
  gigId: true,
  name: true,
  email: true,
  phone: true,
  college: true,
  reason: true,
  relevantExperience: true,
  status: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
  gig: {
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      fullDescription: true,
      category: true,
      pricing: true,
      instructions: true,
      requirements: true,
      bannerUrl: true,
      isActive: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    }
  },
  reviewedByAdmin: {
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      profile: {
        select: {
          id: true,
          userId: true,
          displayName: true,
          bio: true,
          university: true,
          phoneNumber: true,
          hobbies: true,
          avatarUrl: true,
          coverUrl: true,
          createdAt: true,
          updatedAt: true,
        }
      },
      privacy: true,
      passwordHash: true,
    }
  }
} as const;

router.get(
  "/me/applications",
  requireAuth,
  asyncHandler(async (req, res) => {
    const applications = await prisma.gigApplication.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      select: dashboardApplicationSelect
    });

    return successResponse(res, "Applications fetched successfully", {
      items: applications.map((application) =>
        serializeGigApplication(application, {
          includeReviewedByAdmin: true
        })
      )
    });
  })
);

router.get(
  "/me/dashboard",
  requireAuth,
  asyncHandler(async (req, res) => {
    const [memberships, applications, createdClubs, applicationStatusCounts] = await Promise.all([
      prisma.clubMember.findMany({
        where: { userId: req.user!.id },
        orderBy: { joinedAt: "desc" },
        select: {
          id: true,
          membershipRole: true,
          joinedAt: true,
          club: {
            select: {
              ...dashboardClubSelect,
              members: { where: { userId: req.user!.id } },
            }
          }
        }
      }),
      prisma.gigApplication.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        select: dashboardApplicationSelect
      }),
      prisma.club.findMany({
        where: { ownerId: req.user!.id },
        orderBy: { createdAt: "desc" },
        select: {
          ...dashboardClubSelect,
          members: { where: { userId: req.user!.id } },
          joinRequests: { where: { userId: req.user!.id } },
        }
      }),
      prisma.gigApplication.groupBy({
        by: ["status"],
        where: { userId: req.user!.id },
        _count: { _all: true }
      })
    ]);

    const approvedGigs = applications
      .filter((application) => application.status === "APPROVED")
      .map((application) => application.gig)
      .filter(Boolean)
      .map((gig) => serializeGigProtected(gig));

    const applicationSummary = applicationStatusCounts.reduce(
      (acc, item) => {
        acc.total += item._count._all;
        if (item.status === "PENDING") acc.pending = item._count._all;
        if (item.status === "APPROVED") acc.approved = item._count._all;
        if (item.status === "REJECTED") acc.rejected = item._count._all;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0 }
    );

    return successResponse(res, "Dashboard fetched successfully", {
      profile: serializeUser(req.user),
      joinedClubs: memberships.map((membership) => ({
        id: membership.id,
        membershipRole: membership.membershipRole,
        joinedAt: membership.joinedAt,
        club: serializeClub(membership.club, req.user!.id)
      })),
      applicationSummary,
      applications: applications.map((application) =>
        serializeGigApplication(application, {
          includeReviewedByAdmin: true
        })
      ),
      createdClubs: createdClubs.map((club) => serializeClub(club, req.user!.id)),
      approvedGigs,
      activity: {
        postsPlaceholder: [],
        earningsSummary: {
          totalEarnings: 0,
          activeGigs: approvedGigs.length,
          completedPayouts: 0,
          note: "Earnings logic is scaffolded and protected for future expansion."
        }
      }
    });
  })
);

router.get(
  "/me/earnings",
  requireAuth,
  asyncHandler(async (req, res) => {
    const approvedCount = await prisma.gigApplication.count({
      where: {
        userId: req.user!.id,
        status: "APPROVED"
      }
    });

    return successResponse(res, "Earnings summary fetched successfully", {
      summary: {
        totalEarnings: 0,
        activeGigs: approvedCount,
        pendingPayouts: 0,
        note: "Detailed earnings and payouts will plug into this protected endpoint later."
      }
    });
  })
);

export default router;
