"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type Target = { restoranId?: number; kontenId?: number };

// Pastikan target-nya salah satu: restoran ATAU postingan
function cekTarget(target: Target) {
  const adaResto = typeof target.restoranId === "number";
  const adaKonten = typeof target.kontenId === "number";

  if (adaResto === adaKonten) {
    throw new Error("Target harus restoran atau postingan.");
  }

  return adaResto
    ? { restoranId: target.restoranId }
    : { kontenId: target.kontenId };
}

function refreshHalaman() {
  revalidatePath("/resto");
  revalidatePath("/postingan");
  revalidatePath("/user/dashboard");
}

// Cek apakah user ini sudah like / favorit target tertentu
export async function getStatusUser(userId: number, target: Target) {
  const t = cekTarget(target);

  const [like, favorit] = await Promise.all([
    prisma.like.findFirst({ where: { userId, ...t } }),
    prisma.favorit.findFirst({ where: { userId, ...t } }),
  ]);

  return { liked: !!like, favorited: !!favorit };
}

// Klik pertama = like, klik kedua = batal like
export async function toggleLike(userId: number, target: Target) {
  const t = cekTarget(target);
  const sudahAda = await prisma.like.findFirst({ where: { userId, ...t } });

  if (sudahAda) {
    await prisma.like.delete({ where: { id: sudahAda.id } });
  } else {
    await prisma.like.create({ data: { userId, ...t } });
  }

  refreshHalaman();
  return !sudahAda; // true = sekarang disukai
}

// Klik pertama = favorit, klik kedua = batal favorit
export async function toggleFavorit(userId: number, target: Target) {
  const t = cekTarget(target);
  const sudahAda = await prisma.favorit.findFirst({ where: { userId, ...t } });

  if (sudahAda) {
    await prisma.favorit.delete({ where: { id: sudahAda.id } });
  } else {
    await prisma.favorit.create({ data: { userId, ...t } });
  }

  refreshHalaman();
  return !sudahAda;
}

// Ambil semua komentar untuk satu resto / postingan
export async function getKomentar(target: Target) {
  const t = cekTarget(target);

  return prisma.komentar.findMany({
    where: t,
    orderBy: { createdAt: "desc" },
    select: { id: true, namaUser: true, isi: true, createdAt: true },
  });
}

// Tambah komentar baru
export async function tambahKomentar(userId: number, isi: string, target: Target) {
  const t = cekTarget(target);
  const isiBersih = isi.trim();

  if (!isiBersih) throw new Error("Komentar tidak boleh kosong.");
  if (isiBersih.length > 500) throw new Error("Komentar maksimal 500 karakter.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User tidak ditemukan.");

  const komentar = await prisma.komentar.create({
    data: {
      isi: isiBersih,
      namaUser: user.name ?? user.email,
      userId,
      ...t,
    },
    select: { id: true, namaUser: true, isi: true, createdAt: true },
  });

  refreshHalaman();
  return komentar;
}

// Ringkasan untuk dashboard user: jumlah + aktivitas terbaru
export async function getRingkasanUser(userId: number) {
  const target = {
    restoran: { select: { nama: true } },
    konten: { select: { title: true } },
  };

  const [jumlahSuka, jumlahKomentar, jumlahFavorit, likes, komentar, favorit] =
    await Promise.all([
      prisma.like.count({ where: { userId } }),
      prisma.komentar.count({ where: { userId } }),
      prisma.favorit.count({ where: { userId } }),
      prisma.like.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: target,
      }),
      prisma.komentar.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: target,
      }),
      prisma.favorit.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: target,
      }),
    ]);

  // Gabungkan semua aktivitas, urutkan dari yang terbaru
  const aktivitas = [
    ...likes.map((l) => ({
      id: `suka-${l.id}`,
      jenis: "suka" as const,
      judul: l.restoran?.nama ?? l.konten?.title ?? "-",
      isi: "",
      createdAt: l.createdAt,
    })),
    ...komentar.map((k) => ({
      id: `komentar-${k.id}`,
      jenis: "komentar" as const,
      judul: k.restoran?.nama ?? k.konten?.title ?? "-",
      isi: k.isi,
      createdAt: k.createdAt,
    })),
    ...favorit.map((f) => ({
      id: `favorit-${f.id}`,
      jenis: "favorit" as const,
      judul: f.restoran?.nama ?? f.konten?.title ?? "-",
      isi: "",
      createdAt: f.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return { jumlahSuka, jumlahKomentar, jumlahFavorit, aktivitas };
}