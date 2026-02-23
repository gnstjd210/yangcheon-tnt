import { getGalleryPosts } from "@/app/actions/gallery";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
    // Fetch all posts initially, GalleryManager will filter them by activeTab
    // Alternatively, we could fetch them client-side or pass all.
    // Fetching all might be okay for a small/medium site.
    // Let's modify getGalleryPosts to take no arguments if we want all, or fetch them individually.
    // Our updated getGalleryPosts requires a 'type' string. Let's fetch all three:
    const youthPosts = await getGalleryPosts("YOUTH");
    const adultPosts = await getGalleryPosts("ADULT");
    const tntwPosts = await getGalleryPosts("TNT_W");

    const allPosts = [...youthPosts, ...adultPosts, ...tntwPosts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-black text-navy-900">갤러리 (자유게시판) 관리</h1>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <GalleryManager initialPosts={allPosts as any} />
        </div>
    );
}
