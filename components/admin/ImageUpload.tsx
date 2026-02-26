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

            if (!response.ok) {
                const text = await response.text();
                // 413 Body exceeded 4MB limit
                if (response.status === 413) {
                    alert("업로드 실패: 파일 용량이 너무 큽니다 (최대 4MB).");
                } else {
                    alert(`업로드 실패 (${response.status}). 관리자에게 문의하세요.`);
                    console.error("Upload HTTP error", response.status, text);
                }
                return;
            }

            const data = await response.json();
            if (data.success) {
                onChange(data.url);
            } else {
                alert(data.message || "업로드에 실패했습니다.");
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsUploading(false);
        }
    };

    // If value is provided, it shows the preview (used for single image upload mode).
    // In multi-upload mode, we pass value="" so it purely acts as the upload button.
    if (value) {
        return (
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
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
        <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 hover:bg-gray-50 transition cursor-pointer relative min-h-[120px]">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
            />
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 font-medium">
                {isUploading ? "업로드 중..." : "추가"}
            </span>
        </div>
    );
}
