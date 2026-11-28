"use server";

import { prisma } from "@/lib/prisma";

export async function getUserProfile(userId: number) {
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

export async function getUserComments(userId: number) {
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

export async function deleteUserComment(userId: number, commentId: number) {
  const comment = await prisma.komentar.findUnique({ where: { id: commentId } });

  if (!comment || comment.userId !== userId) {
    throw new Error("Komentar tidak ditemukan.");
  }

  await prisma.komentar.delete({ where: { id: commentId } });
}

export async function getUserLikes(userId: number) {
  return prisma.like.findMany({
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

export async function deleteUserLike(userId: number, likeId: number) {
  const like = await prisma.like.findUnique({ where: { id: likeId } });

  if (!like || like.userId !== userId) {
    throw new Error("Data like tidak ditemukan.");
  }

  await prisma.like.delete({ where: { id: likeId } });
}

export async function getUserFavorites(userId: number) {
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

export async function deleteUserFavorite(userId: number, favoriteId: number) {
  const favorite = await prisma.favorit.findUnique({ where: { id: favoriteId } });

  if (!favorite || favorite.userId !== userId) {
    throw new Error("Favorit tidak ditemukan.");
  }

  await prisma.favorit.delete({ where: { id: favoriteId } });
}
