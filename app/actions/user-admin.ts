"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                username: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                detailAddress: true,
                birthDate: true,
                marketingAgreed: true,
                provider: true,
                createdAt: true,
            },
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return [];
    }
}

export async function updateUserCategory(id: string, category: string | null, subCategory: string | null) {
    try {
        await prisma.user.update({
            where: { id },
            data: {
                category,
                subCategory: subCategory && category ? subCategory : null, // Ensure subCategory is cleared if category is cleared
            },
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to update user category:", error);
        throw new Error("분류 업데이트에 실패했습니다.");
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.user.delete({
            where: { id },
        });
        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw new Error("사용자 삭제에 실패했습니다.");
    }
}
