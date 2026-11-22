import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

// lokasi penyimpanan foto postingan
const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "postingan"
);

// batas ukuran foto maksimal 5 mb
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// daftar format foto yang diperbolehkan
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

// daftar kategori yang bisa dipilih untuk postingan
const daftarKategori = [
  "Promotions",
  "Reccomendation",
  "Informations",
  "Other",
] as const;

type KategoriPostingan = (typeof daftarKategori)[number];

// mengecek apakah kategori sesuai dengan daftar yang tersedia
function validasiKategori(
  kategori: string
): kategori is KategoriPostingan {
  return daftarKategori.includes(kategori as KategoriPostingan);
}

// memvalidasi dan menyimpan foto ke folder upload
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

  // membuat folder jika belum tersedia
  await mkdir(UPLOAD_DIR, { recursive: true });

  // membuat nama file unik agar tidak bentrok
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/postingan/${fileName}`;
}

// menghapus foto dari folder upload
async function hapusFoto(image: string) {
  // memastikan yang dihapus hanya foto dari folder postingan
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

// GET: mengambil semua data postingan
export async function GET() {
  try {
    const postingan = await prisma.konten.findMany({
      where: {
        jenis: "postingan",
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: { select: { likes: true, komentar: true } },
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

// POST: menambahkan postingan baru
export async function POST(request: Request) {
  let uploadedImage = "";

  try {
    // mengambil data yang dikirim melalui form
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const kategoriForm = formData.get("kategori");
    const imageFile = formData.get("imageFile");

    // memastikan judul dan isi postingan sudah diisi
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

    // menggunakan kategori informations jika kategori tidak dipilih
    let kategori: KategoriPostingan = "Informations";

    if (kategoriForm !== null) {
      if (
        typeof kategoriForm !== "string" ||
        !validasiKategori(kategoriForm)
      ) {
        return NextResponse.json(
          { message: "Kategori postingan tidak valid" },
          { status: 400 }
        );
      }

      kategori = kategoriForm;
    }

    // menyimpan foto jika pengguna mengunggah file
    if (imageFile && typeof imageFile !== "string") {
      uploadedImage = await uploadFoto(imageFile);
    }

    // menyimpan data postingan ke database
    const postingan = await prisma.konten.create({
      data: {
        jenis: "postingan",
        title: title.trim(),
        description: description.trim(),
        kategori,
        image: uploadedImage,
      },
    });

    return NextResponse.json(postingan, { status: 201 });
  } catch (error) {
    // menghapus foto jika proses penambahan postingan gagal
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

// PUT: mengedit postingan yang sudah ada
export async function PUT(request: Request) {
  let uploadedImage = "";

  try {
    // mengambil data postingan yang akan diedit
    const formData = await request.formData();

    const id = Number(formData.get("id"));
    const title = formData.get("title");
    const description = formData.get("description");
    const kategoriForm = formData.get("kategori");
    const imageFile = formData.get("imageFile");

    // memvalidasi id, judul, dan isi postingan
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

    // mencari postingan yang akan diedit
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

    // mempertahankan kategori lama jika kategori tidak dikirim
    let kategori: KategoriPostingan = existingPost.kategori;

    if (kategoriForm !== null) {
      if (
        typeof kategoriForm !== "string" ||
        !validasiKategori(kategoriForm)
      ) {
        return NextResponse.json(
          { message: "Kategori postingan tidak valid" },
          { status: 400 }
        );
      }

      kategori = kategoriForm;
    }

    // mengunggah foto baru jika ada foto yang dipilih
    if (imageFile && typeof imageFile !== "string") {
      uploadedImage = await uploadFoto(imageFile);
    }

    // memperbarui data postingan di database
    const postingan = await prisma.konten.update({
      where: {
        id,
      },
      data: {
        title: title.trim(),
        description: description.trim(),
        kategori,
        image: uploadedImage || existingPost.image,
      },
    });

    // menghapus foto lama jika berhasil diganti dengan foto baru
    if (uploadedImage && existingPost.image) {
      await hapusFoto(existingPost.image);
    }

    return NextResponse.json(postingan);
  } catch (error) {
    // menghapus foto baru jika proses edit gagal
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

// DELETE: menghapus postingan berdasarkan id
export async function DELETE(request: Request) {
  try {
    // mengambil id postingan dari request
    const body = await request.json();
    const id = Number(body.id);

    // memastikan id yang dikirim valid
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { message: "ID postingan tidak valid" },
        { status: 400 }
      );
    }

    // mencari postingan sebelum dihapus
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

    // menghapus data postingan dari database
    await prisma.konten.delete({
      where: {
        id,
      },
    });

    // menghapus foto yang terkait dengan postingan
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