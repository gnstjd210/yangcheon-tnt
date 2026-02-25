import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
    }

    try {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

        // Upload to Vercel Blob
        const blob = await put(`uploads/${filename}`, file, {
            access: 'public',
        });

        return NextResponse.json({
            success: true,
            url: blob.url
        });
    } catch (err) {
        console.error("Error saving file to Vercel Blob:", err);
        return NextResponse.json({ success: false, message: "Error saving file to Blob. Has BLOB_READ_WRITE_TOKEN been set?" }, { status: 500 });
    }
}
