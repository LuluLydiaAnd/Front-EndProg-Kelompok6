"use client";

import { useState } from "react";
import styles from "./Faq.module.css";

type FaqData = {
  q: string;
  a: string;
};

const faqData: FaqData[] = [
  {
    q: "Apa itu base genep?",
    a: "Base genep adalah campuran bumbu dasar khas Bali yang terdiri dari kunyit, lengkuas, jahe, kencur, bawang merah, bawang putih, cabai, serai, dan daun jeruk. Bumbu ini menjadi ciri khas rasa masakan Bali, termasuk babi guling.",
  },
  {
    q: "Kenapa kulit babi guling bisa krispi?",
    a: "Kulit dilumuri campuran air dan bumbu tertentu (seperti air jeruk nipis atau kunyit), lalu dipanggang perlahan sambil terus diputar di atas bara api agar panas merata dan kulit mengering menjadi renyah.",
  },
  {
    q: "Berapa lama proses memanggang babi guling?",
    a: "Umumnya sekitar 3–5 jam, tergantung ukuran babi dan intensitas bara api yang digunakan.",
  },
  {
    q: "Apakah ada alternatif non-babi?",
    a: "Ada, beberapa daerah menyajikan versi 'ayam guling' dengan bumbu dan teknik memasak yang serupa sebagai alternatif bagi yang tidak mengonsumsi babi.",
  },
  {
    q: "Di mana tempat babi guling paling terkenal di Bali?",
    a: "Beberapa daerah yang terkenal dengan babi gulingnya antara lain Gianyar, Ubud, dan Karangasem, masing-masing dengan ciri khas bumbu dan cara penyajiannya sendiri.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <p className={styles.label}>FAQ</p>
          <h2 className={styles.title}>
            Sering <span>Ditanyakan</span>
          </h2>
          <p className={styles.desc}>
            Pertanyaan umum seputar sejarah, resep, dan tradisi Babi Guling.
          </p>
        </div>

        <div className={styles.accordion}>
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`${styles.item} ${isOpen ? styles.active : ""}`}>
                <button
                  className={styles.header}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span className={styles.question}>{item.q}</span>
                  <i
                    className={`bx bx-chevron-down ${styles.icon} ${
                      isOpen ? styles.iconRotate : ""
                    }`}
                  ></i>
                </button>
                <div className={`${styles.body} ${isOpen ? styles.bodyOpen : ""}`}>
                  <div className={styles.content}>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}