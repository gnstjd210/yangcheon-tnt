import { getDeletedPayments } from '@/app/actions/payment-admin';
import PaymentTrashList from '@/components/admin/PaymentTrashList';

export const dynamic = 'force-dynamic';

export default async function PaymentTrashPage() {
    const res = await getDeletedPayments();

    // Pass empty array if fetch fails to prevent crash
    const payments = res.success && res.data ? res.data : [];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <PaymentTrashList initialPayments={payments} />
        </div>
    );
}
