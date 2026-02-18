"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    onRemove: () => void;
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                onChange(data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
        }
    };

    if (value) {
        return (
            <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                        <X size={16} />
                    </button>
                </div>
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div className="w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition cursor-pointer relative">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
            />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 font-medium">
                {isUploading ? "업로드 중..." : "이미지 업로드"}
            </span>
        </div>
    );
}
