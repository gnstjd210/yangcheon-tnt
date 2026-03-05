import { getAdminPayments } from '@/app/actions/payment-admin';
import PaymentList from '@/components/admin/PaymentList';

export const dynamic = 'force-dynamic';

export default async function AdminPaymentPage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Next.js 15: searchParams is a Promise
    const resolvedParams = await props.searchParams;

    const startDate = typeof resolvedParams?.startDate === 'string' ? resolvedParams.startDate : undefined;
    const endDate = typeof resolvedParams?.endDate === 'string' ? resolvedParams.endDate : undefined;

    const { data: initialPayments = [] } = await getAdminPayments(startDate, endDate);

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8">
            <PaymentList initialPayments={initialPayments} startDateParam={startDate} endDateParam={endDate} />
        </div>
    );
}
