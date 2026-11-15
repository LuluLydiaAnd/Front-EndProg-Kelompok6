"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type SessionUser = { name: string | null; email: string; role: string };

// memantau perubahan data session
function subscribe() {
  return () => {};
}

export default function UserDashboardPage() {
  const router = useRouter();

  // mengambil data pengguna dari session storage
  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );
  const user: SessionUser | null = raw ? JSON.parse(raw) : null;

  // mengarahkan pengguna jika belum login atau yang login adalah admin
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

  // menghapus sesi pengguna saat logout
  function handleLogout() {
    sessionStorage.removeItem("user");
    router.push("/login");
  }

  // menyembunyikan halaman jika pengguna belum login atau berperan sebagai admin
  if (!user || user.role === "admin") return null;

  return (
    <main className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <p className="text-uppercase small mb-1">Dashboard User</p>
          <h2 className="mb-0">Halo, {user.name}!</h2>
        </div>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <p className="text-muted">
        Di sini nanti ada konten yang kamu like, komentari, dan favoritkan.
      </p>
    </main>
  );
}