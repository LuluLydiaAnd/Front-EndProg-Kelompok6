/*
  Warnings:

  - The values [Recommendation] on the enum `KategoriPostingan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KategoriPostingan_new" AS ENUM ('Promotions', 'Reccomendation', 'Informations', 'Other');
ALTER TABLE "public"."Konten" ALTER COLUMN "kategori" DROP DEFAULT;
ALTER TABLE "Konten" ALTER COLUMN "kategori" TYPE "KategoriPostingan_new" USING ("kategori"::text::"KategoriPostingan_new");
ALTER TYPE "KategoriPostingan" RENAME TO "KategoriPostingan_old";
ALTER TYPE "KategoriPostingan_new" RENAME TO "KategoriPostingan";
DROP TYPE "public"."KategoriPostingan_old";
ALTER TABLE "Konten" ALTER COLUMN "kategori" SET DEFAULT 'Informations';
COMMIT;
