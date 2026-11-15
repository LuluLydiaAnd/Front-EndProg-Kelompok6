"use client";

import { useState } from "react";
import styles from "./Contact.module.css";

// data kontak kelompok
const EMAIL = "kelompok6.babiguling@gmail.com";
const WHATSAPP = "6281234567890";
const LOKASI = "Bali, Indonesia";

// daftar topik yang bisa dipilih pengunjung
const topikList = [
  { label: "Saran", icon: "bx bx-bulb" },
  { label: "Rekomendasi Resto", icon: "bx bx-store-alt" },
  { label: "Kolaborasi", icon: "bx bx-group" },
  { label: "Lainnya", icon: "bx bx-dots-horizontal-rounded" },
];

const MAX_PESAN = 500;

// tipe data untuk isi form dan pesan error
type Form = { nama: string; email: string; pesan: string };
type FormError = Partial<Record<keyof Form, string>>;

// memeriksa apakah input form sudah sesuai ketentuan
function cekForm(f: Form): FormError {
  const err: FormError = {};
  if (f.nama.trim().length < 2) err.nama = "Nama minimal 2 huruf";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) err.email = "Format email belum benar";
  if (f.pesan.trim().length < 10) err.pesan = "Pesan minimal 10 karakter";
  return err;
}

// komponen utama halaman kontak
export default function Contact() {
  // menyimpan nilai yang diisi pengunjung
  const [form, setForm] = useState<Form>({ nama: "", email: "", pesan: "" });
  const [topik, setTopik] = useState("Saran");
  const [disentuh, setDisentuh] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [toast, setToast] = useState("");
  const [tersalin, setTersalin] = useState(false);

  // memeriksa validitas form berdasarkan nilai terbaru
  const error = cekForm(form);
  const valid = Object.keys(error).length === 0;

  // memperbarui nilai input dan membatasi panjang pesan
  const ubah = (field: keyof Form, value: string) => {
    if (field === "pesan" && value.length > MAX_PESAN) return;
    setForm({ ...form, [field]: value });
  };

  // menampilkan notifikasi sementara
  const tampilToast = (teks: string) => {
    setToast(teks);
    setTimeout(() => setToast(""), 2500);
  };

  // menyusun isi pesan untuk whatsapp atau email
  const isiPesan = () =>
    `Halo tim Babi Guling!\n\nNama: ${form.nama}\nEmail: ${form.email}\nTopik: ${topik}\n\n${form.pesan}`;

  // memvalidasi form lalu membuka media pengiriman yang dipilih
  const kirim = (lewat: "wa" | "email") => {
    setDisentuh({ nama: true, email: true, pesan: true });
    if (!valid) {
      tampilToast("Lengkapi form dulu ya");
      return;
    }

    // membuka whatsapp dengan isi pesan yang sudah disiapkan
    if (lewat === "wa") {
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(isiPesan())}`, "_blank");
      tampilToast("Membuka WhatsApp...");
    } else {
      // membuka aplikasi email dengan subjek dan isi pesan
      const subjek = encodeURIComponent(`[${topik}] Pesan dari ${form.nama}`);
      window.location.href = `mailto:${EMAIL}?subject=${subjek}&body=${encodeURIComponent(isiPesan())}`;
      tampilToast("Membuka aplikasi email...");
    }
  };

  // menyalin alamat email ke clipboard
  const salinEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      tampilToast("Gagal menyalin email");
    }
  };

  // menampilkan error hanya setelah field disentuh
  const errorOf = (field: keyof Form) => (disentuh[field] ? error[field] : undefined);

  return (
    <section id="kontak" className={styles.section}>
      <div className="container">
        {/* judul dan deskripsi bagian kontak */}
        <div className={styles.head}>
          <p className={styles.label}>Contact</p>
          <h2 className={styles.title}>
            Mari <span>Ngobrol</span>
          </h2>
          <p className={styles.desc}>
            Punya saran, rekomendasi resto, atau mau kolaborasi? Tulis pesanmu, lalu kirim lewat
            WhatsApp atau email.
          </p>
        </div>

        <div className={styles.wrap}>
          {/* kartu informasi kontak di sebelah kiri */}
          <aside className={styles.info}>
            <div className={styles.infoTop}>
              <h3>Info Kontak</h3>
              <p>Pilih cara yang paling nyaman buat kamu.</p>
            </div>

            {/* menampilkan email, whatsapp, dan lokasi */}
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <i className="bx bx-envelope"></i>
                </span>
                <div className={styles.infoText}>
                  <small>Email</small>
                  <p>{EMAIL}</p>
                </div>
                <button className={styles.copyBtn} onClick={salinEmail} aria-label="Salin email">
                  <i className={tersalin ? "bx bx-check" : "bx bx-copy"}></i>
                </button>
              </div>

              <a
                className={styles.infoItem}
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.infoIcon}>
                  <i className="bx bxl-whatsapp"></i>
                </span>
                <div className={styles.infoText}>
                  <small>WhatsApp</small>
                  <p>Chat langsung</p>
                </div>
                <i className={`bx bx-right-arrow-alt ${styles.arrow}`}></i>
              </a>

              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <i className="bx bx-map"></i>
                </span>
                <div className={styles.infoText}>
                  <small>Lokasi</small>
                  <p>{LOKASI}</p>
                </div>
              </div>
            </div>

            {/* kutipan dekoratif pada kartu kontak */}
            <div className={styles.quote}>
              <i className="bx bxs-quote-alt-left"></i>
              <p>Makan babi guling paling enak itu bareng-bareng. Ngobrol juga gitu.</p>
            </div>

            {/* ikon dekorasi di latar kartu */}
            <i className={`bx bx-bowl-hot ${styles.infoDeco}`}></i>
          </aside>

          {/* form untuk mengirim pesan */}
          <div className={styles.formCard}>
            <p className={styles.formLabel}>Mau ngobrolin apa?</p>

            {/* pilihan topik pesan */}
            <div className={styles.topik}>
              {topikList.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={`${styles.topikBtn} ${topik === t.label ? styles.topikActive : ""}`}
                  onClick={() => setTopik(t.label)}
                >
                  <i className={t.icon}></i> {t.label}
                </button>
              ))}
            </div>

            <div className="row g-3">
              {/* input nama pengunjung */}
              <div className="col-md-6">
                <div className={`${styles.field} ${errorOf("nama") ? styles.fieldError : ""}`}>
                  <input
                    id="nama"
                    type="text"
                    placeholder=" "
                    value={form.nama}
                    onChange={(e) => ubah("nama", e.target.value)}
                    onBlur={() => setDisentuh({ ...disentuh, nama: true })}
                  />
                  <label htmlFor="nama">Nama kamu</label>
                  <i className="bx bx-user"></i>
                </div>
                {errorOf("nama") && <small className={styles.errText}>{errorOf("nama")}</small>}
              </div>

              {/* input email pengunjung */}
              <div className="col-md-6">
                <div className={`${styles.field} ${errorOf("email") ? styles.fieldError : ""}`}>
                  <input
                    id="email"
                    type="email"
                    placeholder=" "
                    value={form.email}
                    onChange={(e) => ubah("email", e.target.value)}
                    onBlur={() => setDisentuh({ ...disentuh, email: true })}
                  />
                  <label htmlFor="email">Email</label>
                  <i className="bx bx-at"></i>
                </div>
                {errorOf("email") && <small className={styles.errText}>{errorOf("email")}</small>}
              </div>

              {/* input isi pesan dengan batas maksimal karakter */}
              <div className="col-12">
                <div
                  className={`${styles.field} ${styles.fieldArea} ${
                    errorOf("pesan") ? styles.fieldError : ""
                  }`}
                >
                  <textarea
                    id="pesan"
                    rows={5}
                    placeholder=" "
                    value={form.pesan}
                    onChange={(e) => ubah("pesan", e.target.value)}
                    onBlur={() => setDisentuh({ ...disentuh, pesan: true })}
                  />
                  <label htmlFor="pesan">
                    {topik === "Rekomendasi Resto"
                      ? "Nama resto, lokasi, dan menu andalannya"
                      : "Tulis pesanmu di sini"}
                  </label>
                </div>

                {/* menampilkan error dan jumlah karakter pesan */}
                <div className={styles.areaBottom}>
                  {errorOf("pesan") ? (
                    <small className={styles.errText}>{errorOf("pesan")}</small>
                  ) : (
                    <span></span>
                  )}
                  <small
                    className={`${styles.counter} ${
                      form.pesan.length > MAX_PESAN * 0.9 ? styles.counterWarn : ""
                    }`}
                  >
                    {form.pesan.length}/{MAX_PESAN}
                  </small>
                </div>

                {/* indikator panjang pesan yang sudah diketik */}
                <div className={styles.progress}>
                  <span style={{ width: `${(form.pesan.length / MAX_PESAN) * 100}%` }}></span>
                </div>
              </div>
            </div>

            {/* tombol pengiriman pesan melalui whatsapp atau email */}
            <div className={styles.actions}>
              <button type="button" className={styles.btnWa} onClick={() => kirim("wa")}>
                <i className="bx bxl-whatsapp"></i> Kirim via WhatsApp
              </button>
              <button type="button" className={styles.btnMail} onClick={() => kirim("email")}>
                <i className="bx bx-send"></i> Kirim via Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* notifikasi yang muncul saat ada aksi pada form */}
      <div className={`${styles.toast} ${toast ? styles.toastShow : ""}`}>
        <i className="bx bx-info-circle"></i> {toast}
      </div>
    </section>
  );
}