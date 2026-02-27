import prisma from "@/lib/prisma";
import GreetingTabs from "@/components/about/GreetingTabs";

export const dynamic = "force-dynamic";

export default async function GreetingPage() {
    // Fetch all greetings that are visible
    const greetings = await prisma.greeting.findMany({
        where: { isVisible: true },
        orderBy: { role: "asc" }, // consistent ordering
    });

    return <GreetingTabs greetings={greetings} />;
}
