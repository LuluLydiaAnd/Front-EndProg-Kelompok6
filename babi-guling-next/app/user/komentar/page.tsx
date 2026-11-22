"use client";

import { useEffect, useState } from "react";
import { deleteUserComment, getUserComments } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type Comment = {
  id: number;
  isi: string;
  createdAt: Date;
  restoran: { nama: string } | null;
  konten: { title: string } | null;
};

export default function UserCommentsPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [comments, setComments] = useState<Comment[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserComments(userId).then((data) => {
      if (active) setComments(data);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleDelete(id: number) {
    if (!userId || !window.confirm("Hapus komentar ini?")) return;

    try {
      await deleteUserComment(userId, id);
      setComments(comments?.filter((comment) => comment.id !== id) ?? null);
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
        {!comments || comments.length === 0 ? (
          <div className={styles.empty}>
            <i className="bx bx-message-square"></i>
            <p>{comments ? "Kamu belum menulis komentar." : "Memuat..."}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {comments.map((comment) => (
              <li key={comment.id} className={styles.listItem}>
                <div className={styles.listIcon}>
                  <i className="bx bx-message-square"></i>
                </div>

                <div className={styles.listText}>
                  <p>
                    Di <strong>{comment.restoran?.nama ?? comment.konten?.title ?? "-"}</strong>
                    <span className={styles.badge}>
                      {comment.restoran ? "Resto" : "Postingan"}
                    </span>
                  </p>
                  <span className={styles.quote}>&ldquo;{comment.isi}&rdquo;</span>
                  <small>{new Date(comment.createdAt).toLocaleString("id-ID")}</small>
                </div>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => handleDelete(comment.id)}
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
