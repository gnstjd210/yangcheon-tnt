interface CustomPageHeaderProps {
    pageKey?: string;
    fallbackTitle: string;
    fallbackSubtitle: string;
}

export default function CustomPageHeader({ fallbackTitle, fallbackSubtitle }: CustomPageHeaderProps) {
    return (
        <div className="bg-white pt-4 pb-8">
            <div className="relative h-48 max-w-[1920px] mx-auto md:w-[95%] bg-navy-900 overflow-hidden rounded-3xl mx-4 shadow-xl flex flex-col items-center justify-center px-8 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 whitespace-pre-wrap drop-shadow-lg">
                    {fallbackTitle}
                </h1>
                <p className="text-sm md:text-base font-bold text-sky-300 tracking-widest whitespace-pre-wrap drop-shadow-md">
                    {fallbackSubtitle}
                </p>
            </div>
        </div>
    );
}
