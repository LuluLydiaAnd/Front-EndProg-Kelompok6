"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
};

const publicMenu: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Galeri", href: "/galeri" },
  { label: "Postingan", href: "/postingan" },
  { label: "Resto Favorit", href: "/resto" },
];

const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Kelola Galeri", href: "/admin/galeri" },
  { label: "Kelola Postingan", href: "/admin/postingan" },
  { label: "Kelola Resto", href: "/admin/resto" },
  { label: "Feedback FAQ", href: "/admin/faq" },
];

function subscribe() {
  return () => {};
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  // Cek siapa yang sedang login (dari sessionStorage)
  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );
  const user = raw ? (JSON.parse(raw) as { name: string | null; role: string }) : null;

  function handleLogout() {
    sessionStorage.removeItem("user");
    router.replace("/login");
  }

  const menus = isAdmin ? adminMenu : publicMenu;

  // Halaman user (/user/...) punya sidebar sendiri, jadi navbar tidak ditampilkan
  if (pathname.startsWith("/user")) return null;

  return (
    <nav className="navbar navbar-expand-lg bg-brand-nav">
      <div className="container">
        <Link
          className="navbar-brand"
          href={isAdmin ? "/admin" : "/"}
          onClick={() => setOpen(false)}
        >
          Babi Guling
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <i className="bx bx-menu"></i>
        </button>

        <div className={`collapse navbar-collapse${open ? " show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
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

            {isAdmin ? (
              <li className="nav-item ms-lg-2">
                <button className="btn btn-outline-danger" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            ) : user ? (
              // Sudah login: tampilkan tombol ke dashboard
              <li className="nav-item">
                <Link
                  className="nav-link login-link"
                  href={user.role === "admin" ? "/admin" : "/user/dashboard"}
                  onClick={() => setOpen(false)}
                >
                  <i className="bx bx-user me-1"></i>
                  {user.role === "admin" ? "Dashboard Admin" : "Dashboard Saya"}
                </Link>
              </li>
            ) : (
              // Belum login
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