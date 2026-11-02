"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
};

const menu: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Galeri", href: "/galeri" },
  { label: "FAQ", href: "/faq" },
  { label: "Postingan", href: "/postingan" },
  { label: "Resto Favorit", href: "/resto" },
  { label: "Contact", href: "/kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg bg-brand-nav">
      <div className="container">
        <Link
          className="navbar-brand"
          href="/"
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

        <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {menu.map((item) => (
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

            <li className="nav-item">
              <Link
                className="nav-link login-link"
                href="/login"
                onClick={() => setOpen(false)}
              >
                Log In / Daftar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
