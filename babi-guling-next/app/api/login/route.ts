import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// memproses login pengguna
export async function POST(req: Request) {
  // mengambil email dan password dari request
  const { email, password } = await req.json();
  const emailBersih = String(email).toLowerCase().trim();

  // mencari pengguna berdasarkan email yang sudah dibersihkan
  const user = await prisma.user.findUnique({ where: { email: emailBersih } });

  // mengecek apakah pengguna ditemukan dan password sesuai
  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
  }

  // mengirim data pengguna jika login berhasil
  return NextResponse.json({
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
  });
}