import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import AuthProvider from '@/components/providers/AuthProvider';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import KakaoFloatingBtn from "@/components/layout/KakaoFloatingBtn";
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
          <Header />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <KakaoFloatingBtn />
        </AuthProvider>
      </body>
    </html>
  );
}
