// @ts-nocheck
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";
import { serializeClub, serializeGigApplication, serializeGigProtected, serializeUser } from "../utils/serializers";

const router = Router();

router.get(
  "/me/applications",
  requireAuth,
  asyncHandler(async (req, res) => {
    const applications = await prisma.gigApplication.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: {
        gig: true,
        reviewedByAdmin: { include: { profile: true, settings: true, privacy: true } }
      }
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
    const [memberships, applications, createdClubs] = await Promise.all([
      prisma.clubMember.findMany({
        where: { userId: req.user!.id },
        orderBy: { joinedAt: "desc" },
        include: {
          club: {
            include: {
              category: true,
              owner: { include: { profile: true, settings: true, privacy: true } },
              members: { where: { userId: req.user!.id } },
              _count: { select: { members: true, posts: true, joinRequests: true } }
            }
          }
        }
      }),
      prisma.gigApplication.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: "desc" },
        include: {
          gig: true,
          reviewedByAdmin: { include: { profile: true, settings: true, privacy: true } }
        }
      }),
      prisma.club.findMany({
        where: { ownerId: req.user!.id },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          owner: { include: { profile: true, settings: true, privacy: true } },
          reviewedByAdmin: { include: { profile: true, settings: true, privacy: true } },
          members: { where: { userId: req.user!.id } },
          joinRequests: { where: { userId: req.user!.id } },
          _count: { select: { members: true, posts: true, joinRequests: true } }
        }
      })
    ]);

    const approvedGigs = applications
      .filter((application) => application.status === "APPROVED")
      .map((application) => application.gig)
      .filter(Boolean)
      .map((gig) => serializeGigProtected(gig));

    return successResponse(res, "Dashboard fetched successfully", {
      profile: serializeUser(req.user),
      joinedClubs: memberships.map((membership) => ({
        id: membership.id,
        membershipRole: membership.membershipRole,
        joinedAt: membership.joinedAt,
        club: serializeClub(membership.club, req.user!.id)
      })),
      applicationSummary: {
        total: applications.length,
        pending: applications.filter((application) => application.status === "PENDING").length,
        approved: applications.filter((application) => application.status === "APPROVED").length,
        rejected: applications.filter((application) => application.status === "REJECTED").length,
      },
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
