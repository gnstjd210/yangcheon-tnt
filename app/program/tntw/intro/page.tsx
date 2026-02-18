import Image from "next/image";

export default function TNTWIntroPage() {
    return (
        <div className="w-full bg-white">
            {/* Compact Top Box (Reduced Padding & Rounded) */}
            <div className="bg-white pt-4 pb-8">
                <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 flex items-center justify-center overflow-hidden rounded-3xl mx-4">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1516731237713-fc8888a37f4e?q=80&w=1000&auto=format&fit=crop" // Placeholder
                        alt="TNT W Background"
                        fill
                        className="object-cover opacity-50"
                    />
                    <div className="relative z-20 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                            TNT W
                        </h1>
                        <p className="text-sky-400 font-bold tracking-widest text-sm">
                            Women&apos;s Football Team
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row items-stretch gap-12">
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 relative min-h-[400px]">
                        <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=1000&auto=format&fit=crop"
                                alt="TNT W Training"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/40 to-transparent"></div>
                        </div>
                    </div>

                    {/* Right: Text */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-5xl font-black text-navy-900 mb-8 leading-tight">
                            함께 뛰는 즐거움,<br />
                            <span className="text-sky-600">TNT W</span>
                        </h2>
                        <div className="w-16 h-1.5 bg-navy-900 mb-8"></div>
                        <div className="space-y-6 text-gray-600 font-medium leading-relaxed text-lg">
                            <p>
                                TNT W는 축구를 사랑하는 여성들을 위한 팀입니다.<br />
                                초보자부터 숙련자까지 누구나 즐겁게 참여할 수 있으며,
                                체계적인 훈련을 통해 실력을 향상시킬 수 있습니다.
                            </p>
                            <p>
                                열정 넘치는 동료들과 함께 땀 흘리며 스트레스를 날려버리고,
                                새로운 활력을 찾아보세요.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
