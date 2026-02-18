"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { createGalleryImage, deleteGalleryImage } from "@/app/actions/gallery";

type GalleryImage = {
    id: string;
    imageUrl: string;
    title: string | null;
    day: string;
    category: string;
};

const DAYS = [
    { key: "All", label: "전체" },
    { key: "Mon", label: "월요일" },
    { key: "Tue", label: "화요일" },
    { key: "Wed", label: "수요일" },
    { key: "Thu", label: "목요일" },
    { key: "Fri", label: "금요일" },
    { key: "Sat", label: "토요일" },
    { key: "Sun", label: "일요일" },
];

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
    const [images, setImages] = useState(initialImages);
    const [isUploading, setIsUploading] = useState(false);

    // Upload State
    const [title, setTitle] = useState("");
    const [day, setDay] = useState("Mon");
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async () => {
        if (!imageUrl) return alert("이미지를 업로드해주세요.");

        setIsUploading(true);
        try {
            const newImage = await createGalleryImage({
                title,
                day,
                imageUrl,
                category: "Youth"
            });

            if (newImage) {
                setImages([newImage, ...images]);
                setTitle("");
                setImageUrl("");
                alert("사진이 등록되었습니다.");
            }
        } catch {
            alert("업로드 실패");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await deleteGalleryImage(id);
            setImages(images.filter(img => img.id !== id));
        } catch {
            alert("삭제 실패");
        }
    };

    return (
        <div className="space-y-8">
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">새 사진 등록</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <ImageUpload
                            onChange={setImageUrl}
                            onRemove={() => setImageUrl("")}
                            value={imageUrl}
                        />
                    </div>
                    <div className="md:col-span-3 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">제목 (선택)</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                                placeholder="사진 설명 (예: 3학년 드리블 훈련)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">요일 선택</label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS.filter(d => d.key !== 'All').map((d) => (
                                    <button
                                        key={d.key}
                                        onClick={() => setDay(d.key)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${day === d.key
                                            ? "bg-navy-900 text-white border-navy-900"
                                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition disabled:opacity-50"
                        >
                            {isUploading ? "등록 중..." : "갤러리에 등록"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery List */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-4">등록된 사진 목록 ({images.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="group relative rounded-lg overflow-hidden border border-gray-100 aspect-square">
                            <Image
                                src={img.imageUrl}
                                alt={img.title || ""}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <span className="font-bold text-sm">{DAYS.find(d => d.key === img.day)?.label}</span>
                                <span className="text-xs opacity-80">{img.title}</span>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="mt-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-navy-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                                {DAYS.find(d => d.key === img.day)?.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
