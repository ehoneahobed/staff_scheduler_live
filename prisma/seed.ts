import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create a manager account
  const managerPassword = await hash('manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Test Manager',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  // Create some staff accounts
  const staffPassword = await hash('staff123', 12);
  const staff1 = await prisma.user.upsert({
    where: { email: 'staff1@example.com' },
    update: {},
    create: {
      email: 'staff1@example.com',
      name: 'Staff Member 1',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'staff2@example.com' },
    update: {},
    create: {
      email: 'staff2@example.com',
      name: 'Staff Member 2',
      password: staffPassword,
      role: 'STAFF',
    },
  });

  console.log({ manager, staff1, staff2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 