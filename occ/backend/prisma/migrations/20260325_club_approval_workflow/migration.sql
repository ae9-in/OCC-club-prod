-- Club moderation enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ClubApprovalStatus') THEN
    CREATE TYPE "ClubApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

-- Club moderation fields
ALTER TABLE "Club"
  ADD COLUMN IF NOT EXISTS "approvalStatus" "ClubApprovalStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "reviewedByAdminId" TEXT,
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

CREATE INDEX IF NOT EXISTS "Club_approvalStatus_isVerified_isActive_idx"
  ON "Club"("approvalStatus", "isVerified", "isActive");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Club_reviewedByAdminId_fkey'
  ) THEN
    ALTER TABLE "Club"
      ADD CONSTRAINT "Club_reviewedByAdminId_fkey"
      FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
