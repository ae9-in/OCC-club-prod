const assert = require("node:assert/strict");
const { serializeClub, serializeGigApplication, serializeUser } = require("../dist/utils/serializers.js");

const baseGig = {
  id: "gig_1",
  title: "Campus Sprint",
  slug: "campus-sprint",
  shortDescription: "Public preview",
  fullDescription: "Restricted full brief",
  category: "Creative",
  pricing: "Rs. 5000",
  instructions: "Restricted instructions",
  requirements: "Restricted requirements",
  bannerUrl: null,
  isActive: true,
  isPublic: true,
  createdAt: new Date("2026-03-01T00:00:00.000Z"),
  updatedAt: new Date("2026-03-01T00:00:00.000Z"),
};

const safeApplication = serializeGigApplication({
  id: "app_1",
  userId: "user_1",
  gigId: "gig_1",
  name: "Test User",
  email: "user@example.com",
  phone: "9999999999",
  college: "OCC College",
  reason: "I am a strong fit for this opportunity.",
  relevantExperience: null,
  status: "PENDING",
  reviewedByAdminId: null,
  reviewedAt: null,
  createdAt: new Date("2026-03-02T00:00:00.000Z"),
  updatedAt: new Date("2026-03-02T00:00:00.000Z"),
  gig: baseGig,
});

assert.equal(safeApplication?.gig?.title, "Campus Sprint");
assert.equal("fullDescription" in (safeApplication?.gig || {}), false);
assert.equal("pricing" in (safeApplication?.gig || {}), false);
assert.equal("instructions" in (safeApplication?.gig || {}), false);
assert.equal("requirements" in (safeApplication?.gig || {}), false);

const protectedApplication = serializeGigApplication(
  {
    id: "app_2",
    userId: "user_1",
    gigId: "gig_1",
    name: "Test User",
    email: "user@example.com",
    phone: "9999999999",
    college: "OCC College",
    reason: "I am a strong fit for this opportunity.",
    relevantExperience: null,
    status: "APPROVED",
    reviewedByAdminId: null,
    reviewedAt: null,
    createdAt: new Date("2026-03-02T00:00:00.000Z"),
    updatedAt: new Date("2026-03-02T00:00:00.000Z"),
    gig: baseGig,
  },
  { includeProtectedGig: true },
);

assert.equal(protectedApplication?.gig?.fullDescription, "Restricted full brief");
assert.equal(protectedApplication?.gig?.pricing, "Rs. 5000");

const publicUser = serializeUser(
  {
    id: "user_1",
    email: "user@example.com",
    passwordHash: "hash",
    role: "USER",
    status: "ACTIVE",
    isActive: true,
    createdAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-01T00:00:00.000Z"),
    profile: null,
    settings: null,
    privacy: null,
  },
  "public",
);

assert.equal(publicUser?.email, undefined);
assert.equal(publicUser?.role, undefined);
assert.equal(publicUser?.status, undefined);
assert.equal(publicUser?.isActive, undefined);

const reviewerUser = {
  id: "admin_1",
  email: "admin@example.com",
  passwordHash: "hash",
  role: "SUPER_ADMIN",
  status: "ACTIVE",
  isActive: true,
  createdAt: new Date("2026-03-01T00:00:00.000Z"),
  updatedAt: new Date("2026-03-01T00:00:00.000Z"),
  profile: {
    id: "profile_admin",
    userId: "admin_1",
    displayName: "Admin OCC",
    bio: "Platform admin",
    university: "OCC HQ",
    phoneNumber: "8888888888",
    hobbies: "Reviewing",
    avatarUrl: null,
    coverUrl: null,
    createdAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-01T00:00:00.000Z"),
  },
  settings: null,
  privacy: null,
};

const applicantUser = {
  id: "user_2",
  email: "applicant@example.com",
  passwordHash: "hash",
  role: "USER",
  status: "ACTIVE",
  isActive: true,
  createdAt: new Date("2026-03-01T00:00:00.000Z"),
  updatedAt: new Date("2026-03-01T00:00:00.000Z"),
  profile: {
    id: "profile_user",
    userId: "user_2",
    displayName: "Aarav Sharma",
    bio: "Student creator",
    university: "Delhi University",
    phoneNumber: "9999999999",
    hobbies: "Design, editing",
    avatarUrl: null,
    coverUrl: null,
    createdAt: new Date("2026-03-01T00:00:00.000Z"),
    updatedAt: new Date("2026-03-02T00:00:00.000Z"),
  },
  settings: null,
  privacy: null,
};

const hydratedApplication = serializeGigApplication(
  {
    id: "app_3",
    userId: "user_2",
    gigId: "gig_1",
    name: "Aarav Sharma",
    email: "applicant@example.com",
    phone: "9999999999",
    college: "Delhi University",
    reason: "I can ship quickly.",
    relevantExperience: "Managed two campus productions.",
    status: "APPROVED",
    reviewedByAdminId: "admin_1",
    reviewedAt: new Date("2026-03-03T00:00:00.000Z"),
    createdAt: new Date("2026-03-02T00:00:00.000Z"),
    updatedAt: new Date("2026-03-03T00:00:00.000Z"),
    gig: baseGig,
    user: applicantUser,
    reviewedByAdmin: reviewerUser,
  },
  { includeProtectedGig: true, includeUser: true, includeReviewedByAdmin: true },
);

assert.equal(hydratedApplication?.status, "APPROVED");
assert.equal(hydratedApplication?.user?.profile?.displayName, "Aarav Sharma");
assert.equal(hydratedApplication?.user?.profile?.phoneNumber, "9999999999");
assert.equal(hydratedApplication?.user?.profile?.bio, "Student creator");
assert.equal(hydratedApplication?.reviewedByAdmin?.profile?.displayName, "Admin OCC");
assert.equal(hydratedApplication?.gig?.fullDescription, "Restricted full brief");

const pendingClub = serializeClub({
  id: "club_1",
  name: "Startup Circle",
  slug: "startup-circle",
  description: "Founders building in stealth.",
  categoryId: null,
  university: "Delhi University",
  locationName: "North Campus",
  latitude: null,
  longitude: null,
  logoUrl: null,
  bannerUrl: null,
  visibility: "PUBLIC",
  isActive: false,
  approvalStatus: "PENDING",
  ownerId: "user_2",
  reviewedAt: null,
  reviewedByAdminId: null,
  rejectionReason: null,
  createdAt: new Date("2026-03-04T00:00:00.000Z"),
  updatedAt: new Date("2026-03-04T00:00:00.000Z"),
  owner: applicantUser,
  reviewedByAdmin: null,
  members: [{ id: "membership_1", clubId: "club_1", userId: "user_2", membershipRole: "OWNER", joinedAt: new Date("2026-03-04T00:00:00.000Z") }],
  joinRequests: [],
  _count: { members: 1, posts: 0, joinRequests: 0 },
}, "user_2");

assert.equal(pendingClub?.approvalStatus, "PENDING");
assert.equal(pendingClub?.canJoin, false);
assert.equal(pendingClub?.canPost, false);
assert.equal("isVerified" in (pendingClub || {}), false);

const approvedClub = serializeClub({
  id: "club_2",
  name: "Approved Circle",
  slug: "approved-circle",
  description: "Already approved.",
  categoryId: null,
  university: "Delhi University",
  locationName: "South Campus",
  latitude: null,
  longitude: null,
  logoUrl: null,
  bannerUrl: null,
  visibility: "PUBLIC",
  isActive: true,
  approvalStatus: "APPROVED",
  ownerId: "user_2",
  reviewedAt: new Date("2026-03-05T00:00:00.000Z"),
  reviewedByAdminId: "admin_1",
  rejectionReason: null,
  createdAt: new Date("2026-03-04T00:00:00.000Z"),
  updatedAt: new Date("2026-03-05T00:00:00.000Z"),
  owner: applicantUser,
  reviewedByAdmin: reviewerUser,
  members: [{ id: "membership_2", clubId: "club_2", userId: "user_2", membershipRole: "OWNER", joinedAt: new Date("2026-03-04T00:00:00.000Z") }],
  joinRequests: [],
  _count: { members: 1, posts: 0, joinRequests: 0 },
}, null);

assert.equal(approvedClub?.approvalStatus, "APPROVED");
assert.equal(approvedClub?.reviewedByAdmin?.profile?.displayName, "Admin OCC");
assert.equal(approvedClub?.canJoin, true);
assert.equal("isVerified" in (approvedClub || {}), false);

const rejectedClub = serializeClub({
  id: "club_3",
  name: "Rejected Circle",
  slug: "rejected-circle",
  description: "Not approved.",
  categoryId: null,
  university: "Delhi University",
  locationName: "West Campus",
  latitude: null,
  longitude: null,
  logoUrl: null,
  bannerUrl: null,
  visibility: "PUBLIC",
  isActive: false,
  approvalStatus: "REJECTED",
  ownerId: "user_2",
  reviewedAt: new Date("2026-03-06T00:00:00.000Z"),
  reviewedByAdminId: "admin_1",
  rejectionReason: "Insufficient details",
  createdAt: new Date("2026-03-04T00:00:00.000Z"),
  updatedAt: new Date("2026-03-06T00:00:00.000Z"),
  owner: applicantUser,
  reviewedByAdmin: reviewerUser,
  members: [{ id: "membership_3", clubId: "club_3", userId: "user_2", membershipRole: "OWNER", joinedAt: new Date("2026-03-04T00:00:00.000Z") }],
  joinRequests: [],
  _count: { members: 1, posts: 0, joinRequests: 0 },
}, null);

assert.equal(rejectedClub?.approvalStatus, "REJECTED");
assert.equal(rejectedClub?.canJoin, false);
assert.equal(rejectedClub?.canPost, false);
assert.equal(rejectedClub?.rejectionReason, "Insufficient details");

console.log("Backend serializer smoke tests passed.");
