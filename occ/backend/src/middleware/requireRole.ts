import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { HttpError } from "../lib/httpError";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}

export const requireAdmin = requireRole("PLATFORM_ADMIN", "SUPER_ADMIN");

export function requireOwnershipOrAdmin(getOwnerId: (req: Request) => Promise<string | null>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required"));
    }
    if (["PLATFORM_ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
      return next();
    }
    const ownerId = await getOwnerId(req);
    if (!ownerId) {
      return next(new HttpError(404, "Resource not found"));
    }
    if (ownerId !== req.user.id) {
      return next(new HttpError(403, "You do not have permission to perform this action"));
    }
    next();
  };
}

export async function getClubAccess(clubId: string, userId: string) {
  const club = await prisma.club.findUnique({
    where: { id: clubId },
    include: {
      members: {
        where: { userId }
      }
    }
  });

  if (!club) {
    throw new HttpError(404, "Club not found");
  }

  const membership = club.members[0] || null;
  const isOwner = club.ownerId === userId;
  const isClubAdmin = membership ? ["OWNER", "ADMIN"].includes(membership.membershipRole) : false;

  return {
    club,
    membership,
    isOwner,
    isClubAdmin
  };
}
