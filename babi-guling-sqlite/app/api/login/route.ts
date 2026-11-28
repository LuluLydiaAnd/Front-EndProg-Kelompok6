import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// memproses login pengguna
export async function POST(req: Request) {
  // mengambil email dan password dari request
  const { email, password } = await req.json();
  const cleanEmail = String(email).toLowerCase().trim();

  // mencari pengguna berdasarkan email yang sudah dibersihkan
  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  // mengecek apakah pengguna ditemukan
  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  // mengecek apakah password sesuai
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  // mengirim data pengguna jika login berhasil
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
  });
}