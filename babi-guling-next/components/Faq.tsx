"use client";

import { useState } from "react";
import styles from "./Faq.module.css";

type Kategori = "umum" | "bumbu" | "budaya" | "website";

type Pertanyaan = {
  id: number;
  tanya: string;
  jawab: string;
  kategori: Kategori;
};

const faqList: Pertanyaan[] = [
  {
    id: 1,
    kategori: "umum",
    tanya: "Apa itu babi guling?",
    jawab:
      "Babi guling adalah hidangan khas Bali berupa babi utuh yang perutnya diisi bumbu, lalu dipanggang sambil diputar (diguling) di atas bara api sampai matang dan kulitnya renyah.",
  },
  {
    id: 2,
    kategori: "umum",
    tanya: "Apakah babi guling halal?",
    jawab:
      "Tidak. Babi guling terbuat dari daging babi, jadi tidak halal dan tidak bisa dikonsumsi oleh umat Muslim.",
  },
  {
    id: 3,
    kategori: "umum",
    tanya: "Satu porsi nasi babi guling isinya apa saja?",
    jawab:
      "Biasanya nasi putih dengan irisan daging, kulit krispi, lawar, sate atau urutan (sosis khas Bali), dan sambal. Isinya bisa sedikit beda di tiap warung.",
  },
  {
    id: 4,
    kategori: "bumbu",
    tanya: "Apa itu base genep?",
    jawab:
      "Base genep artinya 'bumbu lengkap' dalam bahasa Bali. Isinya campuran rempah seperti bawang merah, bawang putih, kunyit, jahe, lengkuas, kencur, cabai, dan terasi. Bumbu inilah yang dimasukkan ke dalam perut babi.",
  },
  {
    id: 5,
    kategori: "bumbu",
    tanya: "Kenapa kulitnya bisa renyah dan kuning keemasan?",
    jawab:
      "Kulitnya diolesi air kunyit supaya warnanya keemasan, lalu babi terus diputar di atas bara agar panasnya merata. Hasilnya kulit yang garing dan mengkilap.",
  },
  {
    id: 6,
    kategori: "bumbu",
    tanya: "Berapa lama proses memanggangnya?",
    jawab:
      "Umumnya beberapa jam, tergantung ukuran babinya. Selama dipanggang babi harus terus diputar, jadi prosesnya butuh kesabaran.",
  },
  {
    id: 7,
    kategori: "budaya",
    tanya: "Kenapa babi guling penting dalam upacara adat Bali?",
    jawab:
      "Babi guling sering menjadi bagian dari sesajen dan hidangan dalam upacara adat, seperti odalan di pura, pernikahan, dan perayaan keluarga besar. Setelah upacara, hidangannya dinikmati bersama.",
  },
  {
    id: 8,
    kategori: "budaya",
    tanya: "Apakah babi guling cuma dimakan saat upacara?",
    jawab:
      "Dulu memang lebih banyak dibuat untuk upacara. Sekarang babi guling sudah dijual di banyak warung di Bali, jadi bisa dinikmati kapan saja.",
  },
  {
    id: 9,
    kategori: "website",
    tanya: "Bagaimana cara merekomendasikan resto favorit?",
    jawab:
      "Gampang! Isi form di bagian Contact, pilih topik 'Rekomendasi Resto', lalu tulis nama dan lokasi restonya.",
  },
  {
    id: 10,
    kategori: "website",
    tanya: "Ada info yang salah atau kurang, harus lapor ke mana?",
    jawab:
      "Kirim lewat form Contact dengan topik 'Saran'. Masukan kamu bantu ensiklopedia ini jadi makin lengkap.",
  },
];

const kategoriList: { label: string; value: Kategori | "semua"; icon: string }[] = [
  { label: "Semua", value: "semua", icon: "bx bx-grid-alt" },
  { label: "Umum", value: "umum", icon: "bx bx-info-circle" },
  { label: "Bumbu & Masak", value: "bumbu", icon: "bx bx-bowl-hot" },
  { label: "Budaya", value: "budaya", icon: "bx bx-landscape" },
  { label: "Website", value: "website", icon: "bx bx-globe" },
];

const faktaList: string[] = [
  "Kata 'genep' dalam base genep berarti lengkap, karena bumbunya memang berisi banyak rempah.",
  "Nama 'guling' berasal dari cara memasaknya: babi diputar atau diguling di atas bara api.",
  "Perut babi guling biasanya diisi base genep yang dicampur daun singkong.",
  "Warna keemasan pada kulit babi guling berasal dari olesan air kunyit.",
  "Babi guling sering hadir di upacara odalan, pernikahan, dan perayaan keluarga di Bali.",
];

function Sorot({ teks, kata }: { teks: string; kata: string }) {
  if (!kata.trim()) return <>{teks}</>;
  const aman = kata.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const bagian = teks.split(new RegExp(`(${aman})`, "gi"));
  return (
    <>
      {bagian.map((b, i) =>
        b.toLowerCase() === kata.toLowerCase() ? (
          <mark key={i} className={styles.mark}>
            {b}
          </mark>
        ) : (
          <span key={i}>{b}</span>
        )
      )}
    </>
  );
}

export default function Faq() {
  const [kategori, setKategori] = useState<Kategori | "semua">("semua");
  const [cari, setCari] = useState("");
  const [terbuka, setTerbuka] = useState<number[]>([1]);
  const [vote, setVote] = useState<Record<number, "ya" | "tidak">>({});
  const [fakta, setFakta] = useState(0);

  const kata = cari.trim().toLowerCase();
  const hasil = faqList.filter((f) => {
    const cocokKategori = kategori === "semua" || f.kategori === kategori;
    const cocokCari =
      !kata || f.tanya.toLowerCase().includes(kata) || f.jawab.toLowerCase().includes(kata);
    return cocokKategori && cocokCari;
  });

  const jumlah = (value: Kategori | "semua") =>
    value === "semua" ? faqList.length : faqList.filter((f) => f.kategori === value).length;

  const semuaTerbuka = hasil.length > 0 && hasil.every((f) => terbuka.includes(f.id));

  const toggle = (id: number) => {
    setTerbuka(terbuka.includes(id) ? terbuka.filter((x) => x !== id) : [...terbuka, id]);
  };

  const toggleSemua = () => {
    setTerbuka(semuaTerbuka ? [] : hasil.map((f) => f.id));
  };

  const faktaLain = () => {
    let baru = fakta;
    while (baru === fakta) baru = Math.floor(Math.random() * faktaList.length);
    setFakta(baru);
  };

  const reset = () => {
    setCari("");
    setKategori("semua");
  };

  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.label}>FAQ</p>
          <h2 className={styles.title}>
            Yang Sering <span>Ditanyakan</span>
          </h2>
          <p className={styles.desc}>
            Penasaran soal babi guling? Cari jawabannya di sini, atau tanya langsung lewat form
            Contact.
          </p>

          <div className={styles.search}>
            <i className="bx bx-search"></i>
            <input
              type="text"
              placeholder="Cari pertanyaan, misalnya: base genep"
              value={cari}
              onChange={(e) => setCari(e.target.value)}
            />
            {cari && (
              <button className={styles.clear} onClick={() => setCari("")} aria-label="Hapus">
                <i className="bx bx-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className={styles.chips}>
          {kategoriList.map((k) => (
            <button
              key={k.value}
              className={`${styles.chip} ${kategori === k.value ? styles.chipActive : ""}`}
              onClick={() => setKategori(k.value)}
            >
              <i className={k.icon}></i>
              {k.label}
              <span className={styles.badge}>{jumlah(k.value)}</span>
            </button>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className={styles.listHead}>
              <p>
                Menampilkan <b>{hasil.length}</b> pertanyaan
              </p>
              {hasil.length > 0 && (
                <button className={styles.toggleAll} onClick={toggleSemua}>
                  <i className={semuaTerbuka ? "bx bx-collapse-alt" : "bx bx-expand-alt"}></i>
                  {semuaTerbuka ? "Tutup semua" : "Buka semua"}
                </button>
              )}
            </div>

            {hasil.length === 0 ? (
              <div className={styles.kosong}>
                <i className="bx bx-search-alt"></i>
                <h3>Belum ketemu nih</h3>
                <p>Coba pakai kata lain, atau kirim pertanyaanmu lewat form Contact.</p>
                <button onClick={reset}>Reset pencarian</button>
              </div>
            ) : (
              <div className={styles.list}>
                {hasil.map((f, i) => {
                  const buka = terbuka.includes(f.id);
                  return (
                    <div
                      key={f.id}
                      className={`${styles.item} ${buka ? styles.itemOpen : ""}`}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <button className={styles.question} onClick={() => toggle(f.id)}>
                        <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
                        <span className={styles.qText}>
                          <Sorot teks={f.tanya} kata={cari.trim()} />
                        </span>
                        <span className={styles.icon}>
                          <i className="bx bx-plus"></i>
                        </span>
                      </button>

                      <div className={styles.answerWrap}>
                        <div className={styles.answer}>
                          <p>
                            <Sorot teks={f.jawab} kata={cari.trim()} />
                          </p>

                          <div className={styles.helpful}>
                            {vote[f.id] ? (
                              <span className={styles.thanks}>
                                <i className="bx bx-heart"></i> Makasih atas feedback-nya!
                              </span>
                            ) : (
                              <>
                                <span>Jawaban ini membantu?</span>
                                <button onClick={() => setVote({ ...vote, [f.id]: "ya" })}>
                                  <i className="bx bx-like"></i> Ya
                                </button>
                                <button onClick={() => setVote({ ...vote, [f.id]: "tidak" })}>
                                  <i className="bx bx-dislike"></i> Belum
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className={styles.side}>
              <div className={styles.factCard}>
                <div className={styles.factHead}>
                  <span>
                    <i className="bx bx-bulb"></i> Tahukah kamu?
                  </span>
                  <button onClick={faktaLain} aria-label="Fakta lain">
                    <i className="bx bx-refresh"></i>
                  </button>
                </div>
                <p key={fakta} className={styles.factText}>
                  {faktaList[fakta]}
                </p>
                <div className={styles.dots}>
                  {faktaList.map((_, i) => (
                    <span key={i} className={i === fakta ? styles.dotActive : ""}></span>
                  ))}
                </div>
              </div>

              <div className={styles.askCard}>
                <i className={`bx bx-message-square-dots ${styles.askIcon}`}></i>
                <h3>Masih ada pertanyaan?</h3>
                <p>Kirim aja langsung ke kami, nanti kami bantu jawab.</p>
                <a href="#kontak" className={styles.askBtn}>
                  Hubungi Kami <i className="bx bx-right-arrow-alt"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}