"use client";

import { useEffect, useState } from "react";
import { getUserSummary } from "@/app/actions/interactions";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type Activity = {
  id: string;
  type: "like" | "comment" | "favorite";
  title: string;
  content: string;
  createdAt: Date;
};

type Summary = {
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  activities: Activity[];
};

const activityLabels = {
  like: { icon: "bx bxs-heart", text: "Kamu menyukai" },
  comment: { icon: "bx bx-message-square", text: "Kamu berkomentar di" },
  favorite: { icon: "bx bxs-bookmark", text: "Kamu memfavoritkan" },
};

function formatDate(date: Date) {
  return new Date(date).toLocaleString("id-ID", {
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

  const [summary, setSummary] = useState<Summary | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserSummary(userId)
      .then((data) => {
        if (active) setSummary(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  function handleRefresh() {
    setLoading(true);
    setReloadKey(reloadKey + 1);
  }

  if (!user) return null;

  const stats = [
    { label: "Like", value: summary?.likeCount ?? 0, desc: "Total like kamu", icon: "bx bxs-heart" },
    { label: "Komentar", value: summary?.commentCount ?? 0, desc: "Total komentar kamu", icon: "bx bx-message-square" },
    { label: "Favorit", value: summary?.favoriteCount ?? 0, desc: "Total favorit kamu", icon: "bx bxs-bookmark" },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Selamat datang kembali</p>
          <h1 className={styles.title}>Halo, {user.name}</h1>
          <p className={styles.subtitle}>
            Lihat aktivitas, favorit, dan komentar kamu di sini.
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
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statDesc}>{stat.desc}</p>
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
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={loading}
            title="Muat ulang"
          >
            <i className={`bx bx-revision ${loading ? styles.spin : ""}`}></i>
          </button>
        </div>

        {!summary || summary.activities.length === 0 ? (
          <div className={styles.empty}>
            <i className="bx bx-history"></i>
            <p>{summary ? "Belum ada aktivitas." : "Memuat..."}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {summary.activities.map((activity) => (
              <li key={activity.id} className={styles.listItem}>
                <div className={styles.listIcon}>
                  <i className={activityLabels[activity.type].icon}></i>
                </div>
                <div className={styles.listText}>
                  <p>
                    {activityLabels[activity.type].text} <strong>{activity.title}</strong>
                  </p>
                  {activity.content && (
                    <span className={styles.quote}>&ldquo;{activity.content}&rdquo;</span>
                  )}
                  <small>{formatDate(activity.createdAt)}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
