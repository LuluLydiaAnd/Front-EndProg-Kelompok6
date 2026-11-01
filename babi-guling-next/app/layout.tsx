import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Babi Guling - Ensiklopedia & Rekomendasi Kuliner Bali",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
