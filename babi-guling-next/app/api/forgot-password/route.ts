
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const cleanEmail = String(email || "").toLowerCase().trim();

    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email wajib diisi." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Pesan dibuat sama agar email yang terdaftar tidak mudah ditebak
    if (!user || !user.password) {
      return NextResponse.json({
        message: "Jika email terdaftar, link reset password akan dikirim.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.passwordReset.deleteMany({
      where: { email: cleanEmail },
    });

    await prisma.passwordReset.create({
      data: {
        email: cleanEmail,
        token,
        expiresAt,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: cleanEmail,
        subject: "Reset Password - Babi Guling",
        html: `
            <h2>Reset Password</h2>
            <p>Kami menerima permintaan untuk mengganti password akun kamu.</p>
            <p>Link ini hanya berlaku selama 15 menit.</p>
            <a href="${resetLink}">Reset Password</a>
            <p>Jika kamu tidak meminta reset password, abaikan email ini.</p>
        `,
    });

    console.log("Email terkirim:", {
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
        messageId: info.messageId,
    });

    return NextResponse.json({
      message: "Jika email terdaftar, link reset password akan dikirim.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { error: "Gagal mengirim email reset password." },
      { status: 500 }
    );
  }
}
