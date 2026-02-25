'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import type { HeroImage, QuickMenu, ProgramPreview } from "@/lib/mainPageConstants";
import { DEFAULT_HERO_IMAGES, DEFAULT_QUICK_MENU, DEFAULT_PROGRAMS } from "@/lib/mainPageConstants";

export async function getMainPageData() {
    try {
        let mainPageData = await prisma.mainPageData.findFirst();

        if (!mainPageData) {
            // Create default entry if it doesn't exist
            mainPageData = await prisma.mainPageData.create({
                data: {
                    heroImages: JSON.stringify(DEFAULT_HERO_IMAGES),
                    quickMenu: JSON.stringify(DEFAULT_QUICK_MENU),
                    programs: JSON.stringify(DEFAULT_PROGRAMS),
                }
            });
        }

        return {
            success: true,
            data: {
                heroImages: JSON.parse(mainPageData.heroImages) as HeroImage[],
                quickMenu: JSON.parse(mainPageData.quickMenu) as QuickMenu[],
                programs: JSON.parse(mainPageData.programs) as ProgramPreview[],
            }
        };
    } catch (error) {
        console.error("Error fetching main page data:", error);
        return { success: false, error: "Failed to fetch data" };
    }
}

export async function updateHeroImages(heroImages: HeroImage[]) {
    try {
        const data = await prisma.mainPageData.findFirst();
        if (data) {
            await prisma.mainPageData.update({
                where: { id: data.id },
                data: { heroImages: JSON.stringify(heroImages) },
            });
        } else {
            await prisma.mainPageData.create({
                data: {
                    heroImages: JSON.stringify(heroImages),
                    quickMenu: JSON.stringify(DEFAULT_QUICK_MENU),
                    programs: JSON.stringify(DEFAULT_PROGRAMS),
                }
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating hero images:", error);
        return { success: false, error: "Failed to update hero images" };
    }
}

export async function updateQuickMenu(quickMenu: QuickMenu[]) {
    try {
        const data = await prisma.mainPageData.findFirst();
        if (data) {
            await prisma.mainPageData.update({
                where: { id: data.id },
                data: { quickMenu: JSON.stringify(quickMenu) },
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating quick menu:", error);
        return { success: false, error: "Failed to update quick menu" };
    }
}

export async function updatePrograms(programs: ProgramPreview[]) {
    try {
        const data = await prisma.mainPageData.findFirst();
        if (data) {
            await prisma.mainPageData.update({
                where: { id: data.id },
                data: { programs: JSON.stringify(programs) },
            });
        }
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error("Error updating programs:", error);
        return { success: false, error: "Failed to update programs" };
    }
}
