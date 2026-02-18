"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getRegistrations() {
    try {
        const registrations = await prisma.registration.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return registrations;
    } catch (error) {
        console.error("Failed to fetch registrations:", error);
        return [];
    }
}

export async function updateRegistrationStatus(id: string, status: string) {
    try {
        await prisma.registration.update({
            where: { id },
            data: { status },
        });
        revalidatePath("/admin/registrations");
        return { success: true };
    } catch {
        return { success: false, error: "Failed to update status" };
    }
}
