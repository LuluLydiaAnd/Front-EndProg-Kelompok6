"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const menus = [
  {
    title: "Kelola Galeri",
    description: "Atur foto dan dokumentasi kuliner Bali.",
    icon: "bx-images",
    href: "/admin/galeri",
  },
  {
    title: "Kelola Postingan",
    description: "Atur artikel dan informasi kuliner.",
    icon: "bx-news",
    href: "/admin/postingan",
  },
  {
    title: "Kelola Resto",
    description: "Atur rekomendasi restoran favorit.",
    icon: "bx-restaurant",
    href: "/admin/resto",
  },
];

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="container py-5 admin-page">
      <div className="admin-welcome mb-5">
        <span className="admin-eyebrow">ADMIN PANEL</span>
        <h1>Dashboard Admin</h1>
        <p>
          Selamat datang, Admin! Kelola konten website Babi Guling
          dari satu tempat.
        </p>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="admin-section-title">Kelola Website</h2>
          <p className="admin-section-desc mb-0">
            Pilih bagian yang ingin kamu kelola.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {menus.map((menu) => (
          <div className="col-md-6 col-xl-3" key={menu.href}>
            <Link href={menu.href} className="admin-menu-card">
              <div className="admin-menu-icon">
                <i className={`bx ${menu.icon}`}></i>
              </div>

              <h3>{menu.title}</h3>
              <p>{menu.description}</p>

              <span className="admin-menu-link">
                Buka pengelolaan
                <i className="bx bx-right-arrow-alt"></i>
              </span>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
