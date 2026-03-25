-- Club moderation enum
CREATE TYPE "ClubApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Club moderation fields
ALTER TABLE "Club"
  ADD COLUMN "approvalStatus" "ClubApprovalStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewedByAdminId" TEXT,
  ADD COLUMN "rejectionReason" TEXT;

CREATE INDEX "Club_approvalStatus_isVerified_isActive_idx"
  ON "Club"("approvalStatus", "isVerified", "isActive");

ALTER TABLE "Club"
  ADD CONSTRAINT "Club_reviewedByAdminId_fkey"
  FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
