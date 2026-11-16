"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./user.module.css";

type SessionUser = {
  id?: number;
  name: string | null;
  email: string;
  role: string;
};

function subscribe() {
  return () => {};
}

const menu = [
  { href: "/user/dashboard", label: "Dashboard", icon: "bx bxs-dashboard" },
  { href: "/user/profil", label: "Profil Saya", icon: "bx bx-user-circle" },
  { href: "/user/komentar", label: "Komentar Saya", icon: "bx bx-message-square-detail" },
  { href: "/user/favorit", label: "Favorit Saya", icon: "bx bxs-bookmark" },
  { href: "/", label: "Lihat Situs", icon: "bx bx-home-alt" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );
  const user: SessionUser | null = raw ? JSON.parse(raw) : null;

  // Halaman user hanya untuk user biasa yang sudah login
  useEffect(() => {
    const data = sessionStorage.getItem("user");
    if (!data) {
      router.replace("/login");
      return;
    }
    if (JSON.parse(data).role === "admin") {
      router.replace("/admin");
    }
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("user");
    router.push("/login");
  }

  if (!user || user.role === "admin") return null;

  const username = "@" + user.email.split("@")[0];

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ""}`}>
      <aside className={styles.sidebar}>
        <div className={styles.profile}>
          <strong>{user.name}</strong>
          <span>{username}</span>

          <button
            type="button"
            className={styles.toggle}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Buka sidebar" : "Tutup sidebar"}
          >
            <i className={collapsed ? "bx bx-chevron-right" : "bx bx-chevron-left"}></i>
          </button>
        </div>

        <nav className={styles.menu}>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`${styles.menuItem} ${
                pathname === item.href ? styles.active : ""
              }`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button type="button" className={styles.logout} onClick={handleLogout}>
          <i className="bx bx-log-out"></i>
          <span>Logout</span>
        </button>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}