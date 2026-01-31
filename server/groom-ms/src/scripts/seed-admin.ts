import { PrismaClient } from "@generated/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@groom.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("❌ ADMIN_PASSWORD environment variable is missing.");
    process.exit(1);
  }

  console.log("🌱 Seeding database...");

  // 1. Ensure Roles Exist
  const roles = [
    { name: "USER", description: "Default user role" },
    { name: "ADMIN", description: "Administrator role" },
    { name: "SUPER_ADMIN", description: "Super Administrator role" },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: {
        id: nanoid(),
        name: r.name,
        description: r.description,
      },
    });
    console.log(`✅ Role ensured: ${r.name}`);
  }

  // 2. Create/Update Super Admin User
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

  const adminRole = await prisma.role.findUnique({
    where: { name: "SUPER_ADMIN" },
  });

  if (!adminRole) {
    throw new Error("SUPER_ADMIN role not found after seeding roles.");
  }

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword, // Update password if re-seeding
      roles: {
        connect: { id: adminRole.id },
      },
    },
    create: {
      id: nanoid(),
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      roles: {
        connect: { id: adminRole.id },
      },
    },
  });

  console.log(`✅ Super Admin user ensured: ${user.email}`);
  console.log("🌱 Seeding completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
