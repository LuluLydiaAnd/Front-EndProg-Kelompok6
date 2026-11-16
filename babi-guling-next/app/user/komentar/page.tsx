"use client";

import { useEffect, useState } from "react";
import { getKomentarUser, hapusKomentarUser } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type KomentarItem = {
  id: number;
  isi: string;
  createdAt: Date;
  restoran: { nama: string } | null;
  konten: { title: string } | null;
};

export default function KomentarSayaPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [daftar, setDaftar] = useState<KomentarItem[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let aktif = true;

    getKomentarUser(userId).then((data) => {
      if (aktif) setDaftar(data);
    });

    return () => {
      aktif = false;
    };
  }, [userId]);

  async function handleHapus(id: number) {
    if (!userId || !window.confirm("Hapus komentar ini?")) return;

    try {
      await hapusKomentarUser(userId, id);
      setDaftar((list) => list?.filter((k) => k.id !== id) ?? null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus komentar.");
    }
  }

  if (!user) return null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Riwayat</p>
          <h1 className={styles.title}>Komentar Saya</h1>
          <p className={styles.subtitle}>Semua komentar yang pernah kamu tulis.</p>
        </div>
      </header>

      <section className={styles.panel}>
        {!daftar ? (
          <div className={styles.empty}>
            <i className="bx bx-message-square"></i>
            <p>Memuat komentar...</p>
          </div>
        ) : daftar.length === 0 ? (
          <div className={styles.empty}>
            <i className="bx bx-message-square"></i>
            <p>Kamu belum menulis komentar.</p>
          </div>
        ) : (
          <ul className={styles.activityList}>
            {daftar.map((k) => (
              <li key={k.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <i className="bx bx-message-square"></i>
                </div>

                <div className={styles.activityText}>
                  <p>
                    Di{" "}
                    <strong>{k.restoran?.nama ?? k.konten?.title ?? "-"}</strong>
                    <span className={styles.badge}>
                      {k.restoran ? "Resto" : "Postingan"}
                    </span>
                  </p>
                  <span className={styles.activityQuote}>&ldquo;{k.isi}&rdquo;</span>
                  <small>{new Date(k.createdAt).toLocaleString("id-ID")}</small>
                </div>

                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleHapus(k.id)}
                  title="Hapus komentar"
                >
                  <i className="bx bx-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}