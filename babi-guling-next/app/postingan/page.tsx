"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type KategoriPostingan =
  | "Promotions"
  | "Reccomendation"
  | "Informations"
  | "Other";

type PostinganItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  kategori?: KategoriPostingan;
  createdAt?: string;
};

const filterKategori: { value: "ALL" | KategoriPostingan; label: string }[] = [
  { value: "ALL", label: "Semua" },
  { value: "Informations", label: "Informasi" },
  { value: "Reccomendation", label: "Rekomendasi" },
  { value: "Promotions", label: "Promosi" },
  { value: "Other", label: "Lainnya" },
];

function labelKategori(kategori?: string) {
  const found = filterKategori.find((item) => item.value === kategori);
  return found?.label || "Informasi";
}

export default function PostinganPage() {
  const [items, setItems] = useState<PostinganItem[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<"ALL" | KategoriPostingan>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPostingan() {
      try {
        const res = await fetch("/api/konten?jenis=postingan", {
          cache: "no-store",
        });
        if (res.ok) {
          const data: PostinganItem[] = await res.json();
          setItems(data);
        }
      } catch (err) {
        console.error("Gagal memuat postingan:", err);
      } finally {
        setLoading(false);
      }
    }

    getPostingan();
  }, []);

  const filteredItems =
    selectedKategori === "ALL"
      ? items
      : items.filter((item) => (item.kategori || "Informations") === selectedKategori);

  return (
    <main className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold">Postingan & Informasi Babi Guling</h1>
        <p className="text-secondary">
          Pilih kategori di bawah untuk melihat informasi, rekomendasi, atau promosi terbaru.
        </p>
      </div>

      {/* Tombol Filter Kategori */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
        {filterKategori.map((kat) => (
          <button
            key={kat.value}
            type="button"
            onClick={() => setSelectedKategori(kat.value)}
            className={`btn btn-sm ${
              selectedKategori === kat.value ? "btn-danger" : "btn-outline-secondary"
            }`}
          >
            {kat.label}
          </button>
        ))}
      </div>

      {/* Daftar Postingan */}
      {loading ? (
        <p className="text-center text-secondary">Memuat postingan...</p>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Belum Ada Postingan</h4>
          <p className="text-secondary">Belum ada postingan pada kategori ini.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredItems.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={360}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                    unoptimized
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <span className="badge bg-warning text-dark">
                      {labelKategori(item.kategori)}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold">{item.title}</h5>
                  <p className="card-text text-secondary">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}