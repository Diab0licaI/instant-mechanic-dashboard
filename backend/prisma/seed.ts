import { PrismaClient, Role, MechanicStatus, BookingStatus, PaymentStatus } from '@prisma/client';
import { fakerEN_IN as faker } from '@faker-js/faker'; // Using Indian locale

const prisma = new PrismaClient();

const vehicleModels = ['Honda City', 'Hyundai Creta', 'Maruti Swift', 'Tata Nexon', 'Toyota Fortuner', 'Kia Seltos', 'Mahindra Thar'];
const servicesList = [
  { name: 'General Service', category: 'Maintenance', price: 2500, duration: 120 },
  { name: 'Full Car Service', category: 'Maintenance', price: 5000, duration: 240 },
  { name: 'Oil Change', category: 'Maintenance', price: 1500, duration: 60 },
  { name: 'AC Service', category: 'Repair', price: 2000, duration: 90 },
  { name: 'Brake Pad Replacement', category: 'Repair', price: 3000, duration: 120 },
  { name: 'Wheel Alignment', category: 'Wheels', price: 800, duration: 45 },
  { name: 'Car Wash', category: 'Cleaning', price: 500, duration: 45 }
];

async function main() {
  console.log('Clearing old data...');
  await prisma.payment.deleteMany();
  await prisma.bookingStatusHistory.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.mechanic.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding Services...');
  const services = await Promise.all(
    servicesList.map(s => prisma.service.create({ data: { name: s.name, category: s.category, price: s.price, estimatedDuration: s.duration } }))
  );

  console.log('Seeding Mechanics...');
  const mechanics = [];
  for (let i = 0; i < 25; i++) {
    const mechanic = await prisma.mechanic.create({
      data: {
        name: faker.person.fullName(),
        phone: faker.phone.number({ style: 'national' }),
        status: faker.helpers.arrayElement([MechanicStatus.AVAILABLE, MechanicStatus.BUSY, MechanicStatus.OFFLINE])
      }
    });
    mechanics.push(mechanic);
  }

  console.log('Seeding Customers and Vehicles...');
  const customers = [];
  for (let i = 0; i < 60; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'national' }),
        vehicles: {
          create: faker.helpers.multiple(() => ({
            make: faker.vehicle.manufacturer(),
            model: faker.helpers.arrayElement(vehicleModels),
            year: faker.number.int({ min: 2015, max: 2024 }),
            registrationNumber: faker.vehicle.vrm()
          }), { count: faker.number.int({ min: 1, max: 2 }) })
        }
      },
      include: { vehicles: true }
    });
    customers.push(customer);
  }

  console.log('Seeding 500+ Bookings...');
  for (let i = 0; i < 500; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const vehicle = faker.helpers.arrayElement(customer.vehicles);
    const service = faker.helpers.arrayElement(services);
    const mechanic = faker.helpers.arrayElement(mechanics);
    const isCompleted = faker.datatype.boolean(0.7); // 70% chance completed
    const currentStatus = isCompleted ? BookingStatus.COMPLETED : faker.helpers.arrayElement([BookingStatus.PENDING, BookingStatus.ASSIGNED, BookingStatus.IN_PROGRESS]);

    const booking = await prisma.booking.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        serviceId: service.id,
        mechanicId: currentStatus === BookingStatus.PENDING ? null : mechanic.id,
        status: currentStatus,
        amount: service.price,
        scheduledDate: faker.date.recent({ days: 30 }),
        payment: {
          create: {
            amount: service.price,
            status: isCompleted ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
            paymentMethod: isCompleted ? faker.helpers.arrayElement(['Card', 'Cash', 'UPI']) : null
          }
        }
      }
    });

    // Add status history
    await prisma.bookingStatusHistory.create({
      data: { bookingId: booking.id, status: BookingStatus.PENDING, createdAt: faker.date.recent({ days: 35 }) }
    });
    
    if (currentStatus === BookingStatus.COMPLETED) {
      await prisma.bookingStatusHistory.create({
        data: { bookingId: booking.id, status: BookingStatus.COMPLETED, createdAt: booking.scheduledDate }
      });
    }
  }

  console.log('Seeding Complete! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });