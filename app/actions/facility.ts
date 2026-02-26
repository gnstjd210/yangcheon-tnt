"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFacilities() {
    return prisma.facility.findMany({
        orderBy: { order: "asc" },
    });
}

export async function createFacility(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image1 = formData.get("image1") as string | null;
    const image2 = formData.get("image2") as string | null;
    const order = parseInt(formData.get("order") as string || "0");

    await prisma.facility.create({
        data: {
            title,
            description,
            image1,
            image2,
            order,
        },
    });

    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}

export async function updateFacility(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image1 = formData.get("image1") as string | null;
    const image2 = formData.get("image2") as string | null;
    const order = parseInt(formData.get("order") as string || "0");

    await prisma.facility.update({
        where: { id },
        data: {
            title,
            description,
            image1,
            image2,
            order,
        },
    });

    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}

export async function deleteFacility(id: string) {
    await prisma.facility.delete({ where: { id } });
    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}
