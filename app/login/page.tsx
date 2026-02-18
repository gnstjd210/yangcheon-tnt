"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Credential login is handled by signIn, but here we are just mocking the UI flow or calling it.
        // For actual credential login:
        await signIn("credentials", {
            username: formData.username,
            password: formData.password,
            callbackUrl: "/"
        });
        setIsLoading(false);
    };

    const handleSocialLogin = (provider: 'naver' | 'kakao' | 'google') => {
        setIsLoading(true);
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-navy-900 mb-2">로그인</h1>
                    <p className="text-gray-500 text-sm">
                        TSA에 오신 것을 환영합니다.
                    </p>
                </div>

                {/* ID/PW Form */}
                <form onSubmit={handleSubmit} className="space-y-4 mb-8" autoComplete="off">
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="아이디 (이메일)"
                            required
                            autoComplete="off"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all font-medium"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="비밀번호"
                            required
                            autoComplete="off"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 transition-all font-medium"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-navy-900 text-white font-bold py-4 rounded-xl hover:bg-navy-800 transition-all shadow-lg flex items-center justify-center"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "로그인"}
                    </button>
                </form>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-400 font-medium">SNS 계정으로 로그인</span>
                    </div>
                </div>

                {/* SNS Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleSocialLogin('naver')}
                        className="w-full bg-[#03C75A] text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="font-black">N</span> 네이버 로그인
                    </button>
                    <button
                        onClick={() => handleSocialLogin('kakao')}
                        className="w-full bg-[#FEE500] text-[#3C1E1E] font-bold py-3.5 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C5.9 3 1 7.2 1 12.4C1 15.6 3 18.5 6 20.3C5.9 20.8 5.6 22.4 5.5 22.8C5.5 23 5.7 23.2 5.9 23.1C6.4 22.8 8.8 21.2 9.4 20.8C10.2 20.9 11.1 21 12 21C18.1 21 23 16.8 23 11.6C23 6.4 18.1 3 12 3Z" />
                        </svg>
                        카카오 로그인
                    </button>
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        구글 로그인
                    </button>
                </div>

                <div className="mt-8 text-center bg-gray-50 py-4 rounded-xl">
                    <span className="text-gray-500 text-sm">아직 회원이 아니신가요?</span>
                    <Link href="/join" className="ml-2 text-navy-900 font-bold hover:underline">
                        회원가입
                    </Link>
                </div>
            </div>
        </div>
    );
}
