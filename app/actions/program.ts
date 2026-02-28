"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProgramImage(path: string) {
    try {
        const data = await prisma.programData.findUnique({
            where: { path }
        });
        return data?.imageUrl || null;
    } catch (error) {
        console.error("Failed to get program image:", error);
        return null;
    }
}

export async function upsertProgramImage(path: string, imageUrl: string) {
    try {
        await prisma.programData.upsert({
            where: { path },
            update: { imageUrl },
            create: { path, imageUrl }
        });

        revalidatePath(path);

        return { success: true };
    } catch (error) {
        console.error("Failed to upsert program image:", error);
        return { success: false, error: "Failed to update image" };
    }
}
