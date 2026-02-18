import { getShuttles } from "@/app/actions/misc_about";
import ShuttleManager from "@/components/admin/ShuttleManager";

export const dynamic = "force-dynamic";

export default async function ShuttlePage() {
    const shuttles = await getShuttles();
    return <ShuttleManager initialShuttles={shuttles} />;
}
