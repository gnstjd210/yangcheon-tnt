import { getLocation } from "@/app/actions/misc_about";
import LocationManager from "@/components/admin/LocationManager";

export const dynamic = "force-dynamic";

export default async function LocationPage() {
    const location = await getLocation();
    return <LocationManager initialLocation={location} />;
}
