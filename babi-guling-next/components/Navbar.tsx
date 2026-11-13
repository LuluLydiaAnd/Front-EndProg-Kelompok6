"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const publicMenu = [
  { label: "Home", href: "/" },
  { label: "Galeri", href: "/galeri" },
  { label: "FAQ", href: "/faq" },
  { label: "Postingan", href: "/postingan" },
  { label: "Resto Favorit", href: "/resto" },
  { label: "Contact", href: "/kontak" },
];

const adminMenu = [
  { label: "Dashboard", href: "/admin" },
  { label: "Kelola Galeri", href: "/admin/galeri" },
  { label: "Kelola Postingan", href: "/admin/postingan" },
  { label: "Kelola Resto", href: "/admin/resto" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith("/admin");

  function handleLogout() {
    sessionStorage.removeItem("user");
    router.replace("/login");
  }

  const menus = isAdmin ? adminMenu : publicMenu;

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
                  className={
                    "nav-link" +
                    (pathname === item.href ? " active" : "")
                  }
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {isAdmin ? (
              <li className="nav-item ms-lg-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleLogout}
                >
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
