import { prisma } from "@/lib/prisma";
import RestoClient from "./RestoClient";

// nampilin halaman admin restoran
export const instant = false;

export default async function AdminRestoPage() {

  // buat ambil semua data restoran, urut dari id yg terbesar
  const restoranList = await prisma.restoran.findMany({
    orderBy: { id: "desc" },
    include: { _count: { select: { likes: true, komentar: true } } },
  });

  // ngirim data restoran ke komponen RestoClient
  return <RestoClient restoranList={restoranList} />;
}