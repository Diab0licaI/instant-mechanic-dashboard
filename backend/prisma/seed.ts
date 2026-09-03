import {
  PrismaClient,
  MechanicStatus,
  BookingStatus,
  PaymentStatus,
  Role,
} from "@prisma/client";
import { fakerEN_IN as faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const servicesList = [
  {
    name: "General Service",
    category: "Maintenance",
    price: 2500,
    duration: 120,
  },
  {
    name: "Oil Change",
    category: "Maintenance",
    price: 1500,
    duration: 60,
  },
  {
    name: "AC Service",
    category: "Repair",
    price: 2000,
    duration: 90,
  },
];

const vehicleModels = [
  "Honda City",
  "Hyundai Creta",
  "Maruti Swift",
  "Tata Nexon",
];

async function main() {
  console.log("\n🌱 Starting database seed...\n");

  // =========================
  // CLEAR OLD DATA
  // =========================

  console.log("🗑️ Clearing old data...");

  await prisma.payment.deleteMany();
  console.log("  ✅ Payments cleared");

  await prisma.bookingStatusHistory.deleteMany();
  console.log("  ✅ Booking status history cleared");

  await prisma.booking.deleteMany();
  console.log("  ✅ Bookings cleared");

  await prisma.service.deleteMany();
  console.log("  ✅ Services cleared");

  await prisma.vehicle.deleteMany();
  console.log("  ✅ Vehicles cleared");

  await prisma.customer.deleteMany();
  console.log("  ✅ Customers cleared");

  await prisma.mechanic.deleteMany();
  console.log("  ✅ Mechanics cleared");

  await prisma.user.deleteMany();
  console.log("  ✅ Users cleared");

  console.log("\n✅ Old data cleared\n");

  // =========================
  // ADMIN USER
  // =========================

  console.log("👑 Creating admin user...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@instantmechanic.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log(
    `  ✅ Admin: ${admin.email} | Role: ${admin.role}`
  );

  // =========================
  // SERVICES
  // =========================

  console.log("\n🔧 Creating services...");

  const services = [];

  for (const serviceData of servicesList) {
    const service = await prisma.service.create({
      data: {
        name: serviceData.name,
        category: serviceData.category,
        price: serviceData.price,
        estimatedDuration: serviceData.duration,
      },
    });

    services.push(service);

    console.log(
      `  ✅ Service: ${service.name} | ₹${service.price}`
    );
  }

  // =========================
  // MECHANICS
  // =========================

  console.log("\n👨‍🔧 Creating mechanics...");

  const mechanics = [];

  for (let i = 0; i < 3; i++) {
    const mechanic = await prisma.mechanic.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number({
          style: "national",
        }),
        status: faker.helpers.arrayElement([
          MechanicStatus.AVAILABLE,
          MechanicStatus.BUSY,
          MechanicStatus.OFFLINE,
        ]),
      },
    });

    mechanics.push(mechanic);

    console.log(
      `  ✅ Mechanic: ${mechanic.name} | ${mechanic.status}`
    );
  }

  // =========================
  // CUSTOMERS + VEHICLES
  // =========================

  console.log("\n👤 Creating customers and vehicles...");

  const customers = [];

  for (let i = 0; i < 5; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({
          style: "national",
        }),

        vehicles: {
          create: {
            make: faker.vehicle.manufacturer(),
            model: faker.helpers.arrayElement(vehicleModels),
            year: faker.number.int({
              min: 2018,
              max: 2024,
            }),
            registrationNumber: faker.vehicle.vrm(),
          },
        },
      },

      include: {
        vehicles: true,
      },
    });

    customers.push(customer);

    console.log(
      `  ✅ Customer: ${customer.name} | ${customer.email}`
    );

    for (const vehicle of customer.vehicles) {
      console.log(
        `     🚗 Vehicle: ${vehicle.make} ${vehicle.model} | ${vehicle.registrationNumber}`
      );
    }
  }

  // =========================
  // BOOKINGS
  // =========================

  console.log("\n📅 Creating bookings...");

  for (let i = 0; i < 10; i++) {
    const customer = faker.helpers.arrayElement(customers);

    const vehicle = faker.helpers.arrayElement(
      customer.vehicles
    );

    const service = faker.helpers.arrayElement(services);

    const isCompleted = faker.datatype.boolean({
      probability: 0.6,
    });

    const currentStatus = isCompleted
      ? BookingStatus.COMPLETED
      : faker.helpers.arrayElement([
          BookingStatus.PENDING,
          BookingStatus.ASSIGNED,
          BookingStatus.IN_PROGRESS,
        ]);

    const mechanic =
      currentStatus === BookingStatus.PENDING
        ? null
        : faker.helpers.arrayElement(mechanics);

    const scheduledDate = faker.date.recent({
      days: 15,
    });

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        serviceId: service.id,

        mechanicId: mechanic?.id ?? null,

        status: currentStatus,

        amount: service.price,

        scheduledDate,

        payment: {
          create: {
            amount: service.price,

            status: isCompleted
              ? PaymentStatus.COMPLETED
              : PaymentStatus.PENDING,

            paymentMethod: isCompleted
              ? faker.helpers.arrayElement([
                  "Card",
                  "Cash",
                  "UPI",
                ])
              : null,
          },
        },
      },
    });

    console.log(
      `  ✅ Booking #${i + 1} | ${booking.id} | ${currentStatus}`
    );

    // =========================
    // BOOKING STATUS HISTORY
    // =========================

    const pendingHistory =
      await prisma.bookingStatusHistory.create({
        data: {
          bookingId: booking.id,
          status: BookingStatus.PENDING,
          createdAt: faker.date.recent({
            days: 20,
          }),
        },
      });

    console.log(
      `     📝 Status History: ${pendingHistory.status}`
    );

    // Completed status history
    if (currentStatus === BookingStatus.COMPLETED) {
      const completedHistory =
        await prisma.bookingStatusHistory.create({
          data: {
            bookingId: booking.id,
            status: BookingStatus.COMPLETED,
            createdAt: scheduledDate,
          },
        });

      console.log(
        `     📝 Status History: ${completedHistory.status}`
      );
    }
  }

  // =========================
  // COMPLETE
  // =========================

  console.log("\n🎉 Seed completed successfully!");
  console.log("================================");
  console.log(`👑 Admin:      1`);
  console.log(`🔧 Services:   ${services.length}`);
  console.log(`👨‍🔧 Mechanics:  ${mechanics.length}`);
  console.log(`👤 Customers:  ${customers.length}`);
  console.log(`🚗 Vehicles:   ${customers.reduce(
    (total, customer) => total + customer.vehicles.length,
    0
  )}`);
  console.log(`📅 Bookings:   10`);
  console.log("================================\n");
}

main()
  .catch((error) => {
    console.error("\n❌ Seed failed:");
    console.error(error);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });