import { getCoaches } from "@/app/actions/coach";
import CoachManager from "@/components/admin/CoachManager";

export const dynamic = "force-dynamic";

export default async function CoachPage() {
    const coaches = await getCoaches();
    return <CoachManager initialCoaches={coaches} />;
}
