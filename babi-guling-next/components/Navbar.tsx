"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type MenuItem = {
  label: string;
  href: string;
  icon: string;
};

const publicMenu: MenuItem[] = [
  { label: "Home", href: "/", icon: "bx-home" },
  { label: "Galeri", href: "/galeri", icon: "bx-image" },
  { label: "Postingan", href: "/postingan", icon: "bx-news" },
  { label: "Resto Favorit", href: "/resto", icon: "bx-restaurant" },
];

const adminMenu: MenuItem[] = [
  { label: "Dashboard", href: "/admin", icon: "bx-grid-alt" },
  { label: "Kelola Galeri", href: "/admin/galeri", icon: "bx-image" },
  { label: "Kelola Postingan", href: "/admin/postingan", icon: "bx-news" },
  { label: "Kelola Resto", href: "/admin/resto", icon: "bx-restaurant" },
  { label: "Feedback FAQ", href: "/admin/faq", icon: "bx-message-square-check" },
];

function subscribe() {
  return () => {};
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = pathname.startsWith("/admin");

  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );

  const user = raw
    ? (JSON.parse(raw) as {
        name: string | null;
        email: string;
        role: string;
      })
    : null;

  function handleLogout() {
    sessionStorage.removeItem("user");
    router.replace("/login");
  }

  const menus = isAdmin ? adminMenu : publicMenu;

  if (pathname.startsWith("/user")) return null;

  // Sidebar khusus halaman admin
  if (isAdmin) {
    return (
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-profile">
            <div className="admin-avatar">
              {user?.name?.charAt(0).toUpperCase() || "B"}
            </div>

            {!collapsed && (
              <div className="admin-profile-info">
                <strong>{user?.name || "Administrator"}</strong>
                <span>{user?.email || "Admin"}</span>
              </div>
            )}
          </div>
        </div>

        <button
          className="admin-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Buka atau kecilkan sidebar"
        >
          <i className={`bx ${collapsed ? "bx-chevron-right" : "bx-chevron-left"}`}></i>
        </button>

        <nav className="admin-sidebar-menu">
          {menus.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-link ${active ? "active" : ""}`}
                title={collapsed ? item.label : ""}
              >
                <i className={`bx ${item.icon}`}></i>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            className="admin-sidebar-link admin-logout"
            onClick={handleLogout}
            title={collapsed ? "Logout" : ""}
          >
            <i className="bx bx-log-out"></i>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    );
  }

  // Navbar untuk pengunjung website
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

            {user ? (
              <li className="nav-item">
                <Link
                  className="nav-link login-link"
                  href={user.role === "ADMIN" ? "/admin" : "/user/dashboard"}
                  onClick={() => setOpen(false)}
                >
                  <i className="bx bx-user me-1"></i>
                  Dashboard Saya
                </Link>
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
