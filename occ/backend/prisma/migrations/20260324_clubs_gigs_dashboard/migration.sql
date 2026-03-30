-- Add club activation state
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Gig application status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GigApplicationStatus') THEN
    CREATE TYPE "GigApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

-- Gigs
CREATE TABLE IF NOT EXISTS "Gig" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "pricing" TEXT,
  "instructions" TEXT,
  "requirements" TEXT,
  "bannerUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Gig_slug_key" ON "Gig"("slug");
CREATE INDEX IF NOT EXISTS "Gig_slug_idx" ON "Gig"("slug");
CREATE INDEX IF NOT EXISTS "Gig_category_idx" ON "Gig"("category");
CREATE INDEX IF NOT EXISTS "Gig_isActive_isPublic_idx" ON "Gig"("isActive", "isPublic");

-- Gig applications
CREATE TABLE IF NOT EXISTS "GigApplication" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "gigId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "college" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "relevantExperience" TEXT,
  "status" "GigApplicationStatus" NOT NULL DEFAULT 'PENDING',
  "reviewedByAdminId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GigApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "GigApplication_userId_gigId_key" ON "GigApplication"("userId", "gigId");
CREATE INDEX IF NOT EXISTS "GigApplication_gigId_status_idx" ON "GigApplication"("gigId", "status");
CREATE INDEX IF NOT EXISTS "GigApplication_userId_status_idx" ON "GigApplication"("userId", "status");
CREATE INDEX IF NOT EXISTS "GigApplication_email_gigId_idx" ON "GigApplication"("email", "gigId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GigApplication_userId_fkey'
  ) THEN
    ALTER TABLE "GigApplication"
      ADD CONSTRAINT "GigApplication_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GigApplication_gigId_fkey'
  ) THEN
    ALTER TABLE "GigApplication"
      ADD CONSTRAINT "GigApplication_gigId_fkey"
      FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GigApplication_reviewedByAdminId_fkey'
  ) THEN
    ALTER TABLE "GigApplication"
      ADD CONSTRAINT "GigApplication_reviewedByAdminId_fkey"
      FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
