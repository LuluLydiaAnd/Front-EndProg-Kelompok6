-- CreateTable
CREATE TABLE "Konten" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jenis" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "kategori" TEXT NOT NULL DEFAULT 'Informations',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Restoran" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "rating" REAL NOT NULL DEFAULT 4.5,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Komentar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaUser" TEXT NOT NULL,
    "isi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "restoranId" INTEGER,
    "kontenId" INTEGER,
    CONSTRAINT "Komentar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Komentar_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Komentar_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Like" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "restoranId" INTEGER,
    "kontenId" INTEGER,
    CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Like_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Favorit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "restoranId" INTEGER,
    "kontenId" INTEGER,
    CONSTRAINT "Favorit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorit_restoranId_fkey" FOREIGN KEY ("restoranId") REFERENCES "Restoran" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorit_kontenId_fkey" FOREIGN KEY ("kontenId") REFERENCES "Konten" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FaqFeedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faqId" INTEGER NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "membantu" BOOLEAN NOT NULL,
    "alasan" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Komentar_restoranId_idx" ON "Komentar"("restoranId");

-- CreateIndex
CREATE INDEX "Komentar_kontenId_idx" ON "Komentar"("kontenId");

-- CreateIndex
CREATE INDEX "Komentar_userId_idx" ON "Komentar"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_restoranId_key" ON "Like"("userId", "restoranId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_kontenId_key" ON "Like"("userId", "kontenId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorit_userId_restoranId_key" ON "Favorit"("userId", "restoranId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorit_userId_kontenId_key" ON "Favorit"("userId", "kontenId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset"("token");

-- CreateIndex
CREATE INDEX "PasswordReset_email_idx" ON "PasswordReset"("email");

-- CreateIndex
CREATE INDEX "FaqFeedback_faqId_idx" ON "FaqFeedback"("faqId");
