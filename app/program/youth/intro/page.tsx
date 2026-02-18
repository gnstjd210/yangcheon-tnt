import Image from "next/image";

export default function YouthIntroPage() {
    return (
        <div className="w-full bg-white">
            {/* Compact Top Box (Reduced Padding & Rounded) */}
            <div className="bg-white pt-4 pb-8">
                <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 flex items-center justify-center overflow-hidden rounded-3xl mx-4">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <div className="relative z-20 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            YOUTH ACADEMY
                        </h1>
                        <p className="text-sky-400 font-bold tracking-widest text-sm">
                            유소년 아카데미
                        </p>
                    </div>
                </div>
            </div>

            {/* Split Layout: Left Image + Right Text */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-stretch gap-12">

                    {/* LEFT: Image Section (Rounded Corners) */}
                    <div className="w-full md:w-1/2 relative min-h-[400px]">
                        <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1516731237713-fc8888a37f4e?q=80&w=1000&auto=format&fit=crop"
                                alt="Youth Soccer Training"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent"></div>
                        </div>
                        {/* Decor Element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-500 rounded-full -z-10 hidden md:block" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-100 rounded-full -z-10 hidden md:block" />
                    </div>

                    {/* RIGHT: Text Content */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-8 leading-tight">
                            축구를 통해<br />
                            <span className="text-sky-600">더 큰 가치</span>를<br />
                            배우는 시간
                        </h2>

                        <div className="w-16 h-1.5 bg-navy-900 mb-8"></div>

                        <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg">
                            <p>
                                양천 TNT 스포츠 아카데미는 단순한 기술 습득을 넘어,
                                <strong className="text-navy-900"> 올바른 인성</strong>과
                                <strong className="text-navy-900"> 건강한 신체</strong>를 기르는 것을 목표로 합니다.
                            </p>
                            <p>
                                친구들과 함께 땀 흘리며 협동심을 배우고,
                                승패를 떠나 정정당당하게 경쟁하는 법을 익히며,
                                스스로 목표를 세우고 도전하는 과정을 통해 성장합니다.
                            </p>
                            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-sky-500 mt-4">
                                <p className="text-navy-900 italic font-bold">
                                    &quot;꿈을 향해 달리는 아이들의 힘찬 발걸음,<br />
                                    양천 TNT가 함께 응원하겠습니다.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
