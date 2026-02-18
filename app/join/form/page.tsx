"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DaumPostcode from "react-daum-postcode";
// import ReCAPTCHA from "react-google-recaptcha";
import { Search, ChevronLeft } from "lucide-react";
import { checkIdDuplicate, registerUser } from "@/app/actions/auth";

export default function RegisterFormPage() {
    const router = useRouter();
    // const recaptchaRef = useRef<any>(null); // ReCAPTCHA type commented out
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [idCheckResult, setIdCheckResult] = useState<{ available: boolean; message: string } | null>(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        title: "", // passwordConfirm
        nickname: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        detailAddress: "",
        emailConsent: false,
        smsConsent: false,
    });

    interface DaumPostcodeData {
        address: string;
        addressType: string;
        bname: string;
        buildingName: string;
    }

    const handleAddressComplete = (data: DaumPostcodeData) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
            if (data.bname !== "") {
                extraAddress += data.bname;
            }
            if (data.buildingName !== "") {
                extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }

        setFormData({ ...formData, address: fullAddress });
        setIsPostcodeOpen(false);
    };

    const handleIdCheck = async () => {
        if (!formData.username) return alert("아이디를 입력해주세요.");
        const result = await checkIdDuplicate(formData.username);
        setIdCheckResult(result);
        if (!result.available) {
            alert(result.message);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!idCheckResult?.available) return alert("아이디 중복 확인을 해주세요.");
        if (formData.password !== formData.title) return alert("비밀번호가 일치하지 않습니다.");
        // if (!recaptchaRef.current?.getValue()) return alert("로봇이 아님을 확인해주세요.");

        setIsSubmitting(true);
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value.toString());
        });

        const result = await registerUser(form);
        if (result.success) {
            alert(result.message);
            router.push("/login");
        } else {
            alert(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="max-w-xl mx-auto py-16 px-6">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-navy-900 mb-8 font-bold"
            >
                <ChevronLeft size={20} />
                뒤로가기
            </button>
            <h1 className="text-3xl font-black text-navy-900 mb-12 border-b-2 border-navy-900 pb-4">
                회원정보 입력
            </h1>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Account Info */}
                <section className="space-y-6">
                    <h2 className="text-xl font-bold text-navy-900 border-l-4 border-navy-900 pl-3">계정 정보</h2>

                    {/* ID */}
                    <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            아이디 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                                placeholder="영문 소문자/숫자, 4~16자"
                                value={formData.username}
                                onChange={(e) => {
                                    setFormData({ ...formData, username: e.target.value });
                                    setIdCheckResult(null);
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleIdCheck}
                                className="bg-gray-800 text-white px-4 py-2 text-sm font-bold rounded hover:bg-navy-900 transition whitespace-nowrap"
                            >
                                중복확인
                            </button>
                        </div>
                        {idCheckResult && (
                            <p className={`text-xs mt-1 ${idCheckResult.available ? "text-green-600" : "text-red-500"}`}>
                                {idCheckResult.message}
                            </p>
                        )}
                    </div>

                    {/* Nickname */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            닉네임 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="공백없이 한글, 영문, 숫자만 입력 가능"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8자~16자"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {/* Password Confirm */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            비밀번호 확인 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="비밀번호를 한번 더 입력해주세요"
                            value={formData.title} // Used as password confirm
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        {formData.title && formData.password !== formData.title && (
                            <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                </section>

                {/* Personal Info */}
                <section className="space-y-6 pt-6 ">
                    <h2 className="text-xl font-bold text-navy-900 border-l-4 border-navy-900 pl-3">인적 사항</h2>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="실명을 입력해주세요"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            이메일 <span className="text-gray-400 font-normal">(선택)</span>
                        </label>
                        <input
                            type="email"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            휴대폰번호 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="'-' 없이 입력해주세요"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) })}
                            maxLength={13}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            주소 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                className="flex-1 border-b border-gray-300 py-2 px-1 outline-none bg-gray-50 text-gray-500"
                                placeholder="주소 검색을 이용해주세요"
                                value={formData.address}
                                readOnly
                                onClick={() => setIsPostcodeOpen(true)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPostcodeOpen(true)}
                                className="bg-gray-800 text-white px-4 py-2 text-sm font-bold rounded hover:bg-navy-900 transition flex items-center gap-1 whitespace-nowrap"
                            >
                                <Search size={16} />
                                주소검색
                            </button>
                        </div>
                        <input
                            type="text"
                            className="w-full border-b border-gray-300 py-2 px-1 outline-none focus:border-navy-900 transition-colors bg-transparent placeholder-gray-300"
                            placeholder="상세 주소를 입력해주세요"
                            value={formData.detailAddress}
                            onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                        />
                    </div>
                </section>

                {/* Consent */}
                <section className="pt-6 border-t border-gray-100">
                    <h2 className="text-sm font-bold text-gray-700 mb-4">마케팅 정보 수신 동의 (선택)</h2>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.emailConsent}
                                onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                            />
                            <span className="text-sm text-gray-600">이메일 수신</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.smsConsent}
                                onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-navy-900 focus:ring-navy-900"
                            />
                            <span className="text-sm text-gray-600">SMS 수신</span>
                        </label>
                    </div>
                </section>

                {/* Captcha Placeholder */}
                <div className="flex justify-center pt-4">
                    {/* 
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                        onChange={() => {}}
                    /> 
                    */}
                    <div className="w-[304px] h-[78px] bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-sm"></div>
                            <span className="text-sm text-gray-500 font-medium">로봇이 아닙니다 (Design Only)</span>
                        </div>
                        <div className="ml-4 flex flex-col items-center">
                            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="recaptcha" className="w-8 opacity-50" />
                            <span className="text-[8px] text-gray-400">reCAPTCHA</span>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-navy-900 text-white font-black text-lg rounded-none hover:bg-navy-800 transition shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? "처리중..." : "회원가입 완료"}
                    </button>
                </div>
            </form>

            {/* Daum Postcode Modal */}
            {isPostcodeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative">
                        <button
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
    );
}
