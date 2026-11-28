"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// buat nambahin data restoran baru ke database
export async function tambahRestoran(nama: string, alamat: string) {
  await prisma.restoran.create({
    data: {
      nama,
      alamat,
      deskripsi: "Sajian babi guling autentik khas Bali.",
      rating: 0,
    },
  });

  // refresh halaman admin dan user supaya data terbaru ditampilin
  revalidatePath("/admin/resto");
  revalidatePath("/resto");
}

// buat ngubah nama dan alamat restoran berdasarkan id
export async function updateRestoran(id: number, nama: string, alamat: string) {
  await prisma.restoran.update({
    where: { id },
    data: { nama, alamat },
  });

  // refresh halaman setelah data restoran diubah
  revalidatePath("/admin/resto");
  revalidatePath("/resto");
}

// buat hapus restoran yang dipilih berdasarkan id
export async function hapusRestoran(id: number) {
  await prisma.restoran.delete({
    where: { id },
  });

  // refresh halaman supaya perubahan data langsung keliatan
  revalidatePath("/admin/resto");
  revalidatePath("/resto");
}

// buat nambahin jumlah likes restoran sebanyak satu
export async function likeRestoran(id: number) {
  try {
    await prisma.restoran.update({
      where: { id },
      data: {
        likesCount: { increment: 1 },
      },
    });

    // refresh halaman supaya jumlah likes terbaru ditampilin
    revalidatePath("/resto");
    revalidatePath("/admin/resto");
  } catch (error) {
    // nampilin error di terminal kalau proses like gagal
    console.error("Gagal menyukai restoran:", error);
  }
}
