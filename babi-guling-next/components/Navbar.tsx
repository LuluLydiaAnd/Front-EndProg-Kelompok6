"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// tipe data untuk setiap menu navigasi
type MenuItem = {
  label: string;
  href: string;
};

// daftar menu untuk pengunjung website
const publicMenu: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Galeri", href: "/galeri" },
  { label: "Postingan", href: "/postingan" },
  { label: "Resto Favorit", href: "/resto" },
];

// daftar menu khusus halaman admin
const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Kelola Galeri", href: "/admin/galeri" },
  { label: "Kelola Postingan", href: "/admin/postingan" },
  { label: "Kelola Resto", href: "/admin/resto" },
];

export default function Navbar() {
  // menyimpan status menu navigasi pada tampilan responsif
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // mengecek apakah pengguna sedang berada di halaman admin
  const isAdmin = pathname.startsWith("/admin");

  // menghapus data sesi pengguna dan mengarahkan ke halaman login
  function handleLogout() {
    sessionStorage.removeItem("user");
    router.replace("/login");
  }

  // memilih daftar menu sesuai halaman yang sedang dibuka
  const menus = isAdmin ? adminMenu : publicMenu;

  return (
    // navigasi utama website
    <nav className="navbar navbar-expand-lg bg-brand-nav">
      <div className="container">
        {/* logo website yang mengarah ke halaman utama sesuai akses */}
        <Link
          className="navbar-brand"
          href={isAdmin ? "/admin" : "/"}
          onClick={() => setOpen(false)}
        >
          Babi Guling
        </Link>

        {/* tombol untuk membuka atau menutup menu di layar kecil */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <i className="bx bx-menu"></i>
        </button>

        {/* daftar navigasi yang ditampilkan sesuai status menu */}
        <div className={`collapse navbar-collapse${open ? " show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* menampilkan setiap menu navigasi */}
            {menus.map((item) => (
              <li className="nav-item" key={item.href}>
                <Link
                  className={"nav-link" + (pathname === item.href ? " active" : "")}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* menampilkan tombol logout untuk admin atau login untuk pengunjung */}
            {isAdmin ? (
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link login-link"
                  href="/login"
                  onClick={() => setOpen(false)}
                >
                  Log In / Daftar
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
