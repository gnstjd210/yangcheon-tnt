export type HeroImage = {
    image: string;
    title: string;
    subtitle: string;
};

export type QuickMenu = {
    label: string;
    href: string;
    desc: string;
    image: string;
};

export type ProgramPreview = {
    title: string;
    desc: string;
    img: string;
    href: string;
};

// Default values to use if DB is empty
export const DEFAULT_HERO_IMAGES: HeroImage[] = [
    {
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop',
        title: 'THE BEST PLACE\nFOR YOUR DREAM',
        subtitle: '양천 TNT FC 2026 Season',
    },
    {
        image: 'https://images.unsplash.com/photo-1543326727-b5a364656897?q=80&w=2670&auto=format&fit=crop',
        title: 'PROFESSIONAL\nTRAINING SYSTEM',
        subtitle: '체계적인 유소년 육성 프로그램',
    },
    {
        image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2670&auto=format&fit=crop',
        title: 'BECOME A LEGEND\nWITH TNT FC',
        subtitle: '당신의 열정을 응원합니다',
    }
];

export const DEFAULT_QUICK_MENU: QuickMenu[] = [
    {
        label: '입단신청',
        href: '/join',
        desc: 'Membership',
        image: 'https://images.unsplash.com/photo-1517466787929-bc90951d6428?q=80&w=2550&auto=format&fit=crop'
    },
    {
        label: '체험수업신청',
        href: '/trial',
        desc: 'Trial Class',
        image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2629&auto=format&fit=crop'
    },
    {
        label: '재수강결제',
        href: '/payment',
        desc: 'Payment',
        image: 'https://images.unsplash.com/photo-1606925797300-0b35e9d17d27?q=80&w=2670&auto=format&fit=crop'
    },
    {
        label: '갤러리',
        href: '/gallery',
        desc: 'Photo & Video',
        image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=2670&auto=format&fit=crop'
    },
];

export const DEFAULT_PROGRAMS: ProgramPreview[] = [
    {
        title: '유소년 아카데미',
        desc: 'YOUTH ACADEMY',
        img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2670&auto=format&fit=crop',
        href: '/program/youth',
    },
    {
        title: '성인 그룹 레슨',
        desc: 'ADULT GROUP LESSON',
        img: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=2500&auto=format&fit=crop',
        href: '/program/adult',
    },
    {
        title: '피지컬 트레이닝',
        desc: 'PHYSICAL TRAINING',
        img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop',
        href: '/program/physical',
    },
    {
        title: 'TNT W 등록',
        desc: 'TNTW REGISTRATION',
        img: 'https://images.unsplash.com/photo-1628891890377-571b78f237d7?q=80&w=2671&auto=format&fit=crop',
        href: '/program/tntw',
    }
];
