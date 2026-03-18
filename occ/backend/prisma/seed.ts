import bcrypt from "bcryptjs";
import { PrismaClient, type Prisma } from "@prisma/client";
import { env } from "../src/config/env";
import { slugify } from "../src/utils/slug";

const prisma = new PrismaClient();

async function main() {
  await prisma.adminActionLog.deleteMany();
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

  const passwordHash = await bcrypt.hash("Password@123", 10);
  const adminPasswordHash = await bcrypt.hash(env.adminPassword, 10);

  const seedUsers: Array<{
    email: string;
    role: Prisma.UserCreateInput["role"];
    displayName: string;
    university: string;
    bio: string;
    phoneNumber: string;
    hobbies: string;
    passwordHash: string;
  }> = [
    {
      email: env.adminEmail,
      role: "SUPER_ADMIN",
      displayName: "OCC Admin",
      university: "OCC Central",
      bio: "Platform administrator for OCC.",
      phoneNumber: "+91 90000 00001",
      hobbies: "Operations, mentoring, community building",
      passwordHash: adminPasswordHash
    },
    {
      email: "mira@occ.local",
      role: "CLUB_ADMIN",
      displayName: "Mira Patel",
      university: "IIT Bombay",
      bio: "Community builder and hackathon organizer.",
      phoneNumber: "+91 90000 00002",
      hobbies: "Hackathons, prototyping, design sprints",
      passwordHash
    },
    {
      email: "arjun@occ.local",
      role: "USER",
      displayName: "Arjun Nair",
      university: "Delhi University",
      bio: "Always looking for new student communities.",
      phoneNumber: "+91 90000 00003",
      hobbies: "Football, travel, meetups",
      passwordHash
    },
    {
      email: "sana@occ.local",
      role: "USER",
      displayName: "Sana Ahmed",
      university: "Christ University",
      bio: "Photography, design, and event planning.",
      phoneNumber: "+91 90000 00004",
      hobbies: "Photography, visual design, events",
      passwordHash
    }
  ];

  const users = await Promise.all(
    seedUsers.map((item) =>
      prisma.user.create({
        data: {
          email: item.email,
          role: item.role,
          status: "ACTIVE",
          isActive: true,
          passwordHash: item.passwordHash,
          profile: {
            create: {
              displayName: item.displayName,
              university: item.university,
              bio: item.bio,
              phoneNumber: item.phoneNumber,
              hobbies: item.hobbies
            }
          },
          settings: {
            create: {
              themePreference: "system",
              notificationPreferences: {
                email: true,
                push: true,
                product: false
              }
            }
          },
          privacy: {
            create: {
              profileVisibility: "PUBLIC",
              showUniversity: true,
              showClubMembership: true,
              postVisibilityDefault: "PUBLIC"
            }
          }
        }
      })
    )
  );

  const [adminUser, mira, arjun, sana] = users;

  const categories = await Promise.all(
    ["Tech", "Arts", "Sports", "Entrepreneurship"].map((name) =>
      prisma.category.create({
        data: {
          name,
          slug: slugify(name)
        }
      })
    )
  );

  const clubs = await Promise.all([
    prisma.club.create({
      data: {
        name: "City Builders Lab",
        slug: "city-builders-lab",
        description: "A practical community for urban prototyping, maker projects, and civic events.",
        categoryId: categories[0].id,
        university: "IIT Bombay",
        locationName: "Mumbai",
        visibility: "PUBLIC",
        ownerId: mira.id
      }
    }),
    prisma.club.create({
      data: {
        name: "Lens & Light Society",
        slug: "lens-light-society",
        description: "Photography walks, creative shoots, and portfolio reviews for students.",
        categoryId: categories[1].id,
        university: "Christ University",
        locationName: "Bengaluru",
        visibility: "PRIVATE",
        ownerId: sana.id
      }
    }),
    prisma.club.create({
      data: {
        name: "Weekend Football Circle",
        slug: "weekend-football-circle",
        description: "Friendly football sessions, community tournaments, and training meetups.",
        categoryId: categories[2].id,
        university: "Delhi University",
        locationName: "Delhi",
        visibility: "PUBLIC",
        ownerId: arjun.id
      }
    })
  ]);

  await prisma.clubMember.createMany({
    data: [
      { clubId: clubs[0].id, userId: mira.id, membershipRole: "OWNER" },
      { clubId: clubs[0].id, userId: arjun.id, membershipRole: "MEMBER" },
      { clubId: clubs[1].id, userId: sana.id, membershipRole: "OWNER" },
      { clubId: clubs[1].id, userId: mira.id, membershipRole: "ADMIN" },
      { clubId: clubs[2].id, userId: arjun.id, membershipRole: "OWNER" },
      { clubId: clubs[2].id, userId: sana.id, membershipRole: "MEMBER" }
    ]
  });

  await prisma.clubJoinRequest.createMany({
    data: [
      { clubId: clubs[1].id, userId: arjun.id, status: "PENDING" },
      { clubId: clubs[1].id, userId: adminUser.id, status: "REJECTED" }
    ]
  });

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: mira.id,
        clubId: clubs[0].id,
        content: "We are hosting a weekend prototyping sprint for student founders. Join us if you want to build something tangible.",
        visibility: "PUBLIC",
        moderationStatus: "PUBLISHED"
      }
    }),
    prisma.post.create({
      data: {
        authorId: arjun.id,
        clubId: clubs[2].id,
        content: "Open football practice this Saturday at 6 PM. Beginners are welcome and boots are optional.",
        visibility: "PUBLIC",
        moderationStatus: "PUBLISHED"
      }
    }),
    prisma.post.create({
      data: {
        authorId: sana.id,
        clubId: clubs[1].id,
        content: "We are planning a campus portrait walk with a limited group. Request access if you want in.",
        visibility: "CLUB",
        moderationStatus: "PUBLISHED"
      }
    })
  ]);

  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, authorId: arjun.id, content: "Count me in. I can help with rapid prototyping." },
      { postId: posts[1].id, authorId: sana.id, content: "I can cover the event with photos too." },
      { postId: posts[2].id, authorId: mira.id, content: "This sounds great. Let’s share the route later." }
    ]
  });

  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: arjun.id },
      { postId: posts[0].id, userId: sana.id },
      { postId: posts[1].id, userId: mira.id }
    ]
  });

  await prisma.share.createMany({
    data: [
      { postId: posts[0].id, userId: adminUser.id },
      { postId: posts[1].id, userId: sana.id }
    ]
  });

  await prisma.report.createMany({
    data: [
      {
        postId: posts[2].id,
        reporterId: adminUser.id,
        reason: "Needs moderation review",
        description: "Validate that access rules are clear before publishing wider.",
        status: "PENDING"
      }
    ]
  });
}

main()
  .then(() => {
    console.log("Seed completed successfully");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
