const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

    console.log(`Seeding 4 events for ${dateStr}...`);

    const events = [
        { title: "Early Morning Drill", time: "06:00", endTime: "07:30", color: "blue" },
        { title: "Youth Elite A", time: "14:00", endTime: "16:00", color: "red" },
        { title: "Youth Hobby B", time: "16:30", endTime: "18:00", color: "green" },
        { title: "Adult Pro Session", time: "19:00", endTime: "21:00", color: "purple" },
    ];

    for (const event of events) {
        await prisma.schedule.create({
            data: {
                isRecurring: false,
                date: new Date(dateStr),
                startTime: event.time,
                endTime: event.endTime,
                className: event.title,
                color: event.color,
                maxUsers: 20,
                currentUsers: Math.floor(Math.random() * 10),
            }
        });
    }

    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
