import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const dataRestoran = [
  { nama: "Babi Guling Bundaran Renon", alamat: "Denpasar" },
  { nama: "Babi Giling Candra", alamat: "Denpasar" },
  { nama: "Babi Guling Pan Ana", alamat: "Denpasar" },
  { nama: "Babi Guling Jero Kawan", alamat: "Mengwi" },
  { nama: "Babi Guling Singsing Bu Suci", alamat: "Mengwi" },
  { nama: "Babi Guling Bu Dayu Kencana", alamat: "Kuta" },
  { nama: "Babi Guling Karya Rebo", alamat: "Kuta" },
  { nama: "Babi Guling Bu Ning", alamat: "Kuta" },
  { nama: "Babi Guling Made Sekar", alamat: "Kuta" },
  { nama: "Babi Guling Krasan", alamat: "Kuta" },
  { nama: "Babi Guling Men Agus", alamat: "Canggu" },
  { nama: "Babi Guling Swari", alamat: "Canggu" },
  { nama: "Babi Guling Men Lari", alamat: "Canggu" },
  { nama: "Babi Guling Pak Malen", alamat: "Seminyak" },
  { nama: "Babi Guling Sari Dewi Sp. Dobiel", alamat: "Nusa Dua" },
  { nama: "Babi Guling Ibu Oka", alamat: "Gianyar" },
  { nama: "Babi Guling Pande Egi", alamat: "Gianyar" },
  { nama: "Babi Guling Bu Desak", alamat: "Gianyar" },
  { nama: "Babi Guling Depot Betty", alamat: "Bedugul" },
  { nama: "Babi Guling Men Janji", alamat: "Bedugul" },
  { nama: "Babi Guling Sembung", alamat: "Tabanan" },
  { nama: "Babi Guling Pak Yana", alamat: "Ubud" },
  { nama: "Babi Guling Bo Agung", alamat: "Ubud" },
  { nama: "Babi Guling Diirr", alamat: "Ubud" },
  { nama: "Babi Guling Vengkung", alamat: "Ubud" },
  { nama: "Babi Guling Bu Sendut", alamat: "Ubud" },
  { nama: "Babi Guling Dek Cing", alamat: "Ubud" },
  { nama: "Babi Guling Bu Suna", alamat: "Ubud" },
  { nama: "Babi Guling Payangan bu Ari", alamat: "Payangan" },
  { nama: "Babi Guling Dek Opa", alamat: "Klungkung" },
  { nama: "Babi Guling Ardhani", alamat: "Klungkung" },
  { nama: "Ajik Guling", alamat: "Klungkung" },
  { nama: "Babi Guling Sarin Paon", alamat: "Klungkung" },
  { nama: "Babi Guling Men Arta", alamat: "Klungkung" },
  { nama: "Babi Guling Ki Mokoh", alamat: "Klungkung" },
  { nama: "Babi Guling Pak Sena", alamat: "Klungkung" },
  { nama: "Babi Guling Bu Dewa", alamat: "Klungkung" },
  { nama: "Babi Guling Men Margi", alamat: "Klungkung" },
  { nama: "Babi Guling Dex Amix", alamat: "Klungkung" },
  { nama: "Babi Guling Pan Egi", alamat: "Klungkung" },
  { nama: "Babi Guling Mek Gede", alamat: "Klungkung" },
  { nama: "Babi Guling Sederhana", alamat: "Klungkung" },
  { nama: "Babi Guling Mertha Segara", alamat: "Klungkung" },
];

async function main() {
  console.log("Memulai proses seeding 43 data restoran...");

  for (const resto of dataRestoran) {
    await prisma.restoran.create({
      data: {
        nama: resto.nama,
        alamat: resto.alamat,
        deskripsi: "Sajian babi guling autentik khas Bali dengan bumbu base genep dan kulit renyah.",
        rating: Number((4.5 + Math.random() * 0.5).toFixed(1)),
        likesCount: Math.floor(Math.random() * 120) + 10,
      },
    });
  }

  console.log("Seeding 43 restoran selesai!");
}

main()
  .catch((e) => {
    console.error("Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });