"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getFavoritUser, hapusFavoritUser } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type FavoritItem = {
  id: number;
  createdAt: Date;
  restoran: { nama: string; alamat: string; rating: number } | null;
  konten: { title: string; description: string } | null;
};

export default function FavoritSayaPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [daftar, setDaftar] = useState<FavoritItem[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let aktif = true;

    getFavoritUser(userId).then((data) => {
      if (aktif) setDaftar(data);
    });

    return () => {
      aktif = false;
    };
  }, [userId]);

  async function handleHapus(id: number) {
    if (!userId || !window.confirm("Hapus dari favorit?")) return;

    try {
      await hapusFavoritUser(userId, id);
      setDaftar((list) => list?.filter((f) => f.id !== id) ?? null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus favorit.");
    }
  }

  if (!user) return null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Koleksi</p>
          <h1 className={styles.title}>Favorit Saya</h1>
          <p className={styles.subtitle}>Resto dan postingan yang kamu simpan.</p>
        </div>
      </header>

      {!daftar ? (
        <section className={styles.panel}>
          <div className={styles.empty}>
            <i className="bx bx-bookmark"></i>
            <p>Memuat favorit...</p>
          </div>
        </section>
      ) : daftar.length === 0 ? (
        <section className={styles.panel}>
          <div className={styles.empty}>
            <i className="bx bx-bookmark"></i>
            <p>Belum ada favorit. Simpan resto atau postingan yang kamu suka.</p>
          </div>
        </section>
      ) : (
        <section className={styles.favGrid}>
          {daftar.map((f) => (
            <article key={f.id} className={styles.favCard}>
              <div className={styles.favTop}>
                <span className={styles.badge}>{f.restoran ? "Resto" : "Postingan"}</span>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => handleHapus(f.id)}
                  title="Hapus dari favorit"
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>

              {f.restoran ? (
                <>
                  <h3>{f.restoran.nama}</h3>
                  <p>
                    <i className="bx bx-map"></i> {f.restoran.alamat}
                  </p>
                  <p>
                    <i className="bx bxs-star"></i> {f.restoran.rating.toFixed(1)}
                  </p>
                  <Link href="/resto" className={styles.favLink}>
                    Lihat resto <i className="bx bx-right-arrow-alt"></i>
                  </Link>
                </>
              ) : (
                <>
                  <h3>{f.konten?.title}</h3>
                  <p className={styles.favDesc}>{f.konten?.description}</p>
                  <Link href="/postingan" className={styles.favLink}>
                    Lihat postingan <i className="bx bx-right-arrow-alt"></i>
                  </Link>
                </>
              )}
            </article>
          ))}
        </section>
      )}
    </>
  );
}