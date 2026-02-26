import Image from "next/image";
import { Facility } from "@prisma/client";

interface FacilitySectionProps {
    facility: Facility;
}

export default function FacilitySection({ facility }: FacilitySectionProps) {
    return (
        <section className="py-12 md:py-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors duration-300 rounded-3xl mb-8">
            {/* Title Section */}
            <div className="mb-6 flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-red-800 shrink-0 shadow-sm"></span>
                <h2 className="text-2xl md:text-3xl font-black text-navy-900 tracking-tight">
                    {facility.title}
                </h2>
            </div>

            {/* Description Section */}
            <div className="mb-10 text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-wrap pl-6 md:pl-7">
                {facility.description}
            </div>

            {/* Images Grid Section: 16:9 Aspect Ratio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pl-0 md:pl-7">
                {facility.image1 && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg group">
                        <Image
                            src={facility.image1}
                            alt={`${facility.title} 이미지 1`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Subtle inner shadow overlay for premium feel */}
                        <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                    </div>
                )}

                {facility.image2 && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg group">
                        <Image
                            src={facility.image2}
                            alt={`${facility.title} 이미지 2`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
