import { getFacilities } from "@/app/actions/facility";
import FacilityManager from "@/components/admin/FacilityManager";

export const dynamic = "force-dynamic";

export default async function AdminPhysicalFacilityPage() {
    const facilities = await getFacilities();

    return (
        <div className="w-full h-full p-6">
            <FacilityManager initialFacilities={facilities} fixedCategory="PHYSICAL" />
        </div>
    );
}
