"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getGreetings() {
    return await prisma.greeting.findMany({
        orderBy: { role: "asc" }, // e.g. CEO, PRESIDENT
    });
}

export async function upsertGreeting(formData: FormData) {
    const role = formData.get("role") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string | null;
    const isVisible = formData.get("isVisible") === "true";

    await prisma.greeting.upsert({
        where: { role },
        update: {
            title,
            content,
            imageUrl,
            isVisible,
        },
        create: {
            role,
            title,
            content,
            imageUrl,
            isVisible,
        },
    });

    revalidatePath("/admin/greeting");
    revalidatePath("/about/greeting");
}
