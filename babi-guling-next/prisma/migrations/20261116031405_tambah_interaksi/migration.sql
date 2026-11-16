-- AlterTable
ALTER TABLE "Komentar" ADD COLUMN     "kontenId" INTEGER,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "restoranId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "restoranId" INTEGER,
    "kontenId" INTEGER,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorit" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "restoranId" INTEGER,
    "kontenId" INTEGER,

    CONSTRAINT "Favorit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_restoranId_key" ON "Like"("userId", "restoranId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_kontenId_key" ON "Like"("userId", "kontenId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorit_userId_restoranId_key" ON "Favorit"("userId", "restoranId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorit_userId_kontenId_key" ON "Favorit"("userId", "kontenId");

-- CreateIndex
CREATE INDEX "Komentar_kontenId_idx" ON "Komentar"("kontenId");

-- CreateIndex
CREATE INDEX "Komentar_userId_idx" ON "Komentar"("userId");

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Komentar" ADD CONSTRAINT "Komentar_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorit" ADD CONSTRAINT "Favorit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorit" ADD CONSTRAINT "Favorit_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorit" ADD CONSTRAINT "Favorit_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten"("id") ON DELETE CASCADE ON UPDATE CASCADE;
