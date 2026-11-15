-- AlterEnum
BEGIN;

CREATE TYPE "KategoriPostingan_new" AS ENUM (
    'Promotions',
    'Recommendation',
    'Informations',
    'Other'
);

-- Hapus default lama agar tidak menghambat perubahan tipe
ALTER TABLE "Konten"
ALTER COLUMN "kategori" DROP DEFAULT;

-- Ubah tipe ENUM sekaligus sesuaikan nilai lama
ALTER TABLE "Konten"
ALTER COLUMN "kategori" TYPE "KategoriPostingan_new"
USING (
    CASE
        WHEN "kategori" IS NULL THEN 'Informations'
        WHEN "kategori"::text = 'Lainnya' THEN 'Other'
        ELSE "kategori"::text
    END
)::"KategoriPostingan_new";

ALTER TYPE "KategoriPostingan" RENAME TO "KategoriPostingan_old";

ALTER TYPE "KategoriPostingan_new" RENAME TO "KategoriPostingan";

DROP TYPE "KategoriPostingan_old";

-- AlterTable
ALTER TABLE "Konten"
ALTER COLUMN "kategori" SET NOT NULL,
ALTER COLUMN "kategori" SET DEFAULT 'Informations';

COMMIT;

-- CreateTable
CREATE TABLE "Restoran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restoran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id" SERIAL NOT NULL,
    "namaUser" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "restoranId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Komentar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Komentar_restoranId_idx" ON "Komentar"("restoranId");

-- AddForeignKey
ALTER TABLE "Komentar"
ADD CONSTRAINT "Komentar_restoranId_fkey"
FOREIGN KEY ("restoranId") REFERENCES "Restoran"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
