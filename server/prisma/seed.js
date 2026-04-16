const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.eventType.deleteMany();

  // Create event types
  const quickCall = await prisma.eventType.create({
    data: {
      title: "Quick Call",
      description: "A short 15-minute catch-up call",
      duration: 15,
      slug: "quick-call",
      bufferTime: 5,
    },
  });

  const meeting = await prisma.eventType.create({
    data: {
      title: "30 Min Meeting",
      description: "Standard 30-minute meeting for discussions",
      duration: 30,
      slug: "30min-meeting",
      bufferTime: 10,
    },
  });

  const consultation = await prisma.eventType.create({
    data: {
      title: "Consultation",
      description: "In-depth 60-minute consultation session",
      duration: 60,
      slug: "consultation",
      bufferTime: 15,
    },
  });

  const techInterview = await prisma.eventType.create({
    data: {
      title: "Technical Interview",
      description: "45-minute technical screening interview",
      duration: 45,
      slug: "tech-interview",
      bufferTime: 15,
    },
  });

  console.log("✅ Created 4 event types");

  // Create availability for each event type (Mon-Fri, 9AM-5PM IST)
  const eventTypes = [quickCall, meeting, consultation, techInterview];

  for (const event of eventTypes) {
    const availabilityData = [];
    for (let day = 1; day <= 5; day++) {
      // Monday to Friday
      availabilityData.push({
        eventTypeId: event.id,
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "17:00",
        timezone: "Asia/Kolkata",
      });
    }
    await prisma.availability.createMany({ data: availabilityData });
  }

  console.log("✅ Created availability (Mon-Fri, 9AM-5PM) for all events");

  // Create sample bookings for the next few days
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Ensure tomorrow is a weekday
  while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
    tomorrow.setDate(tomorrow.getDate() + 1);
  }

  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 1);
  while (dayAfter.getDay() === 0 || dayAfter.getDay() === 6) {
    dayAfter.setDate(dayAfter.getDate() + 1);
  }

  // Helper to create a date at a specific hour in UTC
  const makeTime = (baseDate, hour, minute = 0) => {
    const d = new Date(baseDate);
    d.setUTCHours(hour, minute, 0, 0);
    return d;
  };

  const bookings = [
    {
      eventTypeId: meeting.id,
      name: "Alice Johnson",
      email: "alice@example.com",
      startTime: makeTime(tomorrow, 4, 30), // 10:00 AM IST
      endTime: makeTime(tomorrow, 5, 0), // 10:30 AM IST
    },
    {
      eventTypeId: meeting.id,
      name: "Bob Smith",
      email: "bob@example.com",
      startTime: makeTime(tomorrow, 7, 0), // 12:30 PM IST
      endTime: makeTime(tomorrow, 7, 30), // 1:00 PM IST
    },
    {
      eventTypeId: consultation.id,
      name: "Carol Williams",
      email: "carol@example.com",
      startTime: makeTime(dayAfter, 5, 30), // 11:00 AM IST
      endTime: makeTime(dayAfter, 6, 30), // 12:00 PM IST
    },
    {
      eventTypeId: quickCall.id,
      name: "David Brown",
      email: "david@example.com",
      startTime: makeTime(tomorrow, 8, 30), // 2:00 PM IST
      endTime: makeTime(tomorrow, 8, 45), // 2:15 PM IST
    },
    {
      eventTypeId: techInterview.id,
      name: "Eve Davis",
      email: "eve@example.com",
      startTime: makeTime(dayAfter, 6, 30), // 12:00 PM IST
      endTime: makeTime(dayAfter, 7, 15), // 12:45 PM IST
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }

  // Create a past booking too
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  await prisma.booking.create({
    data: {
      eventTypeId: meeting.id,
      name: "Frank Past",
      email: "frank@example.com",
      startTime: makeTime(yesterday, 4, 30),
      endTime: makeTime(yesterday, 5, 0),
    },
  });

  console.log("✅ Created 6 sample bookings");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
