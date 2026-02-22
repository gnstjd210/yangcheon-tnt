import { getAdminReviews } from "@/app/actions/review-admin";
import ReviewManager from "@/components/admin/ReviewManager";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
    const reviews = await getAdminReviews();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <ReviewManager initialReviews={reviews} />
        </div>
    );
}
