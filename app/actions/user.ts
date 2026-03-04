"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function registerLocalUser(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const detailAddress = formData.get("detailAddress") as string;
    const birthYear = formData.get("birthYear") as string;
    const birthMonth = formData.get("birthMonth") as string;
    const birthDay = formData.get("birthDay") as string;
    const marketingAgreed = formData.get("marketingAgreed") === "true";

    let birthDate: Date | null = null;
    if (birthYear && birthMonth && birthDay) {
        // Construct YYYY-MM-DD
        const formattedMonth = birthMonth.padStart(2, '0');
        const formattedDay = birthDay.padStart(2, '0');
        birthDate = new Date(`${birthYear}-${formattedMonth}-${formattedDay}T00:00:00.000Z`);
    }

    if (!email || !password || !name) {
        return { success: false, message: "모든 필수 필드를 입력해주세요." };
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: "이미 가입된 이메일입니다.",
            };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user (provider defaults to 'local' in schema, but we specify it to be explicit)
        await prisma.user.create({
            data: {
                username: email, // Using email as username for standard login
                email,
                password: hashedPassword,
                name,
                phone,
                address,
                detailAddress,
                birthDate,
                marketingAgreed,
                provider: "local",
            },
        });

        return { success: true, message: "회원가입이 완료되었습니다." };
    } catch (error) {
        console.error("Local user registration failed:", error);
        return { success: false, message: "회원가입 처리 중 오류가 발생했습니다." };
    }
}

export async function completeSnsProfile(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, message: "로그인된 세션을 찾을 수 없습니다." };
        }

        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const detailAddress = formData.get("detailAddress") as string;
        const birthYear = formData.get("birthYear") as string;
        const birthMonth = formData.get("birthMonth") as string;
        const birthDay = formData.get("birthDay") as string;
        const marketingAgreed = formData.get("marketingAgreed") === "true";

        let birthDate: Date | null = null;
        if (birthYear && birthMonth && birthDay) {
            const formattedMonth = birthMonth.padStart(2, '0');
            const formattedDay = birthDay.padStart(2, '0');
            birthDate = new Date(`${birthYear}-${formattedMonth}-${formattedDay}T00:00:00.000Z`);
        }

        if (!name || !phone || !birthDate) {
            return { success: false, message: "필수 정보를 모두 입력해주세요." };
        }

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                phone,
                address,
                detailAddress,
                birthDate,
                marketingAgreed,
            },
        });

        return { success: true, message: "추가 정보 입력이 완료되었습니다." };
    } catch (error) {
        console.error("SNS profile completion failed:", error);
        return { success: false, message: "정보 저장 중 오류가 발생했습니다." };
    }
}
