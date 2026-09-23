import { hashPassword } from "@/lib/auth";
import { connectDatabase, sequelize } from "@/lib/db";
import { User, type UserRole } from "@/lib/models/user";

const seedUsers: Array<{ name: string; email: string; password: string; role: UserRole }> = [
  {
    name: "Demo Job Seeker",
    email: process.env.SEED_USER_EMAIL ?? "user@hirepath.local",
    password: process.env.SEED_USER_PASSWORD ?? "User@12345",
    role: "user",
  },
  {
    name: "Demo Company Admin",
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@hirepath.local",
    password: process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345",
    role: "admin",
  },
  {
    name: "Demo Super Admin",
    email: process.env.SEED_SUPERADMIN_EMAIL ?? "superadmin@hirepath.local",
    password: process.env.SEED_SUPERADMIN_PASSWORD ?? "SuperAdmin@12345",
    role: "superadmin",
  },
];

async function seed() {
  await connectDatabase();

  for (const seedUser of seedUsers) {
    await User.findOrCreate({
      where: { email: seedUser.email },
      defaults: {
        name: seedUser.name,
        email: seedUser.email,
        passwordHash: await hashPassword(seedUser.password),
        role: seedUser.role,
      },
    });
    console.log(`Seeded ${seedUser.role}: ${seedUser.email}`);
  }
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });