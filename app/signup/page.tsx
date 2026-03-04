"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ChevronLeft, ChevronDown, Search, Check } from "lucide-react";
import DaumPostcode from "react-daum-postcode";
import { registerLocalUser } from "@/app/actions/user";
import { signIn } from "next-auth/react";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // UI State
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // Birth Date Dials
    const [birthYear, setBirthYear] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");

    // Marketing Consent
    const [marketingAgreed, setMarketingAgreed] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        passwordConfirm: "",
        name: "",
        phone: "",
        address: "",
        detailAddress: ""
    });

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9]/g, "");
        let formatted = raw;
        if (raw.length > 3 && raw.length <= 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
        } else if (raw.length > 7) {
            formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
        }
        setFormData({ ...formData, phone: formatted });
    };

    const handleAddressComplete = (data: { address: string; addressType: string; bname: string; buildingName: string }) => {
        let fullAddress = data.address;
        let extraAddress = "";
        if (data.addressType === "R") {
            if (data.bname !== "") extraAddress += data.bname;
            if (data.buildingName !== "") extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        setFormData({ ...formData, address: fullAddress });
        setIsPostcodeOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!birthYear || !birthMonth || !birthDay) {
            alert("생년월일을 정확히 선택해주세요.");
            return;
        }

        setIsLoading(true);
        const form = new FormData();
        form.append("email", formData.email);
        form.append("password", formData.password);
        form.append("name", formData.name);
        form.append("phone", formData.phone);
        form.append("address", formData.address);
        form.append("detailAddress", formData.detailAddress);
        form.append("birthYear", birthYear);
        form.append("birthMonth", birthMonth);
        form.append("birthDay", birthDay);
        form.append("marketingAgreed", marketingAgreed.toString());

        const result = await registerLocalUser(form);

        if (result.success) {
            const loginResult = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (loginResult?.error) {
                alert("가입은 완료되었으나 자동 로그인에 실패했습니다. 로그인 후 이용해주세요.");
                router.push("/login");
            } else {
                router.push("/");
            }
        } else {
            alert(result.message);
        }
        setIsLoading(false);
    };

    // Calculate options for Dials
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-20 px-4 bg-gray-50/50">
            <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-400 hover:text-navy-900 mb-8 font-bold transition"
                >
                    <ChevronLeft size={20} />
                    뒤로가기
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-navy-900 mb-3">회원가입</h1>
                    <p className="text-gray-500 text-sm">
                        정확한 프로그램 안내를 위해 상세 정보를 입력해주세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">이름 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="실명을 입력해주세요"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">연락처 <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    placeholder="010-0000-0000"
                                    maxLength={13}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Birth Date Dials */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-bold text-navy-900 mb-2">생년월일 <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="relative">
                                    <select
                                        value={birthYear}
                                        onChange={(e) => setBirthYear(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 appearance-none font-medium text-gray-700 transition-all"
                                        required
                                    >
                                        <option value="" disabled>년도</option>
                                        {years.map((y) => <option key={`y-${y}`} value={y}>{y}년</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                                <div className="relative">
                                    <select
                                        value={birthMonth}
                                        onChange={(e) => setBirthMonth(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 appearance-none font-medium text-gray-700 transition-all"
                                        required
                                    >
                                        <option value="" disabled>월</option>
                                        {months.map((m) => <option key={`m-${m}`} value={m}>{m}월</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                                <div className="relative">
                                    <select
                                        value={birthDay}
                                        onChange={(e) => setBirthDay(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 appearance-none font-medium text-gray-700 transition-all"
                                        required
                                    >
                                        <option value="" disabled>일</option>
                                        {days.map((d) => <option key={`d-${d}`} value={d}>{d}일</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        {/* Address Search */}
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-sm font-bold text-navy-900 mb-2">주소 <span className="text-red-500">*</span></label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="주소 검색을 클릭하세요"
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium bg-white"
                                    value={formData.address}
                                    readOnly
                                    required
                                    onClick={() => setIsPostcodeOpen(true)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPostcodeOpen(true)}
                                    className="bg-navy-900 text-white px-5 py-3 rounded-xl hover:bg-navy-800 transition flex items-center gap-2 font-bold whitespace-nowrap shadow-md"
                                >
                                    <Search size={18} />
                                    검색
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="상세 주소를 입력하세요"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                value={formData.detailAddress}
                                onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                            />
                        </div>

                        {/* Login Credentials */}
                        <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-bold text-navy-900 mb-2">이메일 (ID) <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="로그인 아이디로 사용될 원하시는 이메일을 입력하세요"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-navy-900 mb-2">비밀번호 <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        placeholder="비밀번호"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-navy-900 mb-2">비밀번호 확인 <span className="text-red-500">*</span></label>
                                    <input
                                        type="password"
                                        placeholder="비밀번호 재입력"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 transition-all font-medium"
                                        value={formData.passwordConfirm}
                                        onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100">
                        {/* Marketing Consent */}
                        <div className="mb-6 flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-colors ${marketingAgreed ? 'bg-navy-900 border-navy-900 text-white' : 'bg-white border-gray-300 text-transparent'}`}>
                                    <Check size={16} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={marketingAgreed}
                                    onChange={(e) => setMarketingAgreed(e.target.checked)}
                                    className="hidden"
                                />
                                <span className="text-sm font-bold text-gray-700">(선택) 마케팅 수신 정보 동의</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-navy-900 text-white font-bold py-5 rounded-2xl hover:bg-navy-800 transition-all shadow-xl shadow-navy-900/20 flex items-center justify-center text-lg mt-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "가입하기"}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center bg-gray-50 py-4 rounded-xl">
                    <span className="text-gray-500 text-sm">이미 회원이신가요?</span>
                    <Link href="/login" className="ml-2 text-navy-900 font-bold hover:underline">
                        로그인
                    </Link>
                </div>

                {/* Daum Postcode Modal */}
                {isPostcodeOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
                            <button
                                type="button"
                                onClick={() => setIsPostcodeOpen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="p-4 pt-12 h-[500px]">
                                <DaumPostcode onComplete={handleAddressComplete} style={{ height: '100%' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
