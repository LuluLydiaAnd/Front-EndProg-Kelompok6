"use client";

import { useEffect, useState } from "react";
import { getRingkasanUser } from "@/app/actions/interaksi";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type Aktivitas = {
  id: string;
  jenis: "suka" | "komentar" | "favorit";
  judul: string;
  isi: string;
  createdAt: Date;
};

type Ringkasan = {
  jumlahSuka: number;
  jumlahKomentar: number;
  jumlahFavorit: number;
  aktivitas: Aktivitas[];
};

const keteranganAktivitas = {
  suka: { icon: "bx bxs-heart", teks: "Kamu menyukai" },
  komentar: { icon: "bx bx-message-square", teks: "Kamu berkomentar di" },
  favorit: { icon: "bx bxs-bookmark", teks: "Kamu memfavoritkan" },
};

function formatWaktu(tanggal: Date) {
  return new Date(tanggal).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function UserDashboardPage() {
  const user = useSessionUser();
  const userId = user?.id;

  const [ringkasan, setRingkasan] = useState<Ringkasan | null>(null);
  const [muatUlang, setMuatUlang] = useState(0);
  const [memuat, setMemuat] = useState(false);

  // Ambil data dari database. Jalan lagi setiap tombol refresh ditekan.
  useEffect(() => {
    if (!userId) return;
    let aktif = true;

    getRingkasanUser(userId)
      .then((data) => {
        if (aktif) setRingkasan(data);
      })
      .finally(() => {
        if (aktif) setMemuat(false);
      });

    return () => {
      aktif = false;
    };
  }, [userId, muatUlang]);

  function handleRefresh() {
    setMemuat(true);
    setMuatUlang((n) => n + 1);
  }

  if (!user) return null;

  const stats = [
    { label: "Suka", value: ringkasan?.jumlahSuka ?? 0, desc: "Total suka kamu", icon: "bx bxs-heart" },
    { label: "Komentar", value: ringkasan?.jumlahKomentar ?? 0, desc: "Total komentar kamu", icon: "bx bx-message-square" },
    { label: "Favorit", value: ringkasan?.jumlahFavorit ?? 0, desc: "Total favorit kamu", icon: "bx bxs-bookmark" },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Halo, selamat datang 👋</p>
          <h1 className={styles.title}>Halo, {user.name}</h1>
          <p className={styles.subtitle}>
            Kelola aktivitas, favorit, dan komentar kamu di sini.
          </p>
        </div>

        <div className={styles.userChip}>
          <div className={styles.avatar}>
            <i className="bx bx-user"></i>
          </div>
          <div>
            <strong>{user.name}</strong>
            <small>Member</small>
          </div>
        </div>
      </header>

      {!userId && (
        <p className={styles.warning}>
          Data akun belum lengkap. Silakan logout lalu login ulang.
        </p>
      )}

      <section className={styles.stats}>
        {stats.map((item) => (
          <div key={item.label} className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className={item.icon}></i>
            </div>
            <div>
              <p className={styles.statLabel}>{item.label}</p>
              <p className={styles.statValue}>{item.value}</p>
              <p className={styles.statDesc}>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2>Aktivitas Terbaru</h2>
            <p>Aktivitas kamu di situs</p>
          </div>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={memuat}
            title="Muat ulang aktivitas"
          >
            <i className={`bx bx-revision ${memuat ? styles.spin : ""}`}></i>
          </button>
        </div>

        {!ringkasan || ringkasan.aktivitas.length === 0 ? (
          <div className={styles.empty}>
            <i className="bx bx-history"></i>
            <p>{ringkasan ? "Belum ada aktivitas." : "Memuat aktivitas..."}</p>
          </div>
        ) : (
          <ul className={styles.activityList}>
            {ringkasan.aktivitas.map((a) => (
              <li key={a.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <i className={keteranganAktivitas[a.jenis].icon}></i>
                </div>
                <div className={styles.activityText}>
                  <p>
                    {keteranganAktivitas[a.jenis].teks} <strong>{a.judul}</strong>
                  </p>
                  {a.isi && <span className={styles.activityQuote}>&ldquo;{a.isi}&rdquo;</span>}
                  <small>{formatWaktu(a.createdAt)}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}