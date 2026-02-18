"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface Coach {
    id: string;
    name: string;
    position: string;
    message: string | null;
    careers: string; // JSON
    imageUrl: string | null;
}

export default function CoachGrid({ coaches }: { coaches: Coach[] }) {
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

    const getCareers = (jsonString: string): string[] => {
        try {
            const parsed = JSON.parse(jsonString);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {coaches.map((coach) => (
                    <div
                        key={coach.id}
                        onClick={() => setSelectedCoach(coach)}
                        className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                    >
                        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                            {coach.imageUrl ? (
                                <Image
                                    src={coach.imageUrl}
                                    alt={coach.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                <span className="text-white font-bold">상세 프로필 보기</span>
                            </div>
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-black text-navy-900 mb-1">{coach.name}</h3>
                            <p className="text-sky-500 font-bold text-sm tracking-wide uppercase">{coach.position}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedCoach && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setSelectedCoach(null)}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Image */}
                        <div className="w-full md:w-1/3 relative aspect-[3/4] md:aspect-auto bg-gray-100">
                            {selectedCoach.imageUrl ? (
                                <Image
                                    src={selectedCoach.imageUrl}
                                    alt={selectedCoach.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-white relative">
                            <button
                                onClick={() => setSelectedCoach(null)}
                                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-500"
                            >
                                <X size={24} />
                            </button>

                            <div>
                                <span className="text-sky-500 font-bold tracking-widest text-sm uppercase mb-2 block">
                                    {selectedCoach.position}
                                </span>
                                <h2 className="text-4xl font-black text-navy-900 mb-8">
                                    {selectedCoach.name}
                                </h2>

                                {selectedCoach.message && (
                                    <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-sky-500 italic text-gray-600">
                                        &quot;{selectedCoach.message}&quot;
                                    </div>
                                )}

                                <h4 className="text-lg font-bold text-navy-900 mb-4 border-b border-gray-100 pb-2">
                                    주요 경력
                                </h4>
                                <ul className="space-y-2">
                                    {getCareers(selectedCoach.careers).map((career, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2.5 flex-shrink-0"></span>
                                            <span>{career}</span>
                                        </li>
                                    ))}
                                    {getCareers(selectedCoach.careers).length === 0 && (
                                        <li className="text-gray-400 text-sm">등록된 경력이 없습니다.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
