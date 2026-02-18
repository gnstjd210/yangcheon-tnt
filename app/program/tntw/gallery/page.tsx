import { getGalleryImages } from "@/app/actions/gallery";
import GalleryGrid from "@/components/program/GalleryGrid";

export const dynamic = "force-dynamic";

export default async function TNTWGalleryPage() {
    const images = await getGalleryImages("TNTW");

    return (
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-4">
                    TNT W GALLERY
                </h2>
                <p className="text-gray-500 text-lg">
                    함께 땀 흘리는 즐거움, TNT W의 활동 모습
                </p>
            </div>

            <GalleryGrid
                initialImages={images}
                filters={["All", "Futsal", "Soccer"]}
                filterType="team"
            />
        </div>
    );
}
