// @ts-nocheck
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { validate } from "../middleware/validate";
import { optionalAuth, requireAuth } from "../middleware/auth";
import { successResponse, paginatedResponse } from "../utils/response";
import { parsePagination } from "../utils/pagination";
import { HttpError } from "../lib/httpError";
import { serializeGigApplication, serializeGigProtected, serializeGigPublic } from "../utils/serializers";

const router = Router();
const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

const publicGigListSchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  category: z.string().max(80).optional(),
  q: z.string().max(120).optional()
});

const applicationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().trim().min(10).max(30),
  college: z.string().min(2).max(160),
  reason: z.string().trim().min(2).max(2000).refine((value) => countWords(value) <= 10, {
    message: "Reason for applying must be 10 words or fewer",
  }),
  relevantExperience: z.string().max(2000).optional().nullable()
});

async function resolveGig(identifier: string) {
  const gig = await prisma.gig.findFirst({
    where: {
      OR: [{ id: identifier }, { slug: identifier }]
    }
  });

  if (!gig) {
    throw new HttpError(404, "Gig not found");
  }

  return gig;
}

async function ensureApprovedGigAccess(gigId: string, userId: string) {
  const application = await prisma.gigApplication.findFirst({
    where: {
      gigId,
      userId,
      status: "APPROVED"
    }
  });

  if (!application) {
    throw new HttpError(403, "Your application has not been approved for this gig");
  }
}

router.get(
  "/gigs",
  optionalAuth,
  validate(publicGigListSchema, "query"),
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query as Record<string, unknown>);
    const where = {
      isActive: true,
      isPublic: true,
      ...(req.query.category ? { category: String(req.query.category) } : {}),
      ...(req.query.q
        ? {
            OR: [
              { title: { contains: String(req.query.q), mode: "insensitive" as const } },
              { shortDescription: { contains: String(req.query.q), mode: "insensitive" as const } },
              { category: { contains: String(req.query.q), mode: "insensitive" as const } }
            ]
          }
        : {})
    };

    const [total, gigs] = await Promise.all([
      prisma.gig.count({ where }),
      prisma.gig.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { applications: true }
          }
        }
      })
    ]);

    return paginatedResponse(
      res,
      gigs.map((gig) => serializeGigPublic(gig)),
      page,
      limit,
      total,
      "Gigs fetched successfully"
    );
  })
);

router.get(
  "/gigs/:slug/public",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const gig = await prisma.gig.findFirst({
      where: {
        OR: [{ id: req.params.slug }, { slug: req.params.slug }],
        isActive: true,
        isPublic: true
      },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!gig) {
      throw new HttpError(404, "Gig not found");
    }

    return successResponse(res, "Gig preview fetched successfully", {
      gig: serializeGigPublic(gig)
    });
  })
);

router.get(
  "/gigs/:slug/protected",
  requireAuth,
  asyncHandler(async (req, res) => {
    const gig = await resolveGig(req.params.slug);
    await ensureApprovedGigAccess(gig.id, req.user!.id);

    const hydratedGig = await prisma.gig.findUnique({
      where: { id: gig.id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    return successResponse(res, "Protected gig details fetched successfully", {
      gig: serializeGigProtected(hydratedGig)
    });
  })
);

router.post(
  "/gigs/:id/apply",
  requireAuth,
  validate(applicationSchema),
  asyncHandler(async (req, res) => {
    const gig = await prisma.gig.findUnique({
      where: { id: req.params.id }
    });

    if (!gig || !gig.isActive || !gig.isPublic) {
      throw new HttpError(404, "Gig not found");
    }

    const existingApplication = await prisma.gigApplication.findFirst({
      where: {
        gigId: gig.id,
        OR: [{ userId: req.user!.id }, { email: req.user!.email }]
      }
    });

    if (existingApplication) {
      throw new HttpError(409, "You have already applied for this gig");
    }

    const application = await prisma.gigApplication.create({
      data: {
        userId: req.user!.id,
        gigId: gig.id,
        name: req.user!.profile?.displayName || req.body.name,
        email: req.user!.email,
        phone: req.user!.profile?.phoneNumber || req.body.phone,
        college: req.user!.profile?.university || req.body.college,
        reason: req.body.reason,
        relevantExperience: req.body.relevantExperience || null,
        status: "PENDING"
      },
      include: {
        gig: true
      }
    });

    return successResponse(
      res,
      "Application submitted successfully",
      { application: serializeGigApplication(application) },
      201
    );
  })
);

export default router;
