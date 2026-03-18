import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyAccessToken } from "../lib/tokens";
import { HttpError } from "../lib/httpError";

async function attachUser(req: Request, token: string | null, required = false) {
  if (!token) {
    if (required) throw new HttpError(401, "Authentication required");
    return null;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        profile: true,
        settings: true,
        privacy: true
      }
    });

    if (!user || !user.isActive || user.status === "BANNED") {
      throw new HttpError(401, "Account is not allowed to access this resource");
    }

    req.user = user;
    return user;
  } catch (error) {
    if (required && error instanceof HttpError) throw error;
    if (required) throw new HttpError(401, "Invalid or expired token");
    return null;
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  attachUser(req, token, false).then(() => next()).catch(next);
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  attachUser(req, token, true).then(() => next()).catch(next);
}
