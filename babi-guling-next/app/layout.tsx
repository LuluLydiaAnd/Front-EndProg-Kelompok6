import type { Metadata } from "next";

// import css bootstrap, ikon, dan style global
import "bootstrap/dist/css/bootstrap.min.css";
import "boxicons/css/boxicons.min.css";
import "./globals.css";

// import navbar yang digunakan di seluruh halaman
import Navbar from "@/components/Navbar";

// metadata untuk judul website di browser
export const metadata: Metadata = {
  title: "Babi Guling - Ensiklopedia & Rekomendasi Kuliner Bali",
};

// layout utama yang membungkus seluruh halaman website
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {/* navbar ditampilkan di setiap halaman */}
        <Navbar />

        {/* menampilkan konten sesuai halaman yang dibuka */}
        {children}
      </body>
    </html>
  );
}