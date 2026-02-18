'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 md:p-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-navy-900 mb-2">ADMIN LOGIN</h1>
                    <p className="text-gray-500 text-sm">양천 TNT 스포츠 아카데미 관리자 접속</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="관리자 아이디"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 transition-colors"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="password"
                            placeholder="비밀번호"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-navy-900 text-white font-bold py-4 rounded-lg hover:bg-sky-600 transition-colors mt-2"
                    >
                        로그인
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400">© 2026 Yangcheon TNT Sports Academy. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
