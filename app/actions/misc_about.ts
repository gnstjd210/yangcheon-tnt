"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

// Facility Actions
export async function getFacilities() {
    return await prisma.facility.findMany({ orderBy: { order: "asc" } });
}

export async function createFacility(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const order = parseInt(formData.get("order") as string || "0");
    await prisma.facility.create({ data: { title, content, imageUrl, order } });
    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}

export async function updateFacility(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const order = parseInt(formData.get("order") as string || "0");
    await prisma.facility.update({ where: { id }, data: { title, content, imageUrl, order } });
    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}

export async function deleteFacility(id: string) {
    await prisma.facility.delete({ where: { id } });
    revalidatePath("/admin/facility");
    revalidatePath("/about/facility");
}

// Location Actions
export async function getLocation() {
    return await prisma.location.findFirst();
}

export async function updateLocation(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const address = formData.get("address") as string;
    const lat = parseFloat(formData.get("lat") as string || "37.5");
    const lng = parseFloat(formData.get("lng") as string || "126.8");
    const content = formData.get("content") as string;

    if (id) {
        await prisma.location.update({
            where: { id },
            data: { title, address, lat, lng, content }
        });
    } else {
        await prisma.location.create({
            data: { title, address, lat, lng, content }
        });
    }
    revalidatePath("/admin/location");
    revalidatePath("/about/location");
}

// Shuttle Actions
export async function getShuttles() {
    return await prisma.shuttle.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createShuttle(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    await prisma.shuttle.create({ data: { title, content, imageUrl } });
    revalidatePath("/admin/shuttle");
    revalidatePath("/about/shuttle");
}

export async function updateShuttle(id: string, formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    await prisma.shuttle.update({ where: { id }, data: { title, content, imageUrl } });
    revalidatePath("/admin/shuttle");
    revalidatePath("/about/shuttle");
}

export async function deleteShuttle(id: string) {
    await prisma.shuttle.delete({ where: { id } });
    revalidatePath("/admin/shuttle");
    revalidatePath("/about/shuttle");
}
