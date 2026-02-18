import { getGalleryImages } from "@/app/actions/gallery";
import GalleryGrid from "@/components/program/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function AdultGalleryPage() {
    const images = await getGalleryImages("Adult");

    return (
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-4">
                    ADULT GALLERY
                </h2>
                <p className="text-gray-500 text-lg">
                    양천 TNT 성인부의 뜨거운 열정
                </p>
            </div>

            <GalleryGrid initialImages={images} />
        </div>
    );
}
