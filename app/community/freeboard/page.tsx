import { getPosts } from "@/app/actions/post";
import PostList from "@/components/community/PostList";

export const dynamic = "force-dynamic";

export default async function FreeBoardPage() {
    const posts = await getPosts();

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-navy-900">자유게시판</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        자유롭게 소통하고 정보를 나누는 공간입니다.
                    </p>
                </div>
            </div>

            <PostList initialPosts={posts} />
        </div>
    );
}
