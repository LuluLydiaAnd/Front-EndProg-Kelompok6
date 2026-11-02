"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = {
  id: number;
  title: string;
  description: string;
  image: string;
};

type Props = {
  storageKey: string;
  title: string;
  description: string;
  titleLabel?: string;
  descriptionLabel?: string;
  imageLabel?: string;
  showImage?: boolean;
};

export default function AdminCrud({
  storageKey,
  title,
  description,
  titleLabel = "Judul",
  descriptionLabel = "Deskripsi",
  imageLabel = "URL Gambar",
  showImage = false,
}: Props) {
  const router = useRouter();
  
  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window === "undefined") return [];

    try {
        return JSON.parse(
        localStorage.getItem(storageKey) || "[]"
        ) as Item[];
    } catch {
        return [];
    }
    });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
  });

 useEffect(() => {
  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  if (!user || user.role !== "admin") {
    router.replace("/login");
  }
}, [router]);

  function saveItems(updated: Item[]) {
    setItems(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanTitle = form.title.trim();
    const cleanDescription = form.description.trim();

    if (!cleanTitle || !cleanDescription) return;

    if (editingId !== null) {
      saveItems(
        items.map((item) =>
          item.id === editingId
            ? { ...item, ...form, title: cleanTitle, description: cleanDescription }
            : item
        )
      );
    } else {
      const newItem: Item = {
        id: Date.now(),
        title: cleanTitle,
        description: cleanDescription,
        image: form.image.trim(),
      };

      saveItems([...items, newItem]);
    }

    resetForm();
  }

  function resetForm() {
    setForm({ title: "", description: "", image: "" });
    setEditingId(null);
  }

  function handleEdit(item: Item) {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image,
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    if (window.confirm("Yakin mau menghapus data ini?")) {
      saveItems(items.filter((item) => item.id !== id));
      if (editingId === id) resetForm();
    }
  }
  return (
    <main className="container admin-page py-5">
      <Link href="/admin" className="admin-menu-link mb-4">
        <i className="bx bx-arrow-back"></i>
        Kembali ke Dashboard
      </Link>

      <div className="admin-welcome mb-4">
        <span className="admin-eyebrow">PENGELOLAAN WEBSITE</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="admin-crud-panel mb-4">
        <h2>{editingId !== null ? "Edit Data" : "Tambah Data"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">{titleLabel}</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">{descriptionLabel}</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {showImage && (
            <div className="mb-3">
              <label className="form-label">{imageLabel}</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://contoh.com/gambar.jpg"
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />
            </div>
          )}

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-danger" type="submit">
              {editingId !== null ? "Simpan Perubahan" : "Tambah Data"}
            </button>

            {editingId !== null && (
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={resetForm}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="admin-section-title mb-0">Daftar Data</h2>
        <span className="admin-count">{items.length} data</span>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          Belum ada data. Gunakan form di atas untuk menambahkan data.
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-6" key={item.id}>
              <div className="admin-crud-item">
                {showImage && item.image && (
                <div className="admin-crud-image-wrapper">
                    <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="admin-crud-image"
                    unoptimized
                    />
                </div>
                )}

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-light"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
