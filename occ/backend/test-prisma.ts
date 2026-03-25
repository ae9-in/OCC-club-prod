import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.post.count({
      where: {
        deletedAt: null,
        moderationStatus: "PUBLISHED",
        OR: [
          {
            clubId: null,
            visibility: "PUBLIC"
          },
          {
            visibility: "PUBLIC",
            club: {
              is: {
                visibility: "PUBLIC",
                isActive: true,
                approvalStatus: "APPROVED"
              }
            }
          }
        ]
      }
    });
    console.log("Count:", count);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
