"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getKomentar,
  getStatusUser,
  tambahKomentar,
  toggleFavorit,
  toggleLike,
} from "@/app/actions/interaksi";
import styles from "./InteraksiButtons.module.css";

type Target = { restoranId: number } | { kontenId: number };

type KomentarItem = {
  id: number;
  namaUser: string;
  isi: string;
  createdAt: Date;
};

type Props = {
  target: Target;
  initialLikes: number;
  initialKomentar: number;
};

function subscribe() {
  return () => {};
}

export default function InteraksiButtons({ target, initialLikes, initialKomentar }: Props) {
  const router = useRouter();

  // Ambil user yang sedang login dari sessionStorage
  const raw = useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem("user"),
    () => null
  );
  const user = raw ? (JSON.parse(raw) as { id?: number; role: string }) : null;
  const userId = user?.role === "user" ? user.id : undefined;

  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [jumlahKomentar, setJumlahKomentar] = useState(initialKomentar);
  const [bukaKomentar, setBukaKomentar] = useState(false);
  const [daftarKomentar, setDaftarKomentar] = useState<KomentarItem[]>([]);
  const [isi, setIsi] = useState("");
  const [loading, setLoading] = useState(false);

  // Cek status like & favorit user saat kartu muncul
  const targetKey = JSON.stringify(target);
  useEffect(() => {
    if (!userId) return;
    let aktif = true;

    getStatusUser(userId, JSON.parse(targetKey)).then((status) => {
      if (!aktif) return;
      setLiked(status.liked);
      setFavorited(status.favorited);
    });

    return () => {
      aktif = false;
    };
  }, [userId, targetKey]);

  async function handleLike() {
    if (!userId) return router.push("/login");
    if (loading) return;

    setLoading(true);
    try {
      const sekarangLiked = await toggleLike(userId, target);
      setLiked(sekarangLiked);
      setLikes((n) => n + (sekarangLiked ? 1 : -1));
    } finally {
      setLoading(false);
    }
  }

  async function handleFavorit() {
    if (!userId) return router.push("/login");
    if (loading) return;

    setLoading(true);
    try {
      setFavorited(await toggleFavorit(userId, target));
    } finally {
      setLoading(false);
    }
  }

  async function handleBukaKomentar() {
    const buka = !bukaKomentar;
    setBukaKomentar(buka);
    if (buka) {
      setDaftarKomentar(await getKomentar(target));
    }
  }

  async function handleKirimKomentar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return router.push("/login");
    if (!isi.trim() || loading) return;

    setLoading(true);
    try {
      const baru = await tambahKomentar(userId, isi, target);
      setDaftarKomentar((list) => [baru, ...list]);
      setJumlahKomentar((n) => n + 1);
      setIsi("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal mengirim komentar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.pill} ${liked ? styles.liked : ""}`}
          onClick={handleLike}
          disabled={loading}
        >
          <i className={liked ? "bx bxs-heart" : "bx bx-heart"}></i>
          {likes} Suka
        </button>

        <button type="button" className={styles.pill} onClick={handleBukaKomentar}>
          <i className="bx bx-message-square"></i>
          {jumlahKomentar} Komentar
        </button>

        <button
          type="button"
          className={`${styles.pill} ${favorited ? styles.favorited : ""}`}
          onClick={handleFavorit}
          disabled={loading}
        >
          <i className={favorited ? "bx bxs-bookmark" : "bx bx-bookmark"}></i>
          Favorit
        </button>
      </div>

      {bukaKomentar && (
        <div className={styles.komentarBox}>
          {userId ? (
            <form className={styles.komentarForm} onSubmit={handleKirimKomentar}>
              <input
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                placeholder="Tulis komentar..."
                maxLength={500}
              />
              <button type="submit" disabled={loading}>
                Kirim
              </button>
            </form>
          ) : (
            <p className={styles.loginNote}>
              <Link href="/login">Login</Link> untuk menulis komentar.
            </p>
          )}

          {daftarKomentar.length === 0 ? (
            <p className={styles.kosong}>Belum ada komentar.</p>
          ) : (
            <ul className={styles.komentarList}>
              {daftarKomentar.map((k) => (
                <li key={k.id} className={styles.komentarItem}>
                  <strong>{k.namaUser}</strong>
                  <p>{k.isi}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}