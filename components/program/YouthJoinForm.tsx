"use client";

import { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { ChevronDown, ChevronUp, Check, Search } from "lucide-react";
import { submitRegistration } from "@/app/actions/registration";

export default function YouthJoinForm() {
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        detailAddress: "",
        experience: "",
        agreed: false
    });

    const handleAddressComplete = (data: { address: string; addressType: string; bname: string; buildingName: string }) => {
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

        setAddress(fullAddress);
        setIsPostcodeOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreed) {
            alert("약관에 동의해주세요.");
            return;
        }

        setIsSubmitting(true);
        const form = new FormData();
        form.append("name", formData.name);
        form.append("phone", formData.phone);
        form.append("email", formData.email);
        form.append("address", address);
        form.append("detailAddress", formData.detailAddress);
        form.append("experience", formData.experience);
        form.append("type", "Youth");

        try {
            const result = await submitRegistration(form);
            if (result.success) {
                alert(result.message);
                // Reset form or redirect
                window.location.href = "/";
            } else {
                alert(result.message);
            }
        } catch {
            alert("알 수 없는 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-navy-900 mb-2">입단 신청</h2>
                <p className="text-gray-500">
                    꿈을 향한 첫걸음, 양천 TNT와 함께하세요.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Terms Section */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-navy-900 flex items-center gap-2">
                            <Check size={18} className={formData.agreed ? "text-sky-500" : "text-gray-300"} />
                            약관 동의 (필수)
                        </h3>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.agreed}
                                onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                                className="w-5 h-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                            />
                            <span className="text-sm font-bold text-gray-700">전체 동의하기</span>
                        </label>
                    </div>

                    {/* Accordion 1: Terms */}
                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() => setIsTermsOpen(!isTermsOpen)}
                            className="w-full flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <span>회원가입 약관</span>
                            {isTermsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {isTermsOpen && (
                            <div className="p-4 text-xs text-gray-500 bg-white border-x border-b border-gray-200 rounded-b-lg h-32 overflow-y-auto leading-relaxed">
                                제1조(목적) 이 약관은 회사(전자상거래 사업자)가 운영하는 사이버 몰(이하 “몰”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버 몰과 이용자의 권리․의무 및 책임사항을 규정함을 목적으로 합니다.<br />
                                제2조(정의) ① “몰”이란 회사가 재화 또는 용역(이하 “재화 등”이라 한다)을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.
                            </div>
                        )}
                    </div>

                    {/* Accordion 2: Privacy */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                            className="w-full flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <span>개인정보처리방침</span>
                            {isPrivacyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {isPrivacyOpen && (
                            <div className="p-4 text-xs text-gray-500 bg-white border-x border-b border-gray-200 rounded-b-lg h-32 overflow-y-auto leading-relaxed">
                                1. 개인정보의 처리 목적 <br />
                                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.<br />
                                2. 개인정보의 처리 및 보유 기간 <br />
                                ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-2">이름</label>
                        <input
                            type="text"
                            placeholder="신청자 성함"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-2">연락처</label>
                            <input
                                type="tel"
                                placeholder="010-0000-0000"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-navy-900 mb-2">이메일</label>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Address Search */}
                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-2">주소</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="주소 검색을 클릭하세요"
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                                value={address}
                                readOnly
                                onClick={() => setIsPostcodeOpen(true)}
                            />
                            <button
                                type="button"
                                onClick={() => setIsPostcodeOpen(true)}
                                className="bg-navy-900 text-white px-4 py-3 rounded-lg hover:bg-navy-800 transition flex items-center gap-2 font-bold whitespace-nowrap"
                            >
                                <Search size={18} />
                                주소 검색
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="상세 주소를 입력하세요"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500"
                            value={formData.detailAddress}
                            onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
                        />
                    </div>

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

                    <div>
                        <label className="block text-sm font-bold text-navy-900 mb-2">축구 구력 / 경험</label>
                        <textarea
                            placeholder="축구를 배운 경험이 있다면 적어주세요."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-sky-500 min-h-[100px]"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        />
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="flex-1 py-4 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition shadow-lg shadow-sky-200 disabled:opacity-50"
                    >
                        {isSubmitting ? "처리중..." : "입단 신청하기"}
                    </button>
                </div>
            </form>
        </div>
    );
}
