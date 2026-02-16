import bcrypt from "bcrypt";
import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // 1. Create Roles
  const roles = ["SUPER_ADMIN", "ADMIN", "USER"];

  for (const roleName of roles) {
    const _role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `Role for ${roleName.toLowerCase().replace("_", " ")}`,
      },
    });
    console.log(`✅ Role ${roleName} ensured`);
  }

  // 2. Create Super Admin User
  const superAdminEmail = "superadmin@groom.com";
  const superAdminPassword = "SuperAdmin123!"; // CHANGE THIS IN PRODUCTION
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

  // Check if user exists first to avoid upsert complexity with nested writes
  let user = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        profile: {
          create: {
            name: "Super Admin",
            bio: "System Administrator",
          },
        },
        roles: {
          connect: { name: "SUPER_ADMIN" },
        },
      },
    });
    console.log(`✅ Super Admin user created: ${superAdminEmail}`);
  } else {
    // Ensure role connection if user exists
    await prisma.user.update({
      where: { id: user.id },
      data: {
        roles: {
          connect: { name: "SUPER_ADMIN" },
        },
      },
    });
    console.log(`✅ Super Admin user updated: ${superAdminEmail}`);
  }

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
