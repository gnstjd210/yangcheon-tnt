"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function submitRegistration(formData: FormData) {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const detailAddress = formData.get("detailAddress") as string;
    const fullAddress = `${address} ${detailAddress}`;
    const experience = formData.get("experience") as string; // Optional (Adult)
    const affiliation = formData.get("affiliation") as string; // Optional (Youth)
    const age = formData.get("age") as string; // Optional (Youth)
    const team = formData.get("team") as string; // Optional (TNTW)
    const type = formData.get("type") as string || "Youth";

    if (!name || !phone) {
        throw new Error("필수 입력 항목이 누락되었습니다.");
    }

    try {
        await prisma.registration.create({
            data: {
                name,
                phone,
                email,
                address: fullAddress,
                experience,
                affiliation,
                age,
                team,
                type,
                status: "pending",
            },
        });

        // In a real app, you might send an email notification to admin here

        revalidatePath("/admin/registrations");
        return { success: true, message: "신청이 완료되었습니다." };
    } catch (error) {
        console.error("Registration failed:", error);
        return { success: false, message: "신청 중 오류가 발생했습니다." };
    }
}

export async function submitTrialRegistration(formData: FormData) {
    console.log("Submit Trial Registration Started");

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const age = formData.get("age") as string;
    const desiredClass = formData.get("desiredClass") as string;
    const consultationMethod = formData.get("consultationMethod") as string;
    const awarenessPath = formData.get("awarenessPath") as string;

    console.log("Received Data:", { name, phone, age, desiredClass, consultationMethod, awarenessPath });

    if (!name || !phone || !age) {
        console.log("Validation Failed: Missing required fields");
        return { success: false, message: "필수 입력 항목이 누락되었습니다." };
    }

    try {
        const result = await prisma.registration.create({
            data: {
                name,
                phone,
                age, // Stored as String in DB
                desiredClass: desiredClass || "미정", // Handle empty string
                consultationMethod,
                awarenessPath,
                type: "Trial",
                status: "pending",
            },
        });
        console.log("Registration Created:", result);

        revalidatePath("/admin/registrations");
        return { success: true, message: "신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." };
    } catch (error) {
        console.error("Trial Registration failed:", error);
        return {
            success: false,
            message: `신청 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

export async function getAvailableClasses() {
    try {
        // Fetch distinct class names from the Schedule model
        const schedules = await prisma.schedule.findMany({
            select: {
                className: true,
            },
            distinct: ['className'],
        });

        return schedules.map(s => s.className).filter(Boolean);
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return [];
    }
}
