"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type KategoriPostingan =
  | "Promotions"
  | "Reccomendation"
  | "Informations"
  | "Other";

type Item = {
  id: number;
  title: string;
  description: string;
  image: string;
  kategori?: KategoriPostingan;
};

type Props = {
  storageKey: string;
  apiEndpoint?: string;
  title: string;
  description: string;
  titleLabel?: string;
  descriptionLabel?: string;
  imageLabel?: string;
  showImage?: boolean;
  uploadImage?: boolean;
  showCategory?: boolean;
};

type PopupType = "success" | "delete" | "error" | "confirm";

const daftarKategori: {
  value: KategoriPostingan;
  label: string;
}[] = [
  { value: "Informations", label: "Informasi" },
  { value: "Reccomendation", label: "Rekomendasi" },
  { value: "Promotions", label: "Promosi" },
  { value: "Other", label: "Lainnya" },
];

function namaKategori(kategori?: string) {
  const hasil = daftarKategori.find(
    (item) => item.value === kategori
  );

  return hasil?.label || "Informasi";
}

export default function AdminCrud({
  storageKey,
  apiEndpoint,
  title,
  description,
  titleLabel = "Judul",
  descriptionLabel = "Deskripsi",
  imageLabel = "URL Gambar",
  showImage = false,
  uploadImage = false,
  showCategory = false,
}: Props) {
  const router = useRouter();

  const [items, setItems] = useState<Item[]>(() => {
    if (typeof window === "undefined" || apiEndpoint) return [];

    try {
      return JSON.parse(
        localStorage.getItem(storageKey) || "[]"
      ) as Item[];
    } catch {
      return [];
    }
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: PopupType;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    kategori: "Informations" as KategoriPostingan,
  });

  // Memeriksa hak akses admin
  useEffect(() => {
    const user = JSON.parse(
      sessionStorage.getItem("user") || "null"
    );

    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [router]);

  // Mengambil data dari API
  useEffect(() => {
    if (!apiEndpoint) return;

    async function getItems() {
      try {
        const response = await fetch(apiEndpoint!, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data.");
        }

        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);

        setPopup({
          show: true,
          message:
            error instanceof Error
              ? error.message
              : "Gagal mengambil data.",
          type: "error",
        });
      }
    }

    getItems();
  }, [apiEndpoint]);

  function saveItems(updated: Item[]) {
    setItems(updated);

    if (!apiEndpoint) {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanTitle = form.title.trim();
    const cleanDescription = form.description.trim();

    if (!cleanTitle || !cleanDescription) return;

    if (uploadImage && imageFile && imageFile.size > 5 * 1024 * 1024) {
      setPopup({
        show: true,
        message: "Ukuran foto maksimal 5 MB.",
        type: "error",
      });
      return;
    }

    try {
      if (apiEndpoint) {
        let response: Response;

        if (uploadImage) {
          const formData = new FormData();

          formData.append("title", cleanTitle);
          formData.append("description", cleanDescription);

          if (showCategory) {
            formData.append("kategori", form.kategori);
          }

          if (editingId !== null) {
            formData.append("id", String(editingId));
          }

          if (imageFile) {
            formData.append("imageFile", imageFile);
          }

          response = await fetch(apiEndpoint, {
            method: editingId !== null ? "PUT" : "POST",
            body: formData,
          });
        } else {
          response = await fetch(apiEndpoint, {
            method: editingId !== null ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...(editingId !== null && { id: editingId }),
              title: cleanTitle,
              description: cleanDescription,
              image: form.image.trim(),
              ...(showCategory && { kategori: form.kategori }),
            }),
          });
        }

        if (!response.ok) {
          let errorMessage = "Gagal menyimpan data. Silakan coba lagi.";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // Gunakan pesan default jika respons bukan JSON.
          }

          throw new Error(errorMessage);
        }

        const savedItem: Item = await response.json();

        if (editingId !== null) {
          setItems((prev) =>
            prev.map((item) =>
              item.id === editingId ? savedItem : item
            )
          );
        } else {
          setItems((prev) => [savedItem, ...prev]);
        }
      } else {
        if (editingId !== null) {
          saveItems(
            items.map((item) =>
              item.id === editingId
                ? {
                    ...item,
                    ...form,
                    title: cleanTitle,
                    description: cleanDescription,
                  }
                : item
            )
          );
        } else {
          const newItem: Item = {
            id: Date.now(),
            title: cleanTitle,
            description: cleanDescription,
            image: form.image.trim(),
            ...(showCategory && { kategori: form.kategori }),
          };

          saveItems([...items, newItem]);
        }
      }

      setPopup({
        show: true,
        message:
          editingId !== null
            ? "Data berhasil diperbarui!"
            : "Data berhasil ditambahkan!",
        type: "success",
      });

      resetForm();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);

      setPopup({
        show: true,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data. Silakan coba lagi.",
        type: "error",
      });
    }
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      image: "",
      kategori: "Informations",
    });

    setImageFile(null);
    setEditingId(null);
  }

  function handleEdit(item: Item) {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image || "",
      kategori: item.kategori || "Informations",
    });

    setImageFile(null);
    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Menampilkan popup konfirmasi sebelum menghapus
  function handleDelete(id: number) {
    setDeleteTarget(id);

    setPopup({
      show: true,
      message: "Yakin mau menghapus data ini?",
      type: "confirm",
    });
  }

  // Menghapus data setelah pengguna menekan tombol Hapus
  async function confirmDelete() {
    if (deleteTarget === null) return;

    const id = deleteTarget;

    try {
      if (apiEndpoint) {
        const response = await fetch(apiEndpoint, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          let errorMessage = "Gagal menghapus data.";

          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // Gunakan pesan default jika respons bukan JSON.
          }

          throw new Error(errorMessage);
        }

        setItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        saveItems(items.filter((item) => item.id !== id));
      }

      if (editingId === id) {
        resetForm();
      }

      setDeleteTarget(null);

      setPopup({
        show: true,
        message: "Data berhasil dihapus!",
        type: "delete",
      });
    } catch (error) {
      console.error("Gagal menghapus data:", error);

      setDeleteTarget(null);

      setPopup({
        show: true,
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghapus data.",
        type: "error",
      });
    }
  }

  function closePopup() {
    setPopup({
      show: false,
      message: "",
      type: "success",
    });

    setDeleteTarget(null);
  }

  return (
    <main className="admin-page admin-crud-page py-5">
      <Link href="/admin" className="admin-menu-link admin-crud-back">
        <i className="bx bx-arrow-back"></i>
        Kembali ke Dashboard
      </Link>

      <div className="admin-welcome admin-crud-welcome">
        <div>
          <span className="admin-eyebrow">PENGELOLAAN WEBSITE</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="admin-crud-welcome-icon">
          <i className={showCategory ? "bx bx-news" : "bx bx-images"}></i>
        </div>
      </div>

      <div className="admin-crud-panel admin-crud-form">
        <div className="admin-crud-form-heading">
          <div>
            <span className="admin-eyebrow">
              {editingId !== null ? "PERBARUI INFORMASI" : "DATA BARU"}
            </span>
            <h2>{editingId !== null ? "Edit Data" : "Tambah Data"}</h2>
            <p>Lengkapi informasi berikut untuk mengelola konten website.</p>
          </div>

          <div className="admin-crud-form-icon">
            <i className="bx bx-edit-alt"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-crud-fields">
            <div className="admin-crud-field">
              <label className="form-label">{titleLabel}</label>
              <input
                className="form-control"
                placeholder={`Masukkan ${titleLabel.toLowerCase()}`}
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
              />
            </div>

            {showCategory && (
              <div className="admin-crud-field">
                <label className="form-label">Kategori Postingan</label>
                <select
                  className="form-select"
                  value={form.kategori}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      kategori: e.target.value as KategoriPostingan,
                    })
                  }
                  required
                >
                  {daftarKategori.map((kategori) => (
                    <option key={kategori.value} value={kategori.value}>
                      {kategori.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="admin-crud-field admin-crud-field-wide">
              <label className="form-label">{descriptionLabel}</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder={`Masukkan ${descriptionLabel.toLowerCase()}`}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>

            {showImage && (
              <div className="admin-crud-field admin-crud-field-wide">
                <label className="form-label">{imageLabel}</label>

                {uploadImage ? (
                  <div className="admin-crud-upload">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                      }}
                    />

                    <small className="text-secondary d-block mt-2">
                      Format JPG, JPEG, PNG, atau WebP. Maksimal 5 MB.
                    </small>

                    {imageFile && (
                      <p className="admin-crud-file-name">
                        <i className="bx bx-image"></i>
                        {imageFile.name}
                      </p>
                    )}

                    {editingId !== null && form.image && !imageFile && (
                      <div className="admin-crud-current-image">
                        <Image
                          src={form.image}
                          alt="Foto saat ini"
                          width={200}
                          height={130}
                          unoptimized
                        />

                        <div>
                          <strong>Foto saat ini</strong>
                          <small>Pilih foto baru jika ingin menggantinya.</small>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://contoh.com/gambar.jpg"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className="admin-crud-form-actions">
            <button className="btn btn-danger" type="submit">
              <i className="bx bx-save"></i>
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

      <div className="admin-crud-list-heading">
        <div>
          <span className="admin-eyebrow">KONTEN WEBSITE</span>
          <h2 className="admin-section-title">Daftar Data</h2>
        </div>

        <span className="admin-count">{items.length} data</span>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty admin-crud-empty">
          <i className="bx bx-folder-open"></i>
          <h3>Belum Ada Data</h3>
          <p>Gunakan form di atas untuk menambahkan data baru.</p>
        </div>
      ) : (
        <div className="admin-crud-grid">
          {items.map((item) => (
            <div className="admin-crud-item admin-crud-card" key={item.id}>
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

              <div className="admin-crud-card-content">
                {showCategory && (
                  <span className="badge bg-warning text-dark admin-crud-category">
                    {namaKategori(item.kategori)}
                  </span>
                )}

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>

              <div className="admin-crud-card-actions">
                <button
                  className="btn btn-sm btn-outline-light"
                  onClick={() => handleEdit(item)}
                >
                  <i className="bx bx-edit-alt"></i>
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bx bx-trash"></i>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup custom untuk berhasil, gagal, dan konfirmasi hapus */}
      {popup.show && (
        <div className="admin-popup-overlay">
          <div
            className={`admin-popup ${
              popup.type === "success" ? "success" : "delete"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-popup-title"
          >
            <div className="admin-popup-icon">
              <i
                className={`bx ${
                  popup.type === "confirm"
                    ? "bx-help-circle"
                    : popup.type === "error"
                      ? "bx-error-circle"
                      : "bx-check"
                }`}
              ></i>
            </div>

            <h3 id="admin-popup-title">
              {popup.type === "confirm"
                ? "Hapus Data?"
                : popup.type === "error"
                  ? "Gagal!"
                  : popup.type === "delete"
                    ? "Terhapus!"
                    : "Berhasil!"}
            </h3>

            <p>{popup.message}</p>

            {popup.type === "confirm" ? (
              <div className="admin-popup-actions">
                <button type="button" onClick={closePopup}>
                  Batal
                </button>

                <button type="button" onClick={confirmDelete}>
                  Hapus
                </button>
              </div>
            ) : (
              <button type="button" onClick={closePopup}>
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
