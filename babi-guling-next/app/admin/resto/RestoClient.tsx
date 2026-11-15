"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { tambahRestoran, updateRestoran, hapusRestoran } from "@/app/actions/resto";
import styles from './AdminResto.module.css';

type Restoran = {
  id: number;
  nama: string;
  alamat: string;
  rating: number;
  likesCount: number;
};

export default function RestoClient({ restoranList }: { restoranList: Restoran[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: "", alamat: "" });
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
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
    setForm({ nama: resto.nama, alamat: resto.alamat });
    setEditingId(resto.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    if (window.confirm("Yakin mau menghapus restoran ini?")) {
      startTransition(async () => {
        await hapusRestoran(id);
      });
    }
  }

  return (
    <main className="container admin-page py-5">
      <Link href="/admin" className="admin-menu-link mb-4" style={{ textDecoration: 'none', color: '#ccc' }}>
        <i className="bx bx-arrow-back"></i> Kembali ke Dashboard
      </Link>

      <div className="admin-welcome mb-4">
        <span className="admin-eyebrow" style={{ color: '#ff4757', letterSpacing: '2px', fontSize: '0.8rem' }}>DATABASE POSTGRES</span>
        <h1>Kelola Restoran Babi Guling</h1>
      </div>

      <div className="admin-crud-panel mb-4">
        <h2>{editingId !== null ? "Edit Restoran" : "Tambah Restoran"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nama Restoran</label>
            <input
              className="form-control"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })}
              required
            />
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-danger" type="submit" disabled={isPending}>
              {isPending ? "Memproses..." : (editingId !== null ? "Simpan Perubahan" : "Tambah Data")}
            </button>
            {editingId !== null && (
              <button className="btn btn-outline-light" type="button" onClick={resetForm} disabled={isPending}>
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3 mt-5">
        <h2 className="admin-section-title mb-0">Daftar Restoran</h2>
        <span className="admin-count">{restoranList.length} data</span>
      </div>

      {restoranList.length === 0 ? (
        <div className="admin-empty" style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #444' }}>Belum ada data di database.</div>
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
                  <td>{resto.nama}</td>
                  <td>{resto.alamat}</td>
                  <td>{resto.rating}</td>
                  <td>{resto.likesCount}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button type="button" className={styles.editBtn} onClick={() => handleEdit(resto)} disabled={isPending}>
                        Edit
                      </button>
                      <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(resto.id)} disabled={isPending}>
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
    </main>
  );
}