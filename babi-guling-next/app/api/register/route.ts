import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// memproses pendaftaran akun baru
const ADMIN_EMAIL = "admin@babiguling.com";

export async function POST(req: Request) {
  // mengambil nama, email, dan password dari request
  const { name, email, password } = await req.json();

  // memastikan email dan password sudah diisi
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  // membersihkan email agar formatnya konsisten
  const emailBersih = String(email).toLowerCase().trim();

  // mencegah pengguna memakai email khusus admin
 if (emailBersih === ADMIN_EMAIL)  {
    return NextResponse.json({ error: "Email tersebut tidak bisa digunakan." }, { status: 400 });
  }

  // mengecek apakah email sudah terdaftar
  const sudahAda = await prisma.user.findUnique({ where: { email: emailBersih } });
  if (sudahAda) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
  }

  // mengenkripsi password sebelum disimpan ke database
  const hash = await bcrypt.hash(password, 10);

  // menyimpan akun baru dengan role user
  await prisma.user.create({
    data: { name, email: emailBersih, password: hash, role: "USER" },
  });

  // mengirim respons jika pendaftaran berhasil
  return NextResponse.json({ message: "Berhasil daftar" }, { status: 201 });
}
