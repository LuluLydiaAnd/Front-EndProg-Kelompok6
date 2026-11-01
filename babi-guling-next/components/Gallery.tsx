"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Gallery.module.css";

type Kategori = "proses" | "sajian" | "upacara";

type Foto = {
  src: string;
  judul: string;
  kategori: Kategori;
  ukuran?: "besar" | "tinggi" | "lebar";
};

const fotoList: Foto[] = [
  { src: "/galeri/sejarah-babi-guling-1.jpeg", judul: "Pemanggangan babi di atas bara api", kategori: "proses", ukuran: "besar" },
  { src: "/galeri/base-genep-final.jpg", judul: "Bumbu base genep", kategori: "proses" },
  { src: "/galeri/lengkap1.jpg", judul: "Sajian lengkap babi guling", kategori: "sajian", ukuran: "tinggi" },
  { src: "/galeri/upacara.jpg", judul: "Upacara adat Bali", kategori: "upacara" },
  { src: "/galeri/babipiring.jpg", judul: "Irisan babi guling di piring", kategori: "proses" },
  { src: "/galeri/dishfull.jpg", judul: "Nasi campur babi guling", kategori: "sajian", ukuran: "lebar" },
  { src: "/galeri/babimatah.jpg", judul: "Babi guling dengan sambal matah", kategori: "sajian" },
  { src: "/galeri/persembahanbabi.jpg", judul: "Persembahan tradisi Ngusaba Sumbu", kategori: "upacara" },
  { src: "/galeri/usabasumbu.jpeg", judul: "Ritual Usaba Sumbu", kategori: "upacara", ukuran: "tinggi" },
  { src: "/galeri/anekasam.jpg", judul: "Babi guling & aneka sambal", kategori: "sajian", ukuran: "lebar" },
  { src: "/galeri/lawarkrispi.jpg", judul: "Kulit krispi, lawar, & sate", kategori: "sajian" },
  { src: "/galeri/nascam.jpg", judul: "Nasi campur khas Bali", kategori: "sajian", ukuran: "lebar" },
];

const filterList: { label: string; value: Kategori | "semua" }[] = [
  { label: "Semua", value: "semua" },
  { label: "Proses", value: "proses" },
  { label: "Sajian", value: "sajian" },
  { label: "Upacara", value: "upacara" },
];

export default function Gallery() {
  const [filter, setFilter] = useState<Kategori | "semua">("semua");
  const [aktif, setAktif] = useState<number | null>(null);

  const fotoTampil = filter === "semua" ? fotoList : fotoList.filter((f) => f.kategori === filter);

  const jumlah = (value: Kategori | "semua") =>
    value === "semua" ? fotoList.length : fotoList.filter((f) => f.kategori === value).length;

  const geser = (arah: number) => {
    if (aktif === null) return;
    setAktif((aktif + arah + fotoTampil.length) % fotoTampil.length);
  };

  useEffect(() => {
    if (aktif === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAktif(null);
      if (e.key === "ArrowRight") geser(1);
      if (e.key === "ArrowLeft") geser(-1);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <section id="galeri" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.label}>Galeri</p>
            <h2 className={styles.title}>
              Momen <span>Babi Guling</span>
            </h2>
          </div>
          <p className={styles.desc}>
            Dari proses persiapan, pemanggangan, sampai penyajian dalam upacara adat.
          </p>
        </div>

        <div className={styles.filter}>
          {filterList.map((f) => (
            <button
              key={f.value}
              className={`${styles.filterBtn} ${filter === f.value ? styles.filterActive : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <span className={styles.badge}>{jumlah(f.value)}</span>
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {fotoTampil.map((foto, i) => (
            <figure
              key={foto.src}
              className={`${styles.item} ${foto.ukuran ? styles[foto.ukuran] : ""}`}
              onClick={() => setAktif(i)}
            >
              <Image
                src={foto.src}
                alt={foto.judul}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={styles.img}
              />
              <span className={styles.nomor}>{String(i + 1).padStart(2, "0")}</span>
              <figcaption className={styles.caption}>
                <span className={styles.tag}>{foto.kategori}</span>
                <p>{foto.judul}</p>
              </figcaption>
              <i className={`bx bx-expand-alt ${styles.zoom}`}></i>
            </figure>
          ))}
        </div>
      </div>

      {aktif !== null && (
        <div className={styles.lightbox} onClick={() => setAktif(null)}>
          <button className={`${styles.lbBtn} ${styles.lbClose}`} onClick={() => setAktif(null)}>
            <i className="bx bx-x"></i>
          </button>
          <button
            className={`${styles.lbBtn} ${styles.lbPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              geser(-1);
            }}
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          <div className={styles.lbContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.lbImgWrap}>
              <Image
                src={fotoTampil[aktif].src}
                alt={fotoTampil[aktif].judul}
                fill
                sizes="90vw"
                className={styles.lbImg}
              />
            </div>
            <div className={styles.lbInfo}>
              <p className={styles.lbJudul}>{fotoTampil[aktif].judul}</p>
              <p className={styles.lbCount}>
                {aktif + 1} / {fotoTampil.length}
              </p>
            </div>
          </div>

          <button
            className={`${styles.lbBtn} ${styles.lbNext}`}
            onClick={(e) => {
              e.stopPropagation();
              geser(1);
            }}
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
}
