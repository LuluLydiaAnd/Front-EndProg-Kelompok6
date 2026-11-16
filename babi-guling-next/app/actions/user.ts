"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function refreshHalaman() {
  revalidatePath("/resto");
  revalidatePath("/postingan");
  revalidatePath("/user/dashboard");
}

// Data profil + jumlah interaksi
export async function getProfilUser(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { likes: true, komentar: true, favorit: true } },
    },
  });
}

// Semua komentar milik user
export async function getKomentarUser(userId: number) {
  return prisma.komentar.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      isi: true,
      createdAt: true,
      restoran: { select: { nama: true } },
      konten: { select: { title: true } },
    },
  });
}

// Hapus komentar (hanya boleh komentar milik sendiri)
export async function hapusKomentarUser(userId: number, komentarId: number) {
  const komentar = await prisma.komentar.findUnique({ where: { id: komentarId } });
  if (!komentar || komentar.userId !== userId) {
    throw new Error("Komentar tidak ditemukan.");
  }

  await prisma.komentar.delete({ where: { id: komentarId } });
  refreshHalaman();
}

// Semua favorit milik user
export async function getFavoritUser(userId: number) {
  return prisma.favorit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      createdAt: true,
      restoran: { select: { nama: true, alamat: true, rating: true } },
      konten: { select: { title: true, description: true } },
    },
  });
}

// Hapus dari favorit (hanya boleh milik sendiri)
export async function hapusFavoritUser(userId: number, favoritId: number) {
  const favorit = await prisma.favorit.findUnique({ where: { id: favoritId } });
  if (!favorit || favorit.userId !== userId) {
    throw new Error("Favorit tidak ditemukan.");
  }

  await prisma.favorit.delete({ where: { id: favoritId } });
  refreshHalaman();
}