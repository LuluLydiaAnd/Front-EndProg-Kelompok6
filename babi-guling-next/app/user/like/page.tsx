"use client";

import { useEffect, useState } from "react";
import { deleteUserLike, getUserLikes } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import SavedList, { type SavedItem } from "../SavedList";
import styles from "../user.module.css";

export default function UserLikesPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [likes, setLikes] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserLikes(userId).then((data) => {
      if (active) setLikes(data);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleUnlike(id: number) {
    if (!userId || !window.confirm("Batal like ini?")) return;

    try {
      await deleteUserLike(userId, id);
      setLikes(likes?.filter((item) => item.id !== id) ?? null);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal membatalkan like.");
    }
  }

  if (!user) return null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Koleksi</p>
          <h1 className={styles.title}>Like Saya</h1>
          <p className={styles.subtitle}>Resto dan postingan yang kamu suka.</p>
        </div>
      </header>

      <SavedList
        items={likes}
        emptyText={{
          resto: "Belum ada resto yang kamu like.",
          post: "Belum ada postingan yang kamu like.",
        }}
        deleteIcon="bx bxs-heart"
        deleteTitle="Batal like"
        onDelete={handleUnlike}
      />
    </>
  );
}