"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// daftar menu yang tersedia di dashboard admin
const menus = [
  {
    title: "Kelola Galeri",
    description: "Atur foto dan dokumentasi kuliner Bali.",
    icon: "bx-images",
    href: "/admin/galeri",
    number: "01",
  },
  {
    title: "Kelola Postingan",
    description: "Atur artikel dan informasi kuliner.",
    icon: "bx-news",
    href: "/admin/postingan",
    number: "02",
  },
  {
    title: "Kelola Resto",
    description: "Atur rekomendasi restoran favorit.",
    icon: "bx-restaurant",
    href: "/admin/resto",
    number: "03",
  },
  {
    title: "Feedback FAQ",
    description: "Lihat hasil vote \"Jawaban ini membantu?\" dari pengunjung.",
    icon: "bx-message-square-check",
    href: "/admin/faq",
    number: "04",
  },
];

export default function AdminPage() {
  const router = useRouter();

  // mengecek apakah pengguna yang masuk punya role admin
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    // kalau bukan admin atau belum login, arahkan ke halaman login
    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="admin-page py-5">
      <div className="container">

        {/* bagian sambutan dashboard admin */}
        <div className="admin-welcome mb-5">
          <div className="admin-dashboard-top">
            <span className="admin-eyebrow">ADMIN PANEL</span>
            <span className="admin-status">
              <i className="bx bx-circle"></i> Administrator
            </span>
          </div>

          <h1>Dashboard Admin</h1>
          <p>
            Selamat datang, Admin! Kelola konten website Babi Guling
            dengan mudah melalui dashboard ini.
          </p>

          <div className="admin-welcome-bottom">
            <i className="bx bx-layout"></i>
            <span>Content Management System</span>
          </div>
        </div>

        {/* judul bagian dan jumlah menu yang tersedia */}
        <div className="admin-section-heading mb-4">
          <div>
            <h2 className="admin-section-title">Kelola Website</h2>
            <p className="admin-section-desc">
              Pilih bagian yang ingin kamu kelola.
            </p>
          </div>
          <span className="admin-total-menu">{menus.length} Menu</span>
        </div>

        {/* menampilkan setiap menu dalam bentuk kartu */}
        <div className="row g-4">
          {menus.map((menu) => (
            <div className="col-md-6 col-xl-3" key={menu.href}>
            {/* mengarahkan admin ke halaman sesuai menu yang dipilih */}
              <Link href={menu.href} className="admin-menu-card">
                <div className="admin-card-top">
                  <div className="admin-menu-icon">
                    <i className={`bx ${menu.icon}`}></i>
                  </div>
                  <span className="admin-card-number">
                    {menu.number}
                  </span>
                </div>

                <div>
                  <h3>{menu.title}</h3>
                  <p>{menu.description}</p>
                </div>

                <span className="admin-menu-link">
                  Buka pengelolaan
                  <i className="bx bx-right-arrow-alt"></i>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}