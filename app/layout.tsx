import type { Metadata } from "next";
import "../public/storyframe/studio.css";

export const metadata: Metadata = {
  title: "STORYFRAME — 나의 이야기 웹사이트 만들기",
  description: "살아온 순간을 한 화면씩 펼치고, 연대기마다 글과 분위기를 꾸미는 개인 스토리텔링 웹",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
