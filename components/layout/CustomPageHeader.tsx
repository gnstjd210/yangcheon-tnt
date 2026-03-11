import Image from "next/image";

interface CustomPageHeaderProps {
    pageKey?: string;
    fallbackTitle: string;
    fallbackSubtitle: string;
}

export default function CustomPageHeader({ fallbackTitle, fallbackSubtitle }: CustomPageHeaderProps) {
    return (
        <div className="bg-white pt-4 pb-8">
            <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] overflow-hidden rounded-3xl mx-4 shadow-xl">
                {/* Static Background Image */}
                <Image
                    src="/images/banner-bg.png"
                    alt="Section Banner"
                    fill
                    className="object-cover object-center"
                    priority
                />

                {/* Dark Overlay for better text readability, if the user's image doesn't have it built-in */}
                <div className="absolute inset-0 bg-navy-900/40 z-10" />

                {/* Text positioning based on the user's requirement: "흰색 선으로 된 네모 빈칸 안에 각 페이지 제목" */}
                {/* We assume the white box is centrally located based on standard banner design patterns */}
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-8">
                    {/* Optional: we can draw a CSS border box to mimic the "white box" if the image box is hard to align, 
                        or we just rely on visual centering. The request says "배너 이미지 내 흰색 선으로 된 네모 빈칸 안에". 
                        Usually, absolute centering (`flex justify-center items-center h-full`) works perfectly for symmetric backgrounds. */}
                    <div className="relative">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 text-center whitespace-pre-wrap drop-shadow-lg">
                            {fallbackTitle}
                        </h1>
                        <p className="text-sm md:text-base font-bold text-sky-300 tracking-widest text-center whitespace-pre-wrap drop-shadow-md">
                            {fallbackSubtitle}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
