"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdultClassCards() {
    try {
        const cards = await prisma.adultClassCard.findMany({
            orderBy: {
                // Return in order: male, female, mixed
                type: 'desc' // 'male' (m), 'mixed' (mi), 'female' (f)? We'll let the frontend map by type.
            }
        });
        return { success: true, cards };
    } catch (error) {
        console.error("Failed to get adult class cards:", error);
        return { success: false, error: "카드를 불러오는데 실패했습니다." };
    }
}

export async function upsertAdultClassCard(data: {
    type: string;
    title: string;
    subtitle: string;
    listItems: string[];
}) {
    try {
        const card = await prisma.adultClassCard.upsert({
            where: { type: data.type },
            update: {
                title: data.title,
                subtitle: data.subtitle,
                listItems: JSON.stringify(data.listItems)
            },
            create: {
                type: data.type,
                title: data.title,
                subtitle: data.subtitle,
                listItems: JSON.stringify(data.listItems)
            }
        });

        revalidatePath("/admin/adult-classes");
        revalidatePath("/program/adult/curriculum");
        return { success: true, card };
    } catch (error) {
        console.error("Failed to upsert adult class card:", error);
        return { success: false, error: "카드 저장에 실패했습니다." };
    }
}
