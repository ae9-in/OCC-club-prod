CREATE INDEX IF NOT EXISTS "Club_approvalStatus_createdAt_idx"
  ON "Club"("approvalStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "GigApplication_status_createdAt_idx"
  ON "GigApplication"("status", "createdAt");

CREATE INDEX IF NOT EXISTS "ClubJoinRequest_clubId_status_idx"
  ON "ClubJoinRequest"("clubId", "status");

CREATE INDEX IF NOT EXISTS "Post_moderationStatus_deletedAt_createdAt_idx"
  ON "Post"("moderationStatus", "deletedAt", "createdAt");

CREATE INDEX IF NOT EXISTS "Post_clubId_deletedAt_moderationStatus_createdAt_idx"
  ON "Post"("clubId", "deletedAt", "moderationStatus", "createdAt");

CREATE INDEX IF NOT EXISTS "Report_status_createdAt_idx"
  ON "Report"("status", "createdAt");
