import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import AuthProvider from '@/components/providers/AuthProvider';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChannelTalkProvider from "@/components/providers/ChannelTalkProvider";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "양천 TNT 스포츠 아카데미 | 김진국 축구교실 1995",
  description: "양천구 목동 최고의 유소년 축구교실. 30년 전통 김진국 감독의 체계적인 훈련과 엘리트 피지컬 트레이닝을 경험하세요.",
  keywords: "양천구 축구교실, 목동 축구교실, 유소년 축구, 김진국 축구교실, TNT 스포츠 아카데미",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION as string,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} antialiased`}
      >
        <AuthProvider>
          <ChannelTalkProvider />
          <Header />
          <main className="min-h-screen pt-[120px]">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
