"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTrialRegistrations() {
    try {
        const trials = await prisma.trialRegistration.findMany({
            orderBy: { createdAt: "desc" },
        });
        return trials;
    } catch (error) {
        console.error("Failed to fetch trial registrations:", error);
        return [];
    }
}

export async function deleteTrialRegistration(id: string) {
    try {
        await prisma.trialRegistration.delete({
            where: { id },
        });
        revalidatePath("/admin/trials");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete trial registration:", error);
        throw new Error("삭제에 실패했습니다.");
    }
}
