export type KategoriGaleri = "proses" | "sajian" | "upacara";

export type FotoGaleri = {
  id: number;
  title: string;
  description: string;
  image: string;
  kategori: KategoriGaleri;
};

// data awal galeri website
export const fotoGaleriAwal: FotoGaleri[] = [
  {
    id: 1,
    title: "Pemanggangan babi di atas bara api",
    description: "Proses pemanggangan babi guling di atas bara api.",
    image: "/galeri/sejarah-babi-guling-1.jpeg",
    kategori: "proses",
  },
  {
    id: 2,
    title: "Bumbu base genep",
    description: "Bumbu khas Bali untuk membuat babi guling.",
    image: "/galeri/base-genep-final.jpg",
    kategori: "proses",
  },
  {
    id: 3,
    title: "Sajian lengkap babi guling",
    description: "Hidangan lengkap babi guling khas Bali.",
    image: "/galeri/lengkap1.jpg",
    kategori: "sajian",
  },
  {
    id: 4,
    title: "Upacara adat Bali",
    description: "Tradisi dan upacara adat masyarakat Bali.",
    image: "/galeri/upacara.jpg",
    kategori: "upacara",
  },
  {
    id: 5,
    title: "Irisan babi guling di piring",
    description: "Potongan babi guling yang siap disajikan.",
    image: "/galeri/babipiring.jpg",
    kategori: "proses",
  },
  {
    id: 6,
    title: "Nasi campur babi guling",
    description: "Sajian nasi campur dengan babi guling.",
    image: "/galeri/dishfull.jpg",
    kategori: "sajian",
  },
  {
    id: 7,
    title: "Babi guling dengan sambal matah",
    description: "Babi guling yang disajikan dengan sambal matah.",
    image: "/galeri/babimatah.jpg",
    kategori: "sajian",
  },
  {
    id: 8,
    title: "Persembahan tradisi Ngusaba Sumbu",
    description: "Persembahan dalam tradisi Ngusaba Sumbu.",
    image: "/galeri/persembahanbabi.jpg",
    kategori: "upacara",
  },
  {
    id: 9,
    title: "Ritual Usaba Sumbu",
    description: "Dokumentasi ritual Usaba Sumbu.",
    image: "/galeri/usabasumbu.jpeg",
    kategori: "upacara",
  },
  {
    id: 10,
    title: "Babi guling & aneka sambal",
    description: "Babi guling yang disajikan bersama aneka sambal.",
    image: "/galeri/anekasam.jpg",
    kategori: "sajian",
  },
  {
    id: 11,
    title: "Kulit krispi, lawar, & sate",
    description: "Pelengkap hidangan babi guling khas Bali.",
    image: "/galeri/lawarkrispi.jpg",
    kategori: "sajian",
  },
  {
    id: 12,
    title: "Nasi campur khas Bali",
    description: "Nasi campur dengan berbagai lauk khas Bali.",
    image: "/galeri/nascam.jpg",
    kategori: "sajian",
  },
];
