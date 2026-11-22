// Data FAQ dipisah ke sini supaya bisa dipakai juga di halaman admin (/admin/faq)

export type Kategori = "umum" | "bumbu" | "budaya" | "website";

export type Pertanyaan = {
  id: number;
  tanya: string;
  jawab: string;
  kategori: Kategori;
};

export const faqList: Pertanyaan[] = [
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
  {
    id: 11,
    kategori: "umum",
    tanya: "Di mana tempat babi guling paling terkenal di Bali?",
    jawab:
      "Beberapa daerah yang terkenal dengan babi gulingnya antara lain Gianyar, Ubud, dan Karangasem, masing-masing dengan ciri khas bumbu dan cara penyajiannya sendiri.",
  },
];
