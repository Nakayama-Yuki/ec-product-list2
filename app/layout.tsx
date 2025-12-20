import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EC商品一覧アプリ",
  description: "シンプルなEC商品一覧アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
