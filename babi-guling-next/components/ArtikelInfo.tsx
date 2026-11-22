"use client";

// import hook react, komponen gambar, dan file css module
import { useEffect, useState } from "react";
import Image from "next/image";
import InteractionButtons from "@/components/InteractionButtons";
import styles from "./ArtikelInfo.module.css";

// tipe kategori yang digunakan pada postingan
type KategoriPostingan =
  | "Promotions"
  | "Reccomendation"
  | "Informations"
  | "Other";

// struktur data postingan yang diterima dari api
type Postingan = {
  id: number;
  title: string;
  description: string;
  image: string;
  kategori: KategoriPostingan;
  createdAt: string;
  _count?: { likes: number; komentar: number };
};

// komponen untuk menampilkan daftar artikel dan informasi
export default function ArtikelInfo() {
  // menyimpan data postingan, status loading, dan pesan error
  const [postingan, setPostingan] = useState<Postingan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // mengambil data postingan saat komponen pertama kali ditampilkan
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
        // menghentikan status loading setelah proses selesai
        setLoading(false);
      }
    }

    getPostingan();
  }, []);

  // mengubah tanggal menjadi format indonesia
  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // mengubah nilai kategori menjadi nama yang ditampilkan
  function formatKategori(kategori: KategoriPostingan) {
    const namaKategori: Record<KategoriPostingan, string> = {
      Promotions: "Promosi",
      Reccomendation: "Rekomendasi",
      Informations: "Informasi",
      Other: "Lainnya",
    };

    return namaKategori[kategori] || "Lainnya";
  }

  return (
    // section artikel yang ditampilkan pada halaman
    <section id="postingan" className={styles.artikelSection}>
      <div className="container">
        {/* judul dan deskripsi section artikel */}
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

        {/* menampilkan kondisi sesuai status pengambilan data */}
        {loading ? (
          <div className={styles.message}>Memuat artikel</div>
        ) : error ? (
          <div className={styles.message}>{error}</div>
        ) : postingan.length === 0 ? (
          <div className={styles.message}>
            Belum ada artikel atau informasi yang tersedia.
          </div>
        ) : (
          // menampilkan setiap postingan dalam bentuk kartu
          <div className={styles.articleGrid}>
            {postingan.map((post) => (
              <article key={post.id} className={styles.articleCard}>
                {/* menampilkan gambar atau placeholder jika gambar kosong */}
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

                {/* menampilkan kategori, tanggal, judul, dan deskripsi */}
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

                  <h3 className={styles.articleTitle}>{post.title}</h3>

                  <p className={styles.articleDescription}>
                    {post.description}
                  </p>

                  <div className={styles.articleActions}>
                    <InteractionButtons
                      target={{ kontenId: post.id }}
                      likeCount={post._count?.likes ?? 0}
                      commentCount={post._count?.komentar ?? 0}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}