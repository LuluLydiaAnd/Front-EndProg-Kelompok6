"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addComment,
  getComments,
  getUserStatus,
  toggleFavorite,
  toggleLike,
} from "@/app/actions/interactions";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "./InteractionButtons.module.css";

type Target = { restoranId: number } | { kontenId: number };

type Comment = {
  id: number;
  namaUser: string;
  isi: string;
  createdAt: Date;
};

type Props = {
  target: Target;
  likeCount: number;
  commentCount: number;
};

export default function InteractionButtons({ target, likeCount, commentCount }: Props) {
  const router = useRouter();
  const user = useSessionUser();
  const userId = user?.role === "user" ? user.id : undefined;

  const [likes, setLikes] = useState(likeCount);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [totalComments, setTotalComments] = useState(commentCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const targetKey = JSON.stringify(target);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserStatus(userId, JSON.parse(targetKey)).then((status) => {
      if (!active) return;
      setLiked(status.liked);
      setFavorited(status.favorited);
    });

    return () => {
      active = false;
    };
  }, [userId, targetKey]);

  async function handleLike() {
    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await toggleLike(userId, target);
    setLiked(result);
    setLikes(result ? likes + 1 : likes - 1);
    setLoading(false);
  }

  async function handleFavorite() {
    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const result = await toggleFavorite(userId, target);
    setFavorited(result);
    setLoading(false);
  }

  async function handleToggleComments() {
    if (showComments) {
      setShowComments(false);
      return;
    }

    setShowComments(true);
    setComments(await getComments(target));
  }

  async function handleSubmitComment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!userId) {
      router.push("/login");
      return;
    }

    if (!text.trim()) return;

    setLoading(true);

    try {
      const newComment = await addComment(userId, text, target);
      setComments([newComment, ...comments]);
      setTotalComments(totalComments + 1);
      setText("");
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
          className={`${styles.button} ${liked ? styles.liked : ""}`}
          onClick={handleLike}
          disabled={loading}
        >
          <i className={liked ? "bx bxs-heart" : "bx bx-heart"}></i>
          {likes} Suka
        </button>

        <button type="button" className={styles.button} onClick={handleToggleComments}>
          <i className="bx bx-message-square"></i>
          {totalComments} Komentar
        </button>

        <button
          type="button"
          className={`${styles.button} ${favorited ? styles.favorited : ""}`}
          onClick={handleFavorite}
          disabled={loading}
        >
          <i className={favorited ? "bx bxs-bookmark" : "bx bx-bookmark"}></i>
          Favorit
        </button>
      </div>

      {showComments && (
        <div className={styles.commentBox}>
          {userId ? (
            <form className={styles.commentForm} onSubmit={handleSubmitComment}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
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

          {comments.length === 0 ? (
            <p className={styles.emptyText}>Belum ada komentar.</p>
          ) : (
            <ul className={styles.commentList}>
              {comments.map((comment) => (
                <li key={comment.id} className={styles.commentItem}>
                  <strong>{comment.namaUser}</strong>
                  <p>{comment.isi}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
