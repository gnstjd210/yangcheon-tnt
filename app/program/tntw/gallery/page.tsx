import { getGalleryPosts } from "@/app/actions/gallery";
import FreeboardList from "@/components/program/FreeboardList";

export const dynamic = "force-dynamic";

export default async function TNTWGalleryPage() {
    const posts = await getGalleryPosts("TNT_W");

    return (
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-navy-900 mb-4">
                    TNT W GALLERY
                </h2>
                <p className="text-gray-500 text-lg">
                    함께 땀 흘리는 즐거움, TNT W의 활동 모습
                </p>
            </div>

            <FreeboardList
                initialPosts={posts}
                basePath="/program/tntw/gallery"
                filters={[
                    { key: "ALL", label: "전체" },
                    { key: "축구", label: "축구" },
                    { key: "풋살", label: "풋살" },
                ]}
            />
        </div>
    );
}
