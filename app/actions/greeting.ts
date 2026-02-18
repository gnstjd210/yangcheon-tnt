"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getGreetings() {
    return await prisma.greeting.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function createGreeting(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const isVisible = formData.get("isVisible") === "true";

    await prisma.greeting.create({
        data: {
            title,
            content,
            imageUrl,
            isVisible,
        },
    });

    revalidatePath("/admin/greeting");
    revalidatePath("/about/greeting");
}

export async function updateGreeting(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const isVisible = formData.get("isVisible") === "true";

    await prisma.greeting.update({
        where: { id },
        data: {
            title,
            content,
            imageUrl,
            isVisible,
        },
    });

    revalidatePath("/admin/greeting");
    revalidatePath("/about/greeting");
}

export async function deleteGreeting(id: string) {
    await prisma.greeting.delete({
        where: { id },
    });

    revalidatePath("/admin/greeting");
    revalidatePath("/about/greeting");
}
