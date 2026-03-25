import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath) {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing expected file: ${relativePath}`);
}

[
  "app/page.tsx",
  "app/about/page.tsx",
  "app/feed/page.tsx",
  "app/feeds/page.tsx",
  "app/clubs/page.tsx",
  "app/clubs/[id]/page.tsx",
  "app/gigs/page.tsx",
  "app/gigs/[slug]/page.tsx",
  "app/gigs/[slug]/apply/page.tsx",
  "app/dashboard/page.tsx",
  "app/occ-gate-842/page.tsx",
  "app/login/page.tsx",
  "app/register/page.tsx",
  "lib/safeRedirect.ts",
].forEach(exists);

const aboutContent = read("components/AboutPageContent.tsx");
assert.match(aboutContent, /About OCC/);
assert.match(aboutContent, /Join OCC/);
assert.match(aboutContent, /href="\/gigs"/);

const heroContent = read("components/EnhancedHero.tsx");
assert.match(heroContent, /Find Out More/);
assert.match(heroContent, /"\/about"/);

const dashboardContent = read("app/dashboard/page.tsx");
assert.match(dashboardContent, /AdminPage/);
assert.match(dashboardContent, /UserDashboard/);
assert.match(dashboardContent, /SUPER_ADMIN/);
assert.match(dashboardContent, /PLATFORM_ADMIN/);

const adminContent = read("app/occ-gate-842/page.tsx");
assert.match(adminContent, /Applications Review Workspace/);
assert.match(adminContent, /Club Approval Queue/);
assert.match(adminContent, /Approve/);
assert.match(adminContent, /Reject/);
assert.doesNotMatch(adminContent, /Verified Club|Verified\b|verified club/i);

const userDashboardContent = read("components/UserDashboard.tsx");
assert.match(userDashboardContent, /Approval Status/);
assert.match(userDashboardContent, /Unlocked Approved Gigs/);
assert.match(userDashboardContent, /My Created Clubs/);
assert.match(userDashboardContent, /Approved \/ Public/);
assert.doesNotMatch(userDashboardContent, /Verified Club|Verified \/ Public|approved and verified/i);

const applyPageContent = read("app/gigs/[slug]/apply/page.tsx");
assert.match(applyPageContent, /Reason for applying|Reason/);

const safeRedirectContent = read("lib/safeRedirect.ts");
assert.match(safeRedirectContent, /trimmed\.startsWith\(\"\/\"\)/);
assert.match(safeRedirectContent, /trimmed\.startsWith\(\"\/\/\"\)/);

const clubModalContent = read("components/ClubFormModal.tsx");
assert.match(clubModalContent, /Submit For Review/);

const clubsDirectoryContent = read("components/ClubsDirectoryPage.tsx");
assert.match(clubsDirectoryContent, /Approved Clubs/);
assert.doesNotMatch(clubsDirectoryContent, /Verified Clubs|verified clubs/i);

const clubCardContent = read("components/ClubCard.tsx");
assert.doesNotMatch(clubCardContent, /Verified Club|verified club/i);

const clubDetailContent = read("app/clubs/[id]/page.tsx");
assert.match(clubDetailContent, /APPROVED|PENDING|REJECTED/);
assert.doesNotMatch(clubDetailContent, /Verified Club|verified club/i);

console.log("Frontend route and workflow smoke tests passed.");
