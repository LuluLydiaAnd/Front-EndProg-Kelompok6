import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const cleanEmail = String(email).toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: cleanEmail },
  });

  if (!user || !user.password) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { error: "Email atau password salah." },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase(),
  });
}
