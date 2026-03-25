UPDATE "Club"
SET
  "approvalStatus" = 'APPROVED',
  "isActive" = true,
  "rejectionReason" = NULL,
  "reviewedAt" = COALESCE("reviewedAt", NOW())
WHERE "approvalStatus" IS DISTINCT FROM 'APPROVED'
   OR "isActive" IS DISTINCT FROM true;

DROP INDEX IF EXISTS "Club_approvalStatus_isVerified_isActive_idx";

CREATE INDEX IF NOT EXISTS "Club_approvalStatus_isActive_idx"
  ON "Club"("approvalStatus", "isActive");
