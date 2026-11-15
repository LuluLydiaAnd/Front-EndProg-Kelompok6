UPDATE "Konten"
SET "kategori" = 'Other'
WHERE "kategori"::text = 'Lainnya';

UPDATE "Konten"
SET "kategori" = 'Informations'
WHERE "kategori" IS NULL;

-- AlterEnum
BEGIN;

CREATE TYPE "KategoriPostingan_new" AS ENUM (
    'Promotions',
    'Reccomendation',
    'Informations',
    'Other'
);

ALTER TABLE "Konten"
ALTER COLUMN "kategori" TYPE "KategoriPostingan_new"
USING ("kategori"::text::"KategoriPostingan_new");
ALTER TYPE "KategoriPostingan" RENAME TO "KategoriPostingan_old";
ALTER TYPE "KategoriPostingan_new" RENAME TO "KategoriPostingan";
DROP TYPE "public"."KategoriPostingan_old";
COMMIT;

-- AlterTable
ALTER TABLE "Konten"
ALTER COLUMN "kategori" SET NOT NULL,
ALTER COLUMN "kategori" SET DEFAULT 'Informations';

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
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran"("id") ON DELETE CASCADE ON UPDATE CASCADE;
