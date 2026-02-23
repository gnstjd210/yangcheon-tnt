"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGalleryPosts(type: string, category?: string) {
    try {
        const posts = await prisma.gallery.findMany({
            where: {
                type: type,
                ...(category ? { category: category } : {})
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        return posts;
    } catch (error) {
        console.error("Error fetching gallery posts:", error);
        return [];
    }
}

export async function getGalleryPostById(id: string) {
    try {
        const post = await prisma.gallery.findUnique({
            where: { id }
        });
        return post;
    } catch (error) {
        console.error("Error fetching gallery post by id:", error);
        return null;
    }
}

export async function createGalleryPost(data: {
    type: string;
    category: string;
    title?: string;
    content?: string;
    images: string[];
}) {
    try {
        const post = await prisma.gallery.create({
            data: {
                type: data.type,
                category: data.category,
                title: data.title,
                content: data.content,
                images: data.images,
            }
        });

        // Revalidate relevant paths
        if (data.type === 'YOUTH') revalidatePath('/program/youth/gallery');
        if (data.type === 'ADULT') revalidatePath('/program/adult/gallery');
        if (data.type === 'TNT_W') revalidatePath('/program/tntw/gallery');
        revalidatePath('/admin/gallery');

        return { success: true, post };
    } catch (error) {
        console.error("Failed to create gallery post:", error);
        return { success: false, message: "게시글 작성에 실패했습니다." };
    }
}

export async function updateGalleryPost(id: string, data: {
    type: string;
    category: string;
    title?: string;
    content?: string;
    images: string[];
}) {
    try {
        const post = await prisma.gallery.update({
            where: { id },
            data: {
                type: data.type,
                category: data.category,
                title: data.title,
                content: data.content,
                images: data.images,
            }
        });

        // Revalidate relevant paths
        if (data.type === 'YOUTH') revalidatePath('/program/youth/gallery');
        if (data.type === 'ADULT') revalidatePath('/program/adult/gallery');
        if (data.type === 'TNT_W') revalidatePath('/program/tntw/gallery');
        revalidatePath('/admin/gallery');
        revalidatePath(`/program/${data.type.toLowerCase().replace('_', '')}/gallery/${id}`);

        return { success: true, post };
    } catch (error) {
        console.error("Failed to update gallery post:", error);
        return { success: false, message: "게시글 수정에 실패했습니다." };
    }
}

export async function deleteGalleryPost(id: string, type: string) {
    try {
        await prisma.gallery.delete({ where: { id } });

        // Revalidate relevant paths
        if (type === 'YOUTH') revalidatePath('/program/youth/gallery');
        if (type === 'ADULT') revalidatePath('/program/adult/gallery');
        if (type === 'TNT_W') revalidatePath('/program/tntw/gallery');
        revalidatePath('/admin/gallery');

        return { success: true };
    } catch (error) {
        console.error("Failed to delete gallery post:", error);
        return { success: false, message: "게시글 삭제에 실패했습니다." };
    }
}
