import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const emailBersih = String(email).toLowerCase().trim();

  if (emailBersih === "admin@babiguling.com") {
    return NextResponse.json({ error: "Email tersebut tidak bisa digunakan." }, { status: 400 });
  }

  const sudahAda = await prisma.user.findUnique({ where: { email: emailBersih } });
  if (sudahAda) {
    return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email: emailBersih, password: hash, role: "USER" },
  });

  return NextResponse.json({ message: "Berhasil daftar" }, { status: 201 });
}