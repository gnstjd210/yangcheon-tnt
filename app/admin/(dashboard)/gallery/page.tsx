import { getYouthGalleryImages } from "@/app/actions/gallery";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
    const images = await getYouthGalleryImages();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-navy-900">갤러리 관리 (유소년)</h1>
            <GalleryManager initialImages={images} />
        </div>
    );
}
