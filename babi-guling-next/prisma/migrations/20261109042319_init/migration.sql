-- CreateEnum
CREATE TYPE "Jenis" AS ENUM ('galeri', 'postingan', 'resto');

-- CreateTable
CREATE TABLE "Konten" (
    "id" SERIAL NOT NULL,
    "jenis" "Jenis" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konten_pkey" PRIMARY KEY ("id")
);
