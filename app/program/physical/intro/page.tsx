"use client";

import { useState } from "react";
import { Activity, CheckCircle2, HeartPulse, Trophy } from "lucide-react";

// TABS DATA
const TABS = [
    { id: "posture", label: "자세교정" },
    { id: "pain", label: "통증케어" },
    { id: "function", label: "기능개선" },
    { id: "sports", label: "스포츠 퍼포먼스" },
];

export default function PhysicalIntroPage() {
    const [activeTab, setActiveTab] = useState("posture");

    return (
        <div className="pb-24 animate-in fade-in duration-700">
            {/* Inner Sub-Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-2.5 rounded-full font-bold text-sm md:text-base transition-all shadow-sm border ${activeTab === tab.id
                                    ? "bg-navy-900 text-white border-navy-900"
                                    : "bg-white text-gray-500 hover:bg-sky-50 hover:text-navy-900 border-gray-200"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TABS CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                {activeTab === "posture" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">
                                내 몸의 문제,<br />
                                <span className="text-sky-600">진짜 원인을 알고 제대로 교정하세요</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-navy-900 mx-auto mt-8 mb-8"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                일상에서 발생하는 대부분의 체형 고민은 나쁜 자세 습관에서 시작됩니다. TSA 피지컬 트레이닝은 과학적인 인체 평가를 통해 자세 불균형을 교정하고 건강한 척추 환경을 만듭니다.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={Activity}
                                title="거북목 & 체형 고민 해결"
                                desc="오랜 시간 같은 자세로 앉아 있는 직장인과 학생을 위해 신체역학적인 트레이닝을 제공하여 거북목, 굽은 등, 오다리를 개선합니다."
                            />
                            <FeatureCard
                                icon={CheckCircle2}
                                title="척추 측만증 안정화"
                                desc="틀어진 척추로 인한 불편함과 구조적 변형을 예방합니다. 호흡 패턴과 걷기 등 일상 동작의 어려움을 피지오 트레이너가 체계적으로 관리합니다."
                            />
                            <FeatureCard
                                icon={HeartPulse}
                                title="성장기 균형 관리"
                                desc="청소년기의 틀어진 자세는 성인 근골격계 질환의 원인이 됩니다. 바른 자세 유지 습관을 길러주고 신경근 밸런스를 맞춰 올바른 성장을 돕습니다."
                            />
                        </div>
                    </div>
                )}

                {activeTab === "pain" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">
                                지속적인 트레이닝으로<br />
                                <span className="text-sky-600">근본적인 통증 원인을 해결하세요</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-navy-900 mx-auto mt-8 mb-8"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                다양한 치료 후에도 통증이 계속된다면, 진짜 원인은 다른 부위에 숨어 있을 수 있습니다. 무너진 신체 밸런스를 회복하고 재발을 방지하는 맞춤 솔루션을 제공합니다.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={Activity}
                                title="숨어있는 만성통증 케어"
                                desc="효과가 일시적이었다면 문제는 움직임에 있습니다. 통증을 유발하는 진짜 원인을 찾아내어 근본적으로 통증을 감소시킵니다."
                            />
                            <FeatureCard
                                icon={CheckCircle2}
                                title="관절 통증 및 퇴행 예방"
                                desc="아프지 않은 자세만 찾다 보면 주변 근육과 관절이 굳어집니다. 내 몸의 적절한 사용법을 훈련시켜 과부하와 손상을 방지합니다."
                            />
                            <FeatureCard
                                icon={HeartPulse}
                                title="사고 및 수술 후유증 재활"
                                desc="재활 타이밍을 놓치거나 잘못 잡힌 자세로 인한 지속적인 통증을 물리치료사 출신 코치진이 안전하고 빈틈없이 케어합니다."
                            />
                        </div>
                    </div>
                )}

                {activeTab === "function" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">
                                내 몸을 정확하게 사용하고<br />
                                <span className="text-sky-600">최상의 체력을 완성하세요</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-navy-900 mx-auto mt-8 mb-8"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                평범한 일상 속에서의 사소하게 자리잡은 나쁜 습관을 바로잡고, 지속 가능한 트레이닝을 통해 삶의 질과 스포츠 활동의 효율을 확실하게 끌어올립니다.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={CheckCircle2}
                                title="생활 습관 개선 및 관리"
                                desc="기본적인 일상 동작에서 발생하는 불균형을 해결하여 부상 없이 건강한 밸런스를 유지하도록 인체역학적으로 지도합니다."
                            />
                            <FeatureCard
                                icon={Activity}
                                title="유산소 및 기능형 근력"
                                desc="단순한 근육 펌핑이 아닌, 실전 활용도가 높은 코어와 펑셔널 모빌리티를 훈련시켜 기초 체력 저하와 질병을 예방합니다."
                            />
                            <FeatureCard
                                icon={Trophy}
                                title="여가·스포츠 효율 향상"
                                desc="골프, 테니스, 러닝 등 원하는 여가 스포츠를 즐길 때 부상을 방지하고, 움직임 패턴을 최적화하여 경기력을 끌어올립니다."
                            />
                        </div>
                    </div>
                )}

                {activeTab === "sports" && (
                    <div className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black text-navy-900 leading-tight">
                                엘리트 선수를 위한 맞춤형,<br />
                                <span className="text-sky-600">압도적인 스포츠 퍼포먼스 전문 케어</span>
                            </h2>
                            <div className="w-16 h-1.5 bg-navy-900 mx-auto mt-8 mb-8"></div>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                종목별 특성과 선수의 신체 조건을 완벽하게 분석하여, 부상 방지 및 기록 단축, 시합 전/후 최고의 컨디션을 유지할 수 있는 과학적 트레이닝을 제공합니다.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 justify-center">
                            <FeatureCard
                                icon={Trophy}
                                title="경기력 극대화 맞춤 관리"
                                desc="근육 사용법과 정밀한 신체 움직임을 교육하여 개인의 특성과 종목에 최적화된 퍼포먼스 향상과 탄탄한 기본기를 제공합니다."
                            />
                            <FeatureCard
                                icon={HeartPulse}
                                title="시합 전/후 컨디셔닝"
                                desc="경기 중 최적의 상태를 낼 수 있도록 과학적인 리커버리와 액티브 컨디셔닝을 적용하여 누적 피로를 빠르게 지워냅니다."
                            />
                            <FeatureCard
                                icon={CheckCircle2}
                                title="부상 방지 및 복귀 재활"
                                desc="과거 부상 트라우마 극복, 재발 방지를 위한 안전망 확보부터 수술 후 실전 감각을 되찾기 위한 단계별 엘리트 재활을 진행합니다."
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Reusable Inner Card
function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} className="text-navy-900" />
            </div>
            <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center mb-6 border border-sky-100">
                <Icon size={28} className="text-sky-500" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed relative z-10">{desc}</p>
        </div>
    );
}
