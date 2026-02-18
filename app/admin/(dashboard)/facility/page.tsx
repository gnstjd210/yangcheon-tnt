import { getFacilities } from "@/app/actions/misc_about";
import FacilityManager from "@/components/admin/FacilityManager";

export const dynamic = "force-dynamic";

export default async function FacilityPage() {
    const facilities = await getFacilities();
    return <FacilityManager initialFacilities={facilities} />;
}
