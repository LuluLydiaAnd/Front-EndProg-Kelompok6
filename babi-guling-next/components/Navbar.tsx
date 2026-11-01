"use client";

import { useState } from "react";
import Link from "next/link";

type MenuItem = {
  label: string;
  href: string;
};

const menu: MenuItem[] = [
  { label: "Home", href: "#home" },
  { label: "Galeri", href: "#galeri" },
  { label: "Postingan", href: "#postingan" },
  { label: "Resto Favorit", href: "#resto" },
  { label: "Contact", href: "#kontak" },
];

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <nav className="navbar navbar-expand-lg bg-brand-nav">
      <div className="container">
        <Link className="navbar-brand" href="#home">
          Babi Guling
        </Link>

        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
          <i className="bx bx-menu"></i>
        </button>

        <div className={"collapse navbar-collapse" + (open ? " show" : "")}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {menu.map((item, i) => (
              <li className="nav-item" key={item.href}>
                <a className={"nav-link" + (i === 0 ? " active" : "")} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
            <li className="nav-item">
              <a className="nav-link login-link" href="#">
                Log In / Daftar
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
