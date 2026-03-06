"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function getSchedules() {
    return await prisma.schedule.findMany({
        orderBy: [
            { day: "asc" }, // Need deeper sort logic later or map day strings to numbers
            { startTime: "asc" }
        ],
    });
}

export async function createSchedule(formData: FormData) {
    const isRecurring = formData.get("isRecurring") === "true";
    const day = formData.get("day") as string;
    const date = formData.get("date") as string; // YYYY-MM-DD
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const className = formData.get("className") as string;
    const color = formData.get("color") as string;
    const maxUsers = parseInt(formData.get("maxUsers") as string || "12");
    const currentUsers = parseInt(formData.get("currentUsers") as string || "0");

    await prisma.schedule.create({
        data: {
            isRecurring,
            day: isRecurring ? day : null,
            date: !isRecurring && date ? new Date(date) : null,
            startTime,
            endTime,
            className,
            color,
            maxUsers,
            currentUsers,
        },
    });

    revalidatePath("/admin/schedule");
    revalidatePath("/about/schedule");
}

export async function createBatchSchedules(formData: FormData) {
    const isRecurring = formData.get("isRecurring") === "true";
    const startDateStr = formData.get("date") as string; // YYYY-MM-DD
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const className = formData.get("className") as string;
    const color = formData.get("color") as string;
    const maxUsers = parseInt(formData.get("maxUsers") as string || "12");
    const currentUsers = parseInt(formData.get("currentUsers") as string || "0");

    if (isRecurring) {
        // Fallback to normal create if someone tries to batch a weekly recurring via API
        return createSchedule(formData);
    }

    const [year, month, dayStr] = startDateStr.split("-").map(Number);
    const schedulesToCreate = [];

    // Create 4 records (+0, +7, +14, +21 days) based on strict local parsing to avoid UTC drift
    for (let i = 0; i < 4; i++) {
        // Build date accurately at 12:00 PM local to avoid timezone boundary jump bugs
        const targetDate = new Date(year, month - 1, dayStr + (i * 7), 12, 0, 0);

        schedulesToCreate.push({
            isRecurring: false,
            day: null,
            date: targetDate,
            startTime,
            endTime,
            className,
            color,
            maxUsers,
            currentUsers,
        });
    }

    await prisma.schedule.createMany({
        data: schedulesToCreate
    });

    revalidatePath("/admin/schedule");
    revalidatePath("/about/schedule");
}

export async function updateSchedule(id: string, formData: FormData) {
    const isRecurring = formData.get("isRecurring") === "true";
    const day = formData.get("day") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const className = formData.get("className") as string;
    const color = formData.get("color") as string;
    const maxUsers = parseInt(formData.get("maxUsers") as string || "12");
    const currentUsers = parseInt(formData.get("currentUsers") as string || "0");

    await prisma.schedule.update({
        where: { id },
        data: {
            isRecurring,
            day: isRecurring ? day : null,
            date: !isRecurring && date ? new Date(date) : null,
            startTime,
            endTime,
            className,
            color,
            maxUsers,
            currentUsers,
        },
    });

    revalidatePath("/admin/schedule");
    revalidatePath("/about/schedule");
}

export async function deleteSchedule(id: string) {
    await prisma.schedule.delete({
        where: { id },
    });

    revalidatePath("/admin/schedule");
    revalidatePath("/about/schedule");
}
