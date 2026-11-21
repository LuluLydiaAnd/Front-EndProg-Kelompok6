import { prisma } from "@/lib/prisma";
import RestoClient from "./RestoClient";

export const instant = false;

export default async function AdminRestoPage() {
  const restoranList = await prisma.restoran.findMany({
    orderBy: { id: "desc" },
    include: { _count: { select: { likes: true, komentar: true } } },
  });

  return <RestoClient restoranList={restoranList} />;
}