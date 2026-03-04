'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Megaphone, Star, LogOut, Users, Camera, FileText, Building2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === '/admin') {
            return pathname === '/admin';
        }
        return pathname?.startsWith(path);
    };

    const linkBaseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-all";
    const activeClass = "bg-navy-800 text-white font-bold";
    const inactiveClass = "text-gray-300 hover:bg-navy-800 hover:text-white";

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

                <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
                    <Link href="/admin" className={`${linkBaseClass} ${isActive('/admin') ? activeClass : inactiveClass}`}>
                        <LayoutDashboard size={20} />
                        대시보드
                    </Link>
                    <Link href="/admin/main-page" className={`${linkBaseClass} ${isActive('/admin/main-page') ? activeClass : inactiveClass}`}>
                        <LayoutDashboard size={20} />
                        메인 페이지 관리
                    </Link>
                    <Link href="/admin/notices" className={`${linkBaseClass} ${isActive('/admin/notices') ? activeClass : inactiveClass}`}>
                        <Megaphone size={20} />
                        공지사항 관리
                    </Link>
                    <Link href="/admin/reviews" className={`${linkBaseClass} ${isActive('/admin/reviews') ? activeClass : inactiveClass}`}>
                        <Star size={20} />
                        레슨 후기 관리
                    </Link>
                    <Link href="/admin/registrations" className={`${linkBaseClass} ${isActive('/admin/registrations') ? activeClass : inactiveClass}`}>
                        <FileText size={20} />
                        신청서 관리
                    </Link>
                    <Link href="/admin/users" className={`${linkBaseClass} ${isActive('/admin/users') ? activeClass : inactiveClass}`}>
                        <Users size={20} />
                        회원 관리
                    </Link>

                    {/* TSA 소개 관리 Section */}
                    <div className="mt-4 mb-2">
                        <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">TSA 소개 관리</span>
                    </div>
                    <Link href="/admin/greeting" className={`${linkBaseClass} ${isActive('/admin/greeting') ? activeClass : inactiveClass}`}>
                        <FileText size={20} />
                        인사말 관리
                    </Link>
                    <Link href="/admin/coach" className={`${linkBaseClass} ${isActive('/admin/coach') ? activeClass : inactiveClass}`}>
                        <Users size={20} />
                        코치진 관리
                    </Link>
                    <Link href="/admin/facility" className={`${linkBaseClass} ${isActive('/admin/facility') ? activeClass : inactiveClass}`}>
                        <Building2 size={20} />
                        시설 관리
                    </Link>
                    <Link href="/admin/program" className={`${linkBaseClass} ${isActive('/admin/program') ? activeClass : inactiveClass}`}>
                        <Camera size={20} />
                        프로그램 이미지 관리
                    </Link>
                    <Link href="/admin/schedule" className={`${linkBaseClass} ${isActive('/admin/schedule') ? activeClass : inactiveClass}`}>
                        <FileText size={20} />
                        월간 스케줄 관리
                    </Link>

                    <div className="my-2 border-t border-navy-800"></div>
                    <Link href="/admin/gallery" className={`${linkBaseClass} ${isActive('/admin/gallery') ? activeClass : inactiveClass}`}>
                        <Camera size={20} />
                        갤러리 관리
                    </Link>
                    <Link href="/admin/trials" className={`${linkBaseClass} ${isActive('/admin/trials') ? activeClass : inactiveClass}`}>
                        <FileText size={20} />
                        체험수업 신청 관리
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
