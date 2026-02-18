import { getReviews } from "@/app/actions/review";
import ReviewList from "@/components/community/ReviewList";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
    const reviews = await getReviews();

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-navy-900">레슨 후기</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        회원님들의 솔직한 훈련 후기를 확인해보세요.
                    </p>
                </div>
            </div>

            <ReviewList initialReviews={reviews} />
        </div>
    );
}
