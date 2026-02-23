import { getUsers } from "@/app/actions/user-admin";
import UserManager from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <UserManager initialUsers={users} />
        </div>
    );
}
