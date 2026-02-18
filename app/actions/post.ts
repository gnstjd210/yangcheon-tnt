"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            orderBy: { createdAt: "desc" },
        });
        return posts;
    } catch {
        return [];
    }
}

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const content = formData.get("content") as string;
    const password = formData.get("password") as string;
    const category = formData.get("category") as string;

    if (!title || !content || !author || !password) {
        return { success: false, message: "필수 입력 항목이 누락되었습니다." };
    }

    try {
        await prisma.post.create({
            data: {
                title,
                author,
                content,
                password,
                category,
            },
        });

        revalidatePath("/community/free");
        return { success: true, message: "게시글이 등록되었습니다." };
    } catch (error) {
        console.error("Post creation failed:", error);
        return { success: false, message: "게시글 등록 중 오류가 발생했습니다." };
    }
}
