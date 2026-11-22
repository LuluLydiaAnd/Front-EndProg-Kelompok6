"use server";

import { prisma } from "@/lib/prisma";

type Target = { restoranId?: number; kontenId?: number };

// Target harus salah satu: restoran atau postingan
function getTarget(target: Target) {
  const isResto = typeof target.restoranId === "number";
  const isPost = typeof target.kontenId === "number";

  if (isResto === isPost) {
    throw new Error("Target tidak valid.");
  }

  return isResto
    ? { restoranId: target.restoranId }
    : { kontenId: target.kontenId };
}

export async function getUserStatus(userId: number, target: Target) {
  const where = { userId, ...getTarget(target) };

  const [like, favorite] = await Promise.all([
    prisma.like.findFirst({ where }),
    prisma.favorit.findFirst({ where }),
  ]);

  return { liked: !!like, favorited: !!favorite };
}

export async function toggleLike(userId: number, target: Target) {
  const where = { userId, ...getTarget(target) };
  const existing = await prisma.like.findFirst({ where });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return false;
  }

  await prisma.like.create({ data: where });
  return true;
}

export async function toggleFavorite(userId: number, target: Target) {
  const where = { userId, ...getTarget(target) };
  const existing = await prisma.favorit.findFirst({ where });

  if (existing) {
    await prisma.favorit.delete({ where: { id: existing.id } });
    return false;
  }

  await prisma.favorit.create({ data: where });
  return true;
}

export async function getComments(target: Target) {
  return prisma.komentar.findMany({
    where: getTarget(target),
    orderBy: { createdAt: "desc" },
    select: { id: true, namaUser: true, isi: true, createdAt: true },
  });
}

export async function addComment(userId: number, content: string, target: Target) {
  const text = content.trim();

  if (!text) throw new Error("Komentar tidak boleh kosong.");
  if (text.length > 500) throw new Error("Komentar maksimal 500 karakter.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User tidak ditemukan.");

  return prisma.komentar.create({
    data: {
      isi: text,
      namaUser: user.name ?? user.email,
      userId,
      ...getTarget(target),
    },
    select: { id: true, namaUser: true, isi: true, createdAt: true },
  });
}

export async function getUserSummary(userId: number) {
  const [likeCount, commentCount, favoriteCount, likes, comments, favorites] =
    await Promise.all([
      prisma.like.count({ where: { userId } }),
      prisma.komentar.count({ where: { userId } }),
      prisma.favorit.count({ where: { userId } }),
      prisma.like.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          restoran: { select: { nama: true } },
          konten: { select: { title: true } },
        },
      }),
      prisma.komentar.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          restoran: { select: { nama: true } },
          konten: { select: { title: true } },
        },
      }),
      prisma.favorit.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          restoran: { select: { nama: true } },
          konten: { select: { title: true } },
        },
      }),
    ]);

  const activities = [
    ...likes.map((item) => ({
      id: `like-${item.id}`,
      type: "like" as const,
      title: item.restoran?.nama ?? item.konten?.title ?? "-",
      content: "",
      createdAt: item.createdAt,
    })),
    ...comments.map((item) => ({
      id: `comment-${item.id}`,
      type: "comment" as const,
      title: item.restoran?.nama ?? item.konten?.title ?? "-",
      content: item.isi,
      createdAt: item.createdAt,
    })),
    ...favorites.map((item) => ({
      id: `favorite-${item.id}`,
      type: "favorite" as const,
      title: item.restoran?.nama ?? item.konten?.title ?? "-",
      content: "",
      createdAt: item.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return { likeCount, commentCount, favoriteCount, activities };
}
