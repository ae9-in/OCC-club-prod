import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { assertSafeUploadedFiles, upload } from "../config/upload";
import { asyncHandler } from "../utils/asyncHandler";
import { successResponse } from "../utils/response";
import { fileToRelativeUrl } from "../utils/fileUrl";
import { HttpError } from "../lib/httpError";

const router = Router();

router.post(
  "/uploads/post-image",
  requireAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, "Image file is required");
    await assertSafeUploadedFiles(req.file);
    return successResponse(res, "Post image uploaded successfully", {
      file: {
        originalName: req.file.originalname,
        url: fileToRelativeUrl(req.file)
      }
    });
  })
);

router.post(
  "/uploads/club-logo",
  requireAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, "Image file is required");
    await assertSafeUploadedFiles(req.file);
    return successResponse(res, "Club logo uploaded successfully", {
      file: {
        originalName: req.file.originalname,
        url: fileToRelativeUrl(req.file)
      }
    });
  })
);

router.post(
  "/uploads/profile-image",
  requireAuth,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, "Image file is required");
    await assertSafeUploadedFiles(req.file);
    return successResponse(res, "Profile image uploaded successfully", {
      file: {
        originalName: req.file.originalname,
        url: fileToRelativeUrl(req.file)
      }
    });
  })
);

export default router;
