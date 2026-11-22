"use client";

import { useEffect, useState } from "react";
import styles from "./Faq.module.css";
import { faqList, type Kategori } from "@/lib/faqData";
import { kirimFeedbackFaq } from "@/app/actions/faq";

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
  const [formAlasan, setFormAlasan] = useState<number | null>(null);
  const [alasan, setAlasan] = useState("");
  const [kirim, setKirim] = useState(false);
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

  // ambil vote yang pernah dikirim (biar tidak vote berkali-kali setelah refresh)
  useEffect(() => {
    const simpan = localStorage.getItem("faq-vote");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (simpan) setVote(JSON.parse(simpan));
  }, []);

  const simpanVote = async (id: number, nilai: "ya" | "tidak", isiAlasan = "") => {
    setKirim(true);
    try {
      await kirimFeedbackFaq(id, nilai === "ya", isiAlasan);
      const baru = { ...vote, [id]: nilai };
      setVote(baru);
      localStorage.setItem("faq-vote", JSON.stringify(baru));
      setFormAlasan(null);
      setAlasan("");
    } catch {
      alert("Feedback gagal dikirim, coba lagi ya.");
    } finally {
      setKirim(false);
    }
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
                            ) : formAlasan === f.id ? (
                              <div className={styles.alasanBox}>
                                <label htmlFor={`alasan-${f.id}`}>
                                  Apa yang kurang dari jawaban ini? (opsional)
                                </label>
                                <textarea
                                  id={`alasan-${f.id}`}
                                  rows={2}
                                  maxLength={500}
                                  placeholder="Misalnya: kurang detail, info salah, dll."
                                  value={alasan}
                                  onChange={(e) => setAlasan(e.target.value)}
                                />
                                <div className={styles.alasanAksi}>
                                  <button
                                    className={styles.kirimBtn}
                                    disabled={kirim}
                                    onClick={() => simpanVote(f.id, "tidak", alasan)}
                                  >
                                    <i className="bx bx-send"></i> {kirim ? "Mengirim..." : "Kirim"}
                                  </button>
                                  <button
                                    disabled={kirim}
                                    onClick={() => {
                                      setFormAlasan(null);
                                      setAlasan("");
                                    }}
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span>Jawaban ini membantu?</span>
                                <button disabled={kirim} onClick={() => simpanVote(f.id, "ya")}>
                                  <i className="bx bx-like"></i> Ya
                                </button>
                                <button
                                  disabled={kirim}
                                  onClick={() => {
                                    setFormAlasan(f.id);
                                    setAlasan("");
                                  }}
                                >
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