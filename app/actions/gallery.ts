"use server";

import prisma from "@/lib/prisma";

export async function getGalleryImages(category: string = "Youth") {
    try {
        const images = await prisma.gallery.findMany({
            where: {
                category: category
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return images;
    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return [];
    }
}

export async function getYouthGalleryImages() {
    try {
        const images = await prisma.gallery.findMany({
            where: {
                category: "Youth",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return images;
    } catch (error) {
        console.error("Failed to fetch gallery images:", error);
        return [];
    }
}

export async function createGalleryImage(data: { title: string, day: string, imageUrl: string, category: string }) {
    try {
        const image = await prisma.gallery.create({
            data: {
                title: data.title,
                day: data.day,
                imageUrl: data.imageUrl,
                category: data.category
            }
        });
        return image;
    } catch {
        throw new Error("Failed to create image");
    }
}

export async function deleteGalleryImage(id: string) {
    try {
        await prisma.gallery.delete({ where: { id } });
        return { success: true };
    } catch {
        throw new Error("Failed to delete image");
    }
}
