"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./user.module.css";

export type SavedItem = {
  id: number;
  createdAt: Date;
  restoran: { nama: string; alamat: string; rating: number } | null;
  konten: { title: string; description: string } | null;
};

type Props = {
  items: SavedItem[] | null;
  emptyText: { resto: string; post: string };
  deleteIcon: string;
  deleteTitle: string;
  onDelete: (id: number) => void;
};

// Daftar resto/postingan dengan filter, dipakai di halaman Like dan Favorit
export default function SavedList({ items, emptyText, deleteIcon, deleteTitle, onDelete }: Props) {
  const [tab, setTab] = useState<"resto" | "post">("resto");

  const restoItems = items?.filter((item) => item.restoran) ?? [];
  const postItems = items?.filter((item) => item.konten) ?? [];
  const shownItems = tab === "resto" ? restoItems : postItems;

  return (
    <>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === "resto" ? styles.tabActive : ""}`}
          onClick={() => setTab("resto")}
        >
          <i className="bx bx-store"></i>
          Resto
          <span className={styles.tabCount}>{restoItems.length}</span>
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "post" ? styles.tabActive : ""}`}
          onClick={() => setTab("post")}
        >
          <i className="bx bx-news"></i>
          Postingan
          <span className={styles.tabCount}>{postItems.length}</span>
        </button>
      </div>

      {!items || shownItems.length === 0 ? (
        <section className={styles.panel}>
          <div className={styles.empty}>
            <i className="bx bx-folder-open"></i>
            <p>{!items ? "Memuat..." : tab === "resto" ? emptyText.resto : emptyText.post}</p>
          </div>
        </section>
      ) : (
        <section className={styles.cardGrid}>
          {shownItems.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.badge}>{item.restoran ? "Resto" : "Postingan"}</span>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => onDelete(item.id)}
                  title={deleteTitle}
                >
                  <i className={deleteIcon}></i>
                </button>
              </div>

              {item.restoran ? (
                <>
                  <h3>{item.restoran.nama}</h3>
                  <p>
                    <i className="bx bx-map"></i> {item.restoran.alamat}
                  </p>
                  <p>
                    <i className="bx bxs-star"></i> {item.restoran.rating.toFixed(1)}
                  </p>
                  <Link href="/resto" className={styles.cardLink}>
                    Lihat resto <i className="bx bx-right-arrow-alt"></i>
                  </Link>
                </>
              ) : (
                <>
                  <h3>{item.konten?.title}</h3>
                  <p className={styles.cardDesc}>{item.konten?.description}</p>
                  <Link href="/postingan" className={styles.cardLink}>
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
