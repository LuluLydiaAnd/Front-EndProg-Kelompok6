"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  tambahRestoran,
  updateRestoran,
  hapusRestoran,
} from "@/app/actions/resto";
import styles from "./AdminResto.module.css";

type Restoran = {
  id: number;
  nama: string;
  alamat: string;
  rating: number;
  likesCount: number;
};

export default function RestoClient({
  restoranList,
}: {
  restoranList: Restoran[];
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: "", alamat: "" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      if (editingId !== null) {
        await updateRestoran(editingId, form.nama, form.alamat);
      } else {
        await tambahRestoran(form.nama, form.alamat);
      }

      resetForm();
    });
  }

  function resetForm() {
    setForm({ nama: "", alamat: "" });
    setEditingId(null);
  }

  function handleEdit(resto: Restoran) {
    setForm({
      nama: resto.nama,
      alamat: resto.alamat,
    });

    setEditingId(resto.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleDelete(id: number) {
    if (window.confirm("Yakin mau menghapus restoran ini?")) {
      startTransition(async () => {
        await hapusRestoran(id);
      });
    }
  }

  return (
    <main className={`container ${styles.restoPage}`}>
      <Link href="/admin" className={styles.backLink}>
        <i className="bx bx-arrow-back"></i>
        Kembali ke Dashboard
      </Link>

      <section className={styles.welcome}>
        <span className={styles.eyebrow}>PENGELOLAAN WEBSITE</span>
        <h1>Kelola Restoran</h1>
        <p>
          Tambahkan dan atur daftar restoran rekomendasi Babi Guling.
        </p>
      </section>

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

      <section className={styles.listSection}>
        <div className={styles.listHeading}>
          <div>
            <span className={styles.sectionLabel}>DATABASE</span>
            <h2>Daftar Restoran</h2>
          </div>

          <span className={styles.count}>
            {restoranList.length} data
          </span>
        </div>

        {restoranList.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="bx bx-store-alt"></i>
            <h3>Belum Ada Restoran</h3>
            <p>Tambahkan data restoran melalui form di atas.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama Restoran</th>
                  <th>Alamat</th>
                  <th>Rating</th>
                  <th>Likes</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
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

                    <td>{resto.likesCount}</td>

                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => handleEdit(resto)}
                          disabled={isPending}
                        >
                          <i className="bx bx-edit-alt"></i>
                          Edit
                        </button>

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
    </main>
  );
}
