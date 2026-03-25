-- Add club activation state
ALTER TABLE "Club" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Gig application status enum
CREATE TYPE "GigApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Gigs
CREATE TABLE "Gig" (
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

CREATE UNIQUE INDEX "Gig_slug_key" ON "Gig"("slug");
CREATE INDEX "Gig_slug_idx" ON "Gig"("slug");
CREATE INDEX "Gig_category_idx" ON "Gig"("category");
CREATE INDEX "Gig_isActive_isPublic_idx" ON "Gig"("isActive", "isPublic");

-- Gig applications
CREATE TABLE "GigApplication" (
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

CREATE UNIQUE INDEX "GigApplication_userId_gigId_key" ON "GigApplication"("userId", "gigId");
CREATE INDEX "GigApplication_gigId_status_idx" ON "GigApplication"("gigId", "status");
CREATE INDEX "GigApplication_userId_status_idx" ON "GigApplication"("userId", "status");
CREATE INDEX "GigApplication_email_gigId_idx" ON "GigApplication"("email", "gigId");

ALTER TABLE "GigApplication"
  ADD CONSTRAINT "GigApplication_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GigApplication"
  ADD CONSTRAINT "GigApplication_gigId_fkey"
  FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GigApplication"
  ADD CONSTRAINT "GigApplication_reviewedByAdminId_fkey"
  FOREIGN KEY ("reviewedByAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
