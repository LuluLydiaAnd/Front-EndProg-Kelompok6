
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ArtikelInfo.module.css";

type KategoriPostingan =
  | "Promotions"
  | "Recommendation"
  | "Informations"
  | "Other";

type Postingan = {
  id: number;
  title: string;
  description: string;
  image: string;
  kategori: KategoriPostingan;
  createdAt: string;
};

export default function ArtikelInfo() {
  const [postingan, setPostingan] = useState<Postingan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPostingan() {
      try {
        const response = await fetch("/api/konten", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data postingan.");
        }

        const data = await response.json();

        setPostingan(data);
      } catch (error) {
        console.error("Error mengambil postingan:", error);
        setError("Postingan belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    }

    getPostingan();
  }, []);

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatKategori(kategori: KategoriPostingan) {
    const namaKategori: Record<KategoriPostingan, string> = {
      Promotions: "Promosi",
      Recommendation: "Rekomendasi",
      Informations: "Informasi",
      Other: "Lainnya",
    };

    return namaKategori[kategori] || "Lainnya";
  }

  return (
    <section id="postingan" className={styles.artikelSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Kabar dan Cerita Kami</p>

          <h2 className={styles.sectionTitle}>
            Jelajah Rasa<em> & Kuliner Bali</em>
          </h2>

          <p className={styles.sectionDescription}>
            Temukan informasi, rekomendasi, dan berbagai kabar terbaru
            seputar kuliner khas Bali.
          </p>
        </div>

        {loading ? (
          <div className={styles.message}>
            Memuat artikel
          </div>
        ) : error ? (
          <div className={styles.message}>
            {error}
          </div>
        ) : postingan.length === 0 ? (
          <div className={styles.message}>
            Belum ada artikel atau informasi yang tersedia.
          </div>
        ) : (
          <div className={styles.articleGrid}>
            {postingan.map((post) => (
              <article key={post.id} className={styles.articleCard}>
                <div className={styles.imageWrapper}>
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      unoptimized
                      className={styles.articleImage}
                      sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <i className="bx bx-image"></i>
                      <span>Tidak ada gambar</span>
                    </div>
                  )}
                </div>

                <div className={styles.articleContent}>
                  <div className={styles.articleMeta}>
                    <span className={styles.articleCategory}>
                      {formatKategori(post.kategori)}
                    </span>

                    <p className={styles.articleDate}>
                      <i className="bx bx-calendar"></i>
                      {formatTanggal(post.createdAt)}
                    </p>
                  </div>

                  <h3 className={styles.articleTitle}>
                    {post.title}
                  </h3>

                  <p className={styles.articleDescription}>
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
