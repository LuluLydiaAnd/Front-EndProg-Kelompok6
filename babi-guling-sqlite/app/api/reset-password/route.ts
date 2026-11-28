
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    // mencari token reset password
    const resetData = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetData) {
      return NextResponse.json(
        { error: "Link reset password tidak valid." },
        { status: 400 }
      );
    }

    // mengecek masa berlaku token
    if (resetData.expiresAt < new Date()) {
      await prisma.passwordReset.delete({
        where: { token },
      });

      return NextResponse.json(
        { error: "Link reset password sudah kedaluwarsa. Silakan minta link baru." },
        { status: 400 }
      );
    }

    // mencari akun berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: resetData.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Akun tidak ditemukan." },
        { status: 404 }
      );
    }

    // mengenkripsi password baru
    const hashedPassword = await bcrypt.hash(password, 10);

    // memperbarui password dan menghapus token
    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetData.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.delete({
        where: { token },
      }),
    ]);

    return NextResponse.json({
      message: "Password berhasil diganti. Silakan login kembali.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengganti password." },
      { status: 500 }
    );
  }
}
