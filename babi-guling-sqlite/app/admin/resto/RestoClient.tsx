"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  tambahRestoran,
  updateRestoran,
  hapusRestoran,
} from "@/app/actions/resto";
import styles from "./AdminResto.module.css";

// tipe data yang dipakai untuk restoran
type Restoran = {
  id: number;
  nama: string;
  alamat: string;
  rating: number;
  _count: { likes: number; komentar: number };
};

// jenis popup yang bisa ditampilin
type PopupType = "success" | "delete" | "error" | "confirm";

export default function RestoClient({
  restoranList,
}: {
  restoranList: Restoran[];
}) {
  // menyimpan id restoran yang sedang diedit
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: "", alamat: "" });
  const [isPending, startTransition] = useTransition();

  // menyimpan status, pesan, dan jenis popup
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: PopupType;
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // menyimpan id restoran yang akan dihapus
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // menampilkan popup sesuai pesan dan jenisnya
  function showPopup(message: string, type: PopupType) {
    setPopup({ show: true, message, type });
  }

  // menutup popup dan mereset target hapus
  function closePopup() {
    setPopup({
      show: false,
      message: "",
      type: "success",
    });
    setDeleteTarget(null);
  }

  // mengosongkan form dan keluar dari mode edit
  function resetForm() {
    setForm({ nama: "", alamat: "" });
    setEditingId(null);
  }

  // menangani form saat tambah atau edit restoran
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // menghapus spasi di awal dan akhir input
    const nama = form.nama.trim();
    const alamat = form.alamat.trim();

    // mengecek agar nama dan alamat tidak kosong
    if (!nama || !alamat) {
      showPopup("Nama dan alamat restoran wajib diisi.", "error");
      return;
    }

    // menjalankan proses penyimpanan
    startTransition(async () => {
      try {
        // kalau ada id, data restoran akan diperbarui
        if (editingId !== null) {
          await updateRestoran(editingId, nama, alamat);
          showPopup("Data restoran berhasil diperbarui!", "success");
        } else {
          // kalau tidak ada id, restoran baru akan ditambahkan
          await tambahRestoran(nama, alamat);
          showPopup("Data restoran berhasil ditambahkan!", "success");
        }

        // mereset form setelah proses berhasil
        resetForm();
      } catch (error) {
        // menampilkan pesan kalau penyimpanan gagal
        console.error("Gagal menyimpan restoran:", error);
        showPopup(
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data restoran.",
          "error"
        );
      }
    });
  }

  // memasukkan data restoran yang dipilih ke form edit
  function handleEdit(resto: Restoran) {
    setForm({
      nama: resto.nama,
      alamat: resto.alamat,
    });

    setEditingId(resto.id);

    // menggulir halaman ke atas agar form terlihat
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // menampilkan konfirmasi sebelum restoran dihapus
  function handleDelete(id: number) {
    setDeleteTarget(id);
    showPopup("Yakin mau menghapus restoran ini?", "confirm");
  }

  // menjalankan penghapusan setelah dikonfirmasi
  function confirmDelete() {
    if (deleteTarget === null) return;

    const id = deleteTarget;

    startTransition(async () => {
      try {
        await hapusRestoran(id);

        // mereset form kalau restoran yang dihapus sedang diedit
        if (editingId === id) {
          resetForm();
        }

        setDeleteTarget(null);
        showPopup("Restoran berhasil dihapus!", "delete");
      } catch (error) {
        // menampilkan pesan kalau penghapusan gagal
        console.error("Gagal menghapus restoran:", error);

        setDeleteTarget(null);
        showPopup(
          error instanceof Error
            ? error.message
            : "Gagal menghapus restoran.",
          "error"
        );
      }
    });
  }

  return (
    <main className={`container ${styles.restoPage}`}>
      <Link href="/admin" className={styles.backLink}>
        <i className="bx bx-arrow-back"></i>
        Kembali ke Dashboard
      </Link>

      {/* bagian sambutan halaman admin */}
      <section className={styles.welcome}>
        <span className={styles.eyebrow}>PENGELOLAAN WEBSITE</span>
        <h1>Kelola Restoran</h1>
        <p>
          Tambahkan dan atur daftar restoran rekomendasi Babi Guling.
        </p>
      </section>

      {/* form untuk menambah atau mengedit restoran */}
      <section className={styles.formPanel}>
        <div className={styles.formHeading}>
          <div>
            <span className={styles.sectionLabel}>
              {editingId !== null ? "PERBARUI DATA" : "DATA RESTORAN"}
            </span>
            <h2>
              {editingId !== null ? "Edit Restoran" : "Tambah Restoran"}
            </h2>
          </div>

          <div className={styles.formIcon}>
            <i className="bx bx-store"></i>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nama">Nama Restoran</label>
            <input
              id="nama"
              type="text"
              className="form-control"
              placeholder="Masukkan nama restoran"
              value={form.nama}
              onChange={(e) =>
                setForm({ ...form, nama: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="alamat">Alamat Restoran</label>
            <textarea
              id="alamat"
              className="form-control"
              rows={3}
              placeholder="Masukkan alamat restoran"
              value={form.alamat}
              onChange={(e) =>
                setForm({ ...form, alamat: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formActions}>
            <button
              className={styles.submitBtn}
              type="submit"
              disabled={isPending}
            >
              <i className="bx bx-save"></i>
              {isPending
                ? "Memproses..."
                : editingId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Restoran"}
            </button>

            {/* tombol batal hanya muncul saat mode edit */}
            {editingId !== null && (
              <button
                className={styles.cancelBtn}
                type="button"
                onClick={resetForm}
                disabled={isPending}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>

      {/* bagian daftar restoran yang tersimpan */}
      <section className={styles.listSection}>
        <div className={styles.listHeading}>
          <div>
            <span className={styles.sectionLabel}>DATABASE</span>
            <h2>Daftar Restoran</h2>
          </div>

          {/* menampilkan jumlah data restoran */}
          <span className={styles.count}>
            {restoranList.length} data
          </span>
        </div>

        {/* menampilkan pesan kalau belum ada data restoran */}
        {restoranList.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="bx bx-store-alt"></i>
            <h3>Belum Ada Restoran</h3>
            <p>Tambahkan data restoran melalui form di atas.</p>
          </div>
        ) : (
          // menampilkan data restoran dalam bentuk tabel
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama Restoran</th>
                  <th>Alamat</th>
                  <th>Rating</th>
                  <th>Likes</th>
                  <th>Komentar</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {/* menampilkan setiap restoran dari daftar */}
                {restoranList.map((resto) => (
                  <tr key={resto.id}>
                    <td className={styles.restaurantName}>
                      {resto.nama}
                    </td>

                    <td className={styles.address}>
                      {resto.alamat}
                    </td>

                    <td>
                      <span className={styles.rating}>
                        <i className="bx bxs-star"></i>
                        {resto.rating}
                      </span>
                    </td>

                    <td>{resto._count.likes}</td>

                    <td>{resto._count.komentar}</td>

                    <td>
                      <div className={styles.actionGroup}>
                        {/* tombol untuk mengedit restoran */}
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEdit(resto)}
                          disabled={isPending}
                        >
                          <i className="bx bx-edit-alt"></i>
                          Edit
                        </button>

                        {/* tombol untuk menghapus restoran */}
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(resto.id)}
                          disabled={isPending}
                        >
                          <i className="bx bx-trash"></i>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* popup custom */}
      {popup.show && (
        <div className="admin-popup-overlay">
          <div
            className={`admin-popup ${
              popup.type === "success" ? "success" : "delete"
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="resto-popup-title"
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

            <h3 id="resto-popup-title">
              {popup.type === "confirm"
                ? "Hapus Restoran?"
                : popup.type === "error"
                  ? "Gagal!"
                  : popup.type === "delete"
                    ? "Terhapus!"
                    : "Berhasil!"}
            </h3>

            <p>{popup.message}</p>

            {/* tombol popup menyesuaikan jenis pesannya */}
            {popup.type === "confirm" ? (
              <div className="admin-popup-actions">
                <button
                  type="button"
                  onClick={closePopup}
                  disabled={isPending}
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isPending}
                >
                  {isPending ? "Memproses..." : "Hapus"}
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