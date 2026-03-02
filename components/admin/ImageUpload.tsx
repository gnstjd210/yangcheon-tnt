"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Check } from "lucide-react";
import dynamic from "next/dynamic";
import type { Area } from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    onRemove: () => void;
    aspectRatio?: number;
    isCircle?: boolean;
}

export default function ImageUpload({ value, onChange, onRemove, aspectRatio = 3 / 4, isCircle = false }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    // Cropper states
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setImageSrc(reader.result?.toString() || null)
            );
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        try {
            if (!imageSrc || !croppedAreaPixels) return;
            setIsUploading(true);

            // Generate the cropped image file using our utility
            const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

            if (!croppedFile) {
                alert("이미지 자르기에 실패했습니다.");
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", croppedFile);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const text = await response.text();
                if (response.status === 413) {
                    alert("업로드 실패: 파일 용량이 너무 큽니다 (최대 4MB).");
                } else {
                    alert(`업로드 실패 (${response.status}). 관리자에게 문의하세요.`);
                    console.error("Upload HTTP error", response.status, text);
                }
                setIsUploading(false);
                return;
            }

            const data = await response.json();
            if (data.success) {
                onChange(data.url);
                setImageSrc(null); // Close cropper
            } else {
                alert(data.message || "업로드에 실패했습니다.");
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsUploading(false);
            const fileInput = document.getElementById("image-upload-input") as HTMLInputElement;
            if (fileInput) fileInput.value = "";
        }
    };

    if (imageSrc) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh] max-h-[800px]">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
                        <h3 className="text-xl font-bold text-navy-900">
                            이미지 자르기
                        </h3>
                        <button onClick={() => setImageSrc(null)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative flex-1 bg-black min-h-0 w-full overflow-hidden">
                        {/* @ts-expect-error - dynamic import typing mismatch */}
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            objectFit="contain"
                            cropShape={isCircle ? "round" : "rect"}
                        />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-4 shrink-0">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-500 whitespace-nowrap">확대/축소</span>
                            <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => {
                                    setZoom(Number(e.target.value));
                                }}
                                className="w-full accent-sky-500"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setImageSrc(null)}
                                className="px-5 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition"
                                disabled={isUploading}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={showCroppedImage}
                                disabled={isUploading}
                                className="px-5 py-3 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-600 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {isUploading ? "업로드 중..." : (
                                    <>
                                        <Check size={18} /> 사용하기
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (value) {
        return (
            <div className={`relative w-full h-full group ${isCircle ? "rounded-full" : "rounded-xl"}`}>
                {/* Delete Button (Outside overflow-hidden so it's not clipped by the circle) */}
                <div className={`absolute z-20 opacity-0 group-hover:opacity-100 transition-opacity ${isCircle ? "top-[10%] right-[10%] -translate-y-1/2 translate-x-1/2" : "top-2 right-2"}`}>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Image Wrapper */}
                <div className={`relative w-full h-full overflow-hidden border border-gray-200 ${isCircle ? "rounded-full" : "rounded-xl"}`}>
                    <Image
                        fill
                        src={value}
                        alt="Upload preview"
                        className="object-cover object-center"
                    />
                </div>
            </div>
        );
    }

    return (
        <label className="w-full h-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-gray-50 hover:border-sky-500 transition cursor-pointer relative min-h-[140px] group">
            <input
                id="image-upload-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                disabled={isUploading}
            />
            <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-sky-50 flex items-center justify-center mb-3 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
            </div>
            <span className="text-sm text-gray-500 font-medium group-hover:text-sky-600 transition-colors">
                클릭하여 업로드
            </span>
        </label>
    );
}
