"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function checkIdDuplicate(username: string) {
    if (!username) return { available: false, message: "아이디를 입력해주세요." };

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return { available: false, message: "이미 사용 중인 아이디입니다." };
        } else {
            return { available: true, message: "사용 가능한 아이디입니다." };
        }
    } catch (error) {
        console.error("ID Check Error:", error);
        return { available: false, message: "오류가 발생했습니다." };
    }
}

export async function registerUser(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const nickname = formData.get("nickname") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;
    const detailAddress = formData.get("detailAddress") as string;

    try {
        // Validation
        if (!username || !password || !nickname || !name || !phone) {
            return { success: false, message: "필수 항목을 모두 입력해주세요." };
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name, // Note: `name` might be `username` in NextAuth logic, but schema likely has separate fields.
                // Assuming schema has: username, password, name, email, phone, address...
                // If schema differs, adjust here.
                email: email || null,
                phone,
                address: `${address} ${detailAddress}`,
                // Store consents if schema supports
            },
        });

        return { success: true, message: "회원가입이 완료되었습니다." };
    } catch (error) {
        console.error("Registration Error:", error);
        return { success: false, message: "회원가입 중 오류가 발생했습니다." };
    }
}
