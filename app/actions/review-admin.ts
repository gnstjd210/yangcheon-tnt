"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminReviews() {
    try {
        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
        });
        return reviews;
    } catch (error) {
        console.error("Failed to fetch admin reviews:", error);
        return [];
    }
}

export async function approveReview(id: string) {
    try {
        await prisma.review.update({
            where: { id },
            data: { isApproved: true },
        });
        revalidatePath("/admin/reviews");
        revalidatePath("/community/reviews");
        revalidatePath("/");
        return true;
    } catch (error) {
        console.error("Failed to approve review:", error);
        throw new Error("후기 승인에 실패했습니다.");
    }
}

export async function deleteReview(id: string) {
    try {
        await prisma.review.delete({
            where: { id },
        });
        revalidatePath("/admin/reviews");
        revalidatePath("/community/reviews");
        revalidatePath("/");
        return true;
    } catch (error) {
        console.error("Failed to delete review:", error);
        throw new Error("후기 삭제에 실패했습니다.");
    }
}
