import { prisma } from "../lib/prisma";

async function main() {
  await prisma.konten.deleteMany();

  await prisma.konten.createMany({
    data: [
      { jenis: "galeri", title: "Bumbu base genep", description: "Bumbu wajib khas Bali", image: "/galeri/base-genep-final.jpg" },
      { jenis: "galeri", title: "Nasi campur khas Bali", description: "Sajian lengkap babi guling", image: "/galeri/nascam.jpg" },
      { jenis: "resto", title: "Babi Guling Pak Malen", description: "Resto babi guling terkenal di Seminyak", image: "" },
      { jenis: "postingan", title: "Sejarah Babi Guling", description: "Babi guling sudah ada sejak ...", image: "" },
    ],
  });

  console.log("Seed selesai");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());