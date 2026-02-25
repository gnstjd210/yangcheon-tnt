import { getTrialRegistrations } from "@/app/actions/trials";
import TrialManager from "@/components/admin/TrialManager";

export const dynamic = "force-dynamic";

export default async function AdminTrialsPage() {
    const trials = await getTrialRegistrations();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <TrialManager initialTrials={trials} />
        </div>
    );
}
