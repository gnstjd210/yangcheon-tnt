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
  title: "양천TNT스포츠 아카데미",
  description: "양천구 최고의 축구 아카데미 - 유소년부터 성인까지",
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

          {/* Floating Kakao Talk Button */}
          <a
            href="https://pf.kakao.com/_vxdkcG/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#FEE500] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            aria-label="카카오톡 상담하기"
          >
            <svg className="w-8 h-8 fill-[#000000]" viewBox="0 0 24 24">
              <path d="M12 3c-5.5 0-10 3.5-10 7.8 0 2.7 1.7 5.1 4.3 6.4-.3 1.2-1.1 3.8-1.1 4 0 .2.2.3.4.2 1.9-1.3 4.5-3.1 4.5-3.1.6.1 1.2.2 1.9.2 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
            </svg>
          </a>
        </AuthProvider>
      </body>
    </html>
  );
}
