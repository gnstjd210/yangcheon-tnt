import { getGreetings } from "@/app/actions/greeting";
import GreetingManager from "@/components/admin/GreetingManager";

export const dynamic = "force-dynamic";

export default async function GreetingPage() {
    const greetings = await getGreetings();
    return <GreetingManager initialGreetings={greetings} />;
}
