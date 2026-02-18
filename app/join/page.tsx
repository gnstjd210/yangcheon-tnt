"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function JoinPage() {
    const [agreements, setAgreements] = useState({
        all: false,
        terms: false,
        privacy: false,
    });

    const handleAllCheck = (checked: boolean) => {
        setAgreements({
            all: checked,
            terms: checked,
            privacy: checked,
        });
    };

    const handleSingleCheck = (key: 'terms' | 'privacy', checked: boolean) => {
        const newAgreements = { ...agreements, [key]: checked };
        const allChecked = newAgreements.terms && newAgreements.privacy;
        setAgreements({ ...newAgreements, all: allChecked });
    };

    const handleSocialLogin = (provider: 'naver' | 'kakao' | 'google') => {
        if (!agreements.terms || !agreements.privacy) {
            alert("약관 및 개인정보처리방침에 동의해주세요.");
            return;
        }
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <div className="max-w-md mx-auto py-20 px-6">
            <h1 className="text-3xl font-black text-navy-900 text-center mb-10">회원가입</h1>

            {/* SNS Login Section */}
            <div className="mb-12">
                <h2 className="text-sm font-bold text-gray-500 mb-4 text-center">SNS 계정으로 가입</h2>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => handleSocialLogin('naver')}
                        className="w-14 h-14 rounded-full bg-[#03C75A] flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        title="네이버 로그인"
                    >
                        <span className="text-white font-black text-xs">N</span>
                    </button>
                    <button
                        onClick={() => handleSocialLogin('kakao')}
                        className="w-14 h-14 rounded-full bg-[#FEE500] flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        title="카카오 로그인"
                    >
                        <svg className="w-6 h-6 text-[#3C1E1E]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3C5.9 3 1 7.2 1 12.4C1 15.6 3 18.5 6 20.3C5.9 20.8 5.6 22.4 5.5 22.8C5.5 23 5.7 23.2 5.9 23.1C6.4 22.8 8.8 21.2 9.4 20.8C10.2 20.9 11.1 21 12 21C18.1 21 23 16.8 23 11.6C23 6.4 18.1 3 12 3Z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                        title="구글 로그인"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>

            {/* Terms Section */}
            <div className="space-y-6">
                {/* All Agree */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        type="checkbox"
                        id="agreeAll"
                        checked={agreements.all}
                        onChange={(e) => handleAllCheck(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <label htmlFor="agreeAll" className="font-bold text-navy-900 cursor-pointer flex-1">
                        전체 약관에 동의합니다
                    </label>
                </div>

                {/* Terms of Service */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreements.terms}
                                onChange={(e) => handleSingleCheck('terms', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-gray-700 font-medium cursor-pointer">
                                회원가입 약관 동의 (필수)
                            </label>
                        </div>
                        <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 underline">전문보기</Link>
                    </div>
                    <div className="h-32 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        제1조(목적) 이 약관은 회사(전자상거래 사업자)가 운영하는 사이버 몰(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.<br /><br />
                        제2조(정의) ① “몰”이란 회사가 재화 또는 용역(이하 “재화 등”이라 한다)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
                    </div>
                </div>

                {/* Privacy Policy */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="agreePrivacy"
                                checked={agreements.privacy}
                                onChange={(e) => handleSingleCheck('privacy', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                            <label htmlFor="agreePrivacy" className="text-sm text-gray-700 font-medium cursor-pointer">
                                개인정보처리방침 동의 (필수)
                            </label>
                        </div>
                        <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 underline">전문보기</Link>
                    </div>
                    <div className="h-32 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-500 leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        1. 개인정보의 처리 목적 <br />
                        회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br /><br />
                        2. 개인정보의 처리 및 보유 기간 <br />
                        ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 space-y-3">
                <button
                    disabled={!agreements.all}
                    onClick={() => {
                        // Normally handle submit
                    }}
                    className="w-full py-4 bg-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed hidden" // Hidden for now as we focus on email/sns
                >
                    빠른 회원가입 (SNS)
                </button>

                <Link
                    href={agreements.all ? "/join/form" : "#"}
                    onClick={(e) => {
                        if (!agreements.all) {
                            e.preventDefault();
                            alert("약관에 모두 동의해주세요.");
                        }
                    }}
                    className={`block w-full py-4 text-center font-black rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${agreements.all
                        ? "bg-navy-900 text-white hover:bg-navy-800 shadow-navy-200"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    이메일로 회원가입
                    <ChevronRight size={18} />
                </Link>
            </div>
        </div>
    );
}
