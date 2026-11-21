import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@babiguling.com";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 }
    );
  }

  const cleanEmail = String(email).toLowerCase().trim();

  if (cleanEmail === ADMIN_EMAIL) {
    return NextResponse.json(
      { error: "Email tersebut tidak bisa digunakan." },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email sudah terdaftar." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: "USER",
    },
  });

  return NextResponse.json({ message: "Registrasi berhasil." }, { status: 201 });
}
