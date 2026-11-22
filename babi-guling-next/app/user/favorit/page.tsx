"use client";

import { useEffect, useState } from "react";
import { deleteUserFavorite, getUserFavorites } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import SavedList, { type SavedItem } from "../SavedList";
import styles from "../user.module.css";

export default function UserFavoritesPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [favorites, setFavorites] = useState<SavedItem[] | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserFavorites(userId).then((data) => {
      if (active) setFavorites(data);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  async function handleRemove(id: number) {
    if (!userId || !window.confirm("Hapus dari favorit?")) return;

    try {
      await deleteUserFavorite(userId, id);
      setFavorites(favorites?.filter((item) => item.id !== id) ?? null);
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

      <SavedList
        items={favorites}
        emptyText={{
          resto: "Belum ada resto favorit.",
          post: "Belum ada postingan favorit.",
        }}
        deleteIcon="bx bx-trash"
        deleteTitle="Hapus dari favorit"
        onDelete={handleRemove}
      />
    </>
  );
}
