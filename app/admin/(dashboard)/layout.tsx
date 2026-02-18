'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Megaphone, Star, LogOut, Users, Camera, FileText } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading Admin Panel...</div>;
    }

    if (status === 'unauthenticated') {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-navy-900 text-white flex flex-col fixed h-full z-20">
                <div className="p-8 border-b border-navy-800">
                    <h1 className="text-2xl font-black tracking-tight text-sky-400">TNT ADMIN</h1>
                    <p className="text-xs text-gray-400 mt-1">관리자: {session?.user?.name}</p>
                </div>

                <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-navy-800 text-white font-bold">
                        <LayoutDashboard size={20} />
                        대시보드
                    </Link>
                    <Link href="/admin/notices" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-all">
                        <Megaphone size={20} />
                        공지사항 관리
                    </Link>
                    <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-all">
                        <Star size={20} />
                        레슨 후기 관리
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-all">
                        <Users size={20} />
                        회원 관리
                    </Link>
                    <div className="my-2 border-t border-navy-800"></div>
                    <Link href="/admin/gallery" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-all">
                        <Camera size={20} />
                        갤러리 관리
                    </Link>
                    <Link href="/admin/registrations" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 text-gray-300 hover:text-white transition-all">
                        <FileText size={20} />
                        입단 신청 관리
                    </Link>
                </nav>

                <div className="p-4 border-t border-navy-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
                    >
                        <LogOut size={16} />
                        로그아웃
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < main className="flex-1 ml-64 p-8 md:p-12" >
                {children}
            </main >
        </div >
    );
}
