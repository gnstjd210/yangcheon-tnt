import { getRegistrations } from "@/app/actions/registration-admin";
import RegistrationList from "@/components/admin/RegistrationList";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
    const registrations = await getRegistrations();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-navy-900">입단 신청 관리</h1>
            <RegistrationList initialRegistrations={registrations} />
        </div>
    );
}
