import type { Response } from "express";

export function successResponse<T>(res: Response, message: string, data: T, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function paginatedResponse<T>(
  res: Response,
  items: T[],
  page: number,
  limit: number,
  total: number,
  message = "Operation successful"
) {
  return res.json({
    success: true,
    message,
    data: {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}
