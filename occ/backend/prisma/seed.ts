import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/config/env";

const prisma = new PrismaClient();

async function main() {
  await prisma.adminActionLog.deleteMany();
  await prisma.gigApplication.deleteMany();
  await prisma.gig.deleteMany();
  await prisma.report.deleteMany();
  await prisma.share.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.clubJoinRequest.deleteMany();
  await prisma.clubMember.deleteMany();
  await prisma.club.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.privacySetting.deleteMany();
  await prisma.userSetting.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash(env.adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: env.adminEmail,
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      isActive: true,
      profile: {
        create: {
          displayName: "OCC Admin",
          bio: "Platform administrator for OCC.",
        },
      },
      settings: {
        create: {
          themePreference: "system",
          notificationPreferences: {
            email: true,
            push: true,
            product: false,
          },
        },
      },
      privacy: {
        create: {
          profileVisibility: "PUBLIC",
          showUniversity: true,
          showClubMembership: true,
          postVisibilityDefault: "PUBLIC",
        },
      },
    },
  });

  const seedClubs = [
    {
      name: "Bikers Club",
      slug: "bikers-club",
      description: "Weekend rides, route planning, and rider meetups for students who love the road.",
      bannerUrl: "https://images.unsplash.com/photo-1508973379184-7517410fb0f7?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Music Club",
      slug: "music-club",
      description: "Jam sessions, open mics, and collaborations for singers, producers, and instrumentalists.",
      bannerUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Photography Club",
      slug: "photography-club",
      description: "Photo walks, editing critiques, and storytelling through lenses across campus and beyond.",
      bannerUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Fashion Club",
      slug: "fashion-club",
      description: "Style labs, lookbooks, shoots, and creative direction for students shaping culture visually.",
      bannerUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Sports Club",
      slug: "sports-club",
      description: "Train, compete, and connect through multisport sessions, rec leagues, and club events.",
      bannerUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Football Club",
      slug: "football-club",
      description: "Five-a-side scrims, match analysis, and football culture for players and fans alike.",
      bannerUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
    {
      name: "Fitness Club",
      slug: "fitness-club",
      description: "Workouts, accountability squads, wellness sessions, and routines that keep students moving.",
      bannerUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
      visibility: "PUBLIC" as const,
      ownerId: admin.id,
    },
  ];

  for (const clubData of seedClubs) {
    const club = await prisma.club.create({
      data: clubData,
    });

    await prisma.clubMember.create({
      data: {
        clubId: club.id,
        userId: admin.id,
        membershipRole: "OWNER",
      },
    });
  }

  await prisma.gig.createMany({
    data: [
      {
        title: "Competitions",
        slug: "competitions",
        shortDescription: "Earn prize money through hackathons, pitch competitions, and campus challenges.",
        fullDescription: "Work with OCC to source, shortlist, and coordinate student participation across competitions that reward performance and execution.",
        category: "Competitions",
        pricing: "Prize pool details unlock after approval",
        instructions: "Approved applicants will receive active briefs, participation rules, and the competition calendar.",
        requirements: "Strong communication, event readiness, and the ability to move fast on submission timelines.",
        bannerUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Crescentia + Private Tuitions",
        slug: "crescentia-private-tuitions",
        shortDescription: "Monetize your knowledge by tutoring and mentoring students.",
        fullDescription: "Deliver structured tutoring, mentoring support, and student enablement through OCC-led learning formats and private tuition demand.",
        category: "Tutoring",
        pricing: "Tutoring rate details unlock after approval",
        instructions: "Approved applicants will receive subject demand, onboarding guidance, and tutoring operations workflows.",
        requirements: "Clear subject expertise, communication confidence, and consistency for recurring sessions.",
        bannerUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Hiring",
        slug: "hiring",
        shortDescription: "Earn referral rewards by connecting candidates with companies.",
        fullDescription: "Support candidate discovery, outreach, and matching for partner opportunities where student networks create recruiting leverage.",
        category: "Hiring",
        pricing: "Referral payout details unlock after approval",
        instructions: "Approved applicants will receive hiring briefs, referral criteria, and candidate handling guidelines.",
        requirements: "Strong people instincts, outreach confidence, and comfort with basic screening coordination.",
        bannerUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Training",
        slug: "training",
        shortDescription: "Host workshops, bootcamps, and skill development sessions.",
        fullDescription: "Lead or support learning sessions for students and communities across workshop-led, cohort-based, and event-driven training formats.",
        category: "Training",
        pricing: "Workshop payout details unlock after approval",
        instructions: "Approved applicants will receive session formats, curriculum expectations, and audience context.",
        requirements: "Teaching ability, workshop structure, and a practical understanding of your topic area.",
        bannerUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Shop Community",
        slug: "shop-community",
        shortDescription: "Sell products, merchandise, and digital assets to students.",
        fullDescription: "Launch, operate, or support commerce-led opportunities around student merchandise, digital products, and campus-targeted offerings.",
        category: "Commerce",
        pricing: "Commerce payout details unlock after approval",
        instructions: "Approved applicants will receive seller workflows, quality expectations, and operating guardrails.",
        requirements: "Product sense, execution discipline, and the ability to handle orders or digital delivery cleanly.",
        bannerUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Ace It Up",
        slug: "ace-it-up",
        shortDescription: "Offer skill improvement and career development services.",
        fullDescription: "Help students improve resumes, interviews, applications, and personal performance through focused career support services.",
        category: "Career Services",
        pricing: "Service payout details unlock after approval",
        instructions: "Approved applicants will receive service scope, quality standards, and delivery expectations.",
        requirements: "Strong communication, review ability, and a proven understanding of student career growth.",
        bannerUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Etiquette",
        slug: "etiquette",
        shortDescription: "Refer companies for compliance and workplace training programs.",
        fullDescription: "Drive introductions and referrals into workplace etiquette, compliance, and culture training programs where student-led access creates value.",
        category: "Compliance",
        pricing: "Commission details unlock after approval",
        instructions: "Approved applicants will receive offer positioning, program context, and referral routing steps.",
        requirements: "Professional communication, trust-based outreach, and comfort positioning training-led solutions.",
        bannerUrl: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
      {
        title: "Business Psychology",
        slug: "business-psychology",
        shortDescription: "Teach behavioral economics and marketing psychology concepts.",
        fullDescription: "Develop and deliver applied psychology learning around persuasion, decision-making, and behavioral insight in business settings.",
        category: "Business Psychology",
        pricing: "Session payout details unlock after approval",
        instructions: "Approved applicants will receive learner context, session format expectations, and knowledge delivery notes.",
        requirements: "Comfort teaching advanced concepts clearly with practical examples and applied frameworks.",
        bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        isActive: true,
        isPublic: true,
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed completed successfully with admin-only data");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
