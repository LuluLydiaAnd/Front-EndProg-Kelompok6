
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";


const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "postingan"
);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// Menyimpan foto ke folder uploads
async function uploadFoto(file: File): Promise<string> {
  const extension = ALLOWED_TYPES[file.type];

  if (!extension) {
    throw new Error("Format foto harus JPG, PNG, atau WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Ukuran foto maksimal 5 MB.");
  }

  if (file.size === 0) {
    throw new Error("File foto kosong.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/postingan/${fileName}`;
}

// Menghapus foto lama dari folder uploads
async function hapusFoto(image: string) {
  if (!image.startsWith("/uploads/postingan/")) {
    return;
  }

  const fileName = path.basename(image);
  const filePath = path.join(UPLOAD_DIR, fileName);

  try {
    await unlink(filePath);
  } catch (error) {
    console.error("Gagal menghapus file foto:", error);
  }
}

// GET: Mengambil semua postingan
export async function GET() {
  try {
    const postingan = await prisma.konten.findMany({
      where: {
        jenis: "postingan",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(postingan);
  } catch (error) {
    console.error("Gagal mengambil postingan:", error);

    return NextResponse.json(
      { message: "Gagal mengambil data postingan" },
      { status: 500 }
    );
  }
}

// POST: Menambahkan postingan baru
export async function POST(request: Request) {
  let uploadedImage = "";

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("imageFile");

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      !title.trim() ||
      !description.trim()
    ) {
      return NextResponse.json(
        { message: "Judul dan isi postingan wajib diisi" },
        { status: 400 }
      );
    }

    if (imageFile && typeof imageFile !== "string") {
      uploadedImage = await uploadFoto(imageFile);
    }

    const postingan = await prisma.konten.create({
      data: {
        jenis: "postingan",
        title: title.trim(),
        description: description.trim(),
        image: uploadedImage,
      },
    });

    return NextResponse.json(postingan, { status: 201 });
  } catch (error) {
    if (uploadedImage) {
      await hapusFoto(uploadedImage);
    }

    console.error("Gagal menambahkan postingan:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan postingan",
      },
      { status: 500 }
    );
  }
}

// PUT: Mengedit postingan
export async function PUT(request: Request) {
  let uploadedImage = "";

  try {
    const formData = await request.formData();

    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("imageFile");

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      !title.trim() ||
      !description.trim()
    ) {
      return NextResponse.json(
        { message: "Data postingan tidak lengkap atau tidak valid" },
        { status: 400 }
      );
    }

    const existingPost = await prisma.konten.findFirst({
      where: {
        id,
        jenis: "postingan",
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { message: "Postingan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika admin memilih foto baru
    if (imageFile && typeof imageFile !== "string") {
      uploadedImage = await uploadFoto(imageFile);
    }

    const postingan = await prisma.konten.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        // Jika tidak ada foto baru, gunakan foto lama
        image: uploadedImage || existingPost.image,
      },
    });

    // Hapus foto lama setelah database berhasil diperbarui
    if (uploadedImage && existingPost.image) {
      await hapusFoto(existingPost.image);
    }

    return NextResponse.json(postingan);
  } catch (error) {
    if (uploadedImage) {
      await hapusFoto(uploadedImage);
    }

    console.error("Gagal mengedit postingan:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengedit postingan",
      },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus postingan
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID postingan tidak valid" },
        { status: 400 }
      );
    }

    const postingan = await prisma.konten.findFirst({
      where: {
        id,
        jenis: "postingan",
      },
    });

    if (!postingan) {
      return NextResponse.json(
        { message: "Postingan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.konten.delete({
      where: {
        id,
      },
    });

    if (postingan.image) {
      await hapusFoto(postingan.image);
    }

    return NextResponse.json({
      message: "Postingan berhasil dihapus",
    });
  } catch (error) {
    console.error("Gagal menghapus postingan:", error);

    return NextResponse.json(
      { message: "Gagal menghapus postingan" },
      { status: 500 }
    );
  }
}
