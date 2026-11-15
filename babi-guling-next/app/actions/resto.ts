'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function tambahRestoran(nama: string, alamat: string) {
  await prisma.restoran.create({
    data: {
      nama,
      alamat,
      deskripsi: "Sajian babi guling autentik khas Bali.",
      rating: 0,
      likesCount: 0,
    },
  });
  revalidatePath('/admin/resto');
  revalidatePath('/resto');
}

export async function updateRestoran(id: number, nama: string, alamat: string) {
  await prisma.restoran.update({
    where: { id },
    data: { nama, alamat },
  });
  revalidatePath('/admin/resto');
  revalidatePath('/resto');
}

export async function hapusRestoran(id: number) {
  await prisma.restoran.delete({
    where: { id },
  });
  revalidatePath('/admin/resto');
  revalidatePath('/resto');
}
export async function likeRestoran(id: number) {
  try {
    await prisma.restoran.update({
      where: { id },
      data: {
        likesCount: { increment: 1 }
      }
    });
    revalidatePath('/resto');
    revalidatePath('/admin/resto');
  } catch (error) {
    console.error("Gagal menyukai restoran:", error);
  }
}