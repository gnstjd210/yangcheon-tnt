"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getCoaches() {
    return await prisma.coach.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createCoach(formData: FormData) {
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const careers = formData.get("careers") as string; // JSON string
    const order = parseInt(formData.get("order") as string || "0");

    await prisma.coach.create({
        data: {
            name,
            position,
            message,
            imageUrl,
            careers,
            order,
        },
    });

    revalidatePath("/admin/coach");
    revalidatePath("/about/coach");
}

export async function updateCoach(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const message = formData.get("message") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const careers = formData.get("careers") as string;
    const order = parseInt(formData.get("order") as string || "0");

    await prisma.coach.update({
        where: { id },
        data: {
            name,
            position,
            message,
            imageUrl,
            careers,
            order,
        },
    });

    revalidatePath("/admin/coach");
    revalidatePath("/about/coach");
}

export async function deleteCoach(id: string) {
    await prisma.coach.delete({
        where: { id },
    });

    revalidatePath("/admin/coach");
    revalidatePath("/about/coach");
}
