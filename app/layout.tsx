import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "나는, 아직 쓰이는 중입니다.",
  description: "나의 시간을 페이지마다 직접 꾸미는 개인 스토리텔링 공간",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
