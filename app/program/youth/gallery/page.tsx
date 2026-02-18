import { getGalleryImages } from "@/app/actions/gallery";
import GalleryGrid from "@/components/program/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function YouthGalleryPage() {
    const images = await getGalleryImages("Youth");

    return (
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-4">
                    YOUTH GALLERY
                </h2>
                <p className="text-gray-500 text-lg">
                    양천 TNT 유소년 아카데미의 생생한 훈련 현장
                </p>
            </div>

            <GalleryGrid
                initialImages={images}
                filters={["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            />
        </div>
    );
}
