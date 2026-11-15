-- CreateEnum
CREATE TYPE "KategoriPostingan" AS ENUM ('Reccomendation', 'Promotions', 'Lainnya');

-- AlterTable
ALTER TABLE "Konten" ADD COLUMN     "kategori" "KategoriPostingan";
