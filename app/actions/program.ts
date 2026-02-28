"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProgramData(path: string) {
    try {
        const data = await prisma.programData.findUnique({
            where: { path }
        });
        return data || null;
    } catch (error) {
        console.error("Failed to get program data:", error);
        return null;
    }
}

export async function upsertProgramData(
    path: string,
    data: {
        imageUrl?: string;
        image2Url?: string;
        image3Url?: string;
        image4Url?: string;
        title?: string;
        subtitle?: string;
        description?: string
    }
) {
    try {
        await prisma.programData.upsert({
            where: { path },
            update: {
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
                ...(data.image2Url !== undefined && { image2Url: data.image2Url }),
                ...(data.image3Url !== undefined && { image3Url: data.image3Url }),
                ...(data.image4Url !== undefined && { image4Url: data.image4Url }),
                ...(data.title !== undefined && { title: data.title }),
                ...(data.subtitle !== undefined && { subtitle: data.subtitle }),
                ...(data.description !== undefined && { description: data.description }),
            },
            create: {
                path,
                imageUrl: data.imageUrl || "",
                image2Url: data.image2Url || "",
                image3Url: data.image3Url || "",
                image4Url: data.image4Url || "",
                title: data.title || "",
                subtitle: data.subtitle || "",
                description: data.description || ""
            }
        });

        revalidatePath(path);

        return { success: true };
    } catch (error) {
        console.error("Failed to upsert program data:", error);
        return { success: false, error: String(error) };
    }
}
