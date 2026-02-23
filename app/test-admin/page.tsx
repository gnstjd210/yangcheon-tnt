import { getUsers } from "@/app/actions/user-admin";
import UserManager from "@/components/admin/UserManager";

export const dynamic = "force-dynamic";

export default async function TestAdminPage() {
    const users = await getUsers();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <UserManager initialUsers={users as any} />;
}
