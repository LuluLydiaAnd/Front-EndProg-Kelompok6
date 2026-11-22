"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { hapusFeedbackFaq } from "@/app/actions/faq";
import styles from "./AdminFaq.module.css";

type Rekap = {
  id: number;
  tanya: string;
  kategori: string;
  ya: number;
  belum: number;
  total: number;
};

type Feedback = {
  id: number;
  faqId: number;
  pertanyaan: string;
  membantu: boolean;
  alasan: string;
  createdAt: string;
};

export default function FaqFeedbackClient({
  rekap,
  feedbackList,
}: {
  rekap: Rekap[];
  feedbackList: Feedback[];
}) {
  const [filter, setFilter] = useState<"semua" | "ya" | "belum">("semua");
  const [isPending, startTransition] = useTransition();

  const totalYa = feedbackList.filter((fb) => fb.membantu).length;
  const totalBelum = feedbackList.length - totalYa;
  const persen = feedbackList.length ? Math.round((totalYa / feedbackList.length) * 100) : 0;

  const tampil = feedbackList.filter((fb) => {
    if (filter === "ya") return fb.membantu;
    if (filter === "belum") return !fb.membantu;
    return true;
  });

  // urutkan rekap: yang paling banyak "Belum" di atas, biar admin tahu mana yang perlu diperbaiki
  const rekapUrut = [...rekap].sort((a, b) => b.belum - a.belum || b.total - a.total);

  function handleDelete(id: number) {
    if (window.confirm("Yakin mau menghapus feedback ini?")) {
      startTransition(async () => {
        await hapusFeedbackFaq(id);
      });
    }
  }

  function formatTanggal(iso: string) {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className={`container ${styles.page}`}>
      <Link href="/admin" className={styles.backLink}>
        <i className="bx bx-arrow-back"></i>
        Kembali ke Dashboard
      </Link>

      <section className={styles.welcome}>
        <span className={styles.eyebrow}>PENGELOLAAN WEBSITE</span>
        <h1>Feedback FAQ</h1>
        <p>Lihat jawaban FAQ mana yang sudah membantu dan mana yang masih perlu diperbaiki.</p>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <span>Total Feedback</span>
          <b>{feedbackList.length}</b>
        </div>
        <div className={styles.statCard}>
          <span>
            <i className="bx bx-like"></i> Membantu
          </span>
          <b className={styles.textYa}>{totalYa}</b>
        </div>
        <div className={styles.statCard}>
          <span>
            <i className="bx bx-dislike"></i> Belum Membantu
          </span>
          <b className={styles.textBelum}>{totalBelum}</b>
        </div>
        <div className={styles.statCard}>
          <span>Tingkat Membantu</span>
          <b>{persen}%</b>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <div>
            <span className={styles.sectionLabel}>REKAP PER PERTANYAAN</span>
            <h2>Hasil Tiap Pertanyaan</h2>
          </div>
          <span className={styles.count}>{rekap.length} pertanyaan</span>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pertanyaan</th>
                <th>Kategori</th>
                <th>Ya</th>
                <th>Belum</th>
                <th>Persentase</th>
              </tr>
            </thead>
            <tbody>
              {rekapUrut.map((r) => {
                const p = r.total ? Math.round((r.ya / r.total) * 100) : 0;
                return (
                  <tr key={r.id}>
                    <td className={styles.question}>{r.tanya}</td>
                    <td>
                      <span className={styles.kategori}>{r.kategori}</span>
                    </td>
                    <td className={styles.textYa}>{r.ya}</td>
                    <td className={styles.textBelum}>{r.belum}</td>
                    <td>
                      {r.total === 0 ? (
                        <span className={styles.muted}>Belum ada vote</span>
                      ) : (
                        <div className={styles.bar}>
                          <div className={styles.barIsi} style={{ width: `${p}%` }}></div>
                          <span>{p}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}>
          <div>
            <span className={styles.sectionLabel}>DATABASE</span>
            <h2>Semua Feedback</h2>
          </div>

          <div className={styles.filter}>
            {(["semua", "ya", "belum"] as const).map((f) => (
              <button
                key={f}
                className={filter === f ? styles.filterActive : ""}
                onClick={() => setFilter(f)}
              >
                {f === "semua" ? "Semua" : f === "ya" ? "Membantu" : "Belum"}
              </button>
            ))}
          </div>
        </div>

        {tampil.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="bx bx-message-square-detail"></i>
            <h3>Belum Ada Feedback</h3>
            <p>Feedback dari pengunjung di section FAQ akan muncul di sini.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Pertanyaan</th>
                  <th>Feedback</th>
                  <th>Alasan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tampil.map((fb) => (
                  <tr key={fb.id}>
                    <td className={styles.muted}>{formatTanggal(fb.createdAt)}</td>
                    <td className={styles.question}>{fb.pertanyaan}</td>
                    <td>
                      {fb.membantu ? (
                        <span className={styles.badgeYa}>
                          <i className="bx bx-like"></i> Ya
                        </span>
                      ) : (
                        <span className={styles.badgeBelum}>
                          <i className="bx bx-dislike"></i> Belum
                        </span>
                      )}
                    </td>
                    <td>{fb.alasan || <span className={styles.muted}>-</span>}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(fb.id)}
                        disabled={isPending}
                      >
                        <i className="bx bx-trash"></i>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
