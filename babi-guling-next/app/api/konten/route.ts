import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Jenis = "galeri" | "postingan" | "resto";
type KategoriPostingan = "Promotions" | "Reccomendation" | "Informations" | "Other";


async function fileToDataUrl(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jenis = searchParams.get("jenis") as Jenis | null;
    const kategori = searchParams.get("kategori") as KategoriPostingan | null;

    const data = await prisma.konten.findMany({
      where: {
        ...(jenis ? { jenis } : {}),
        ...(kategori ? { kategori } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const jenisUrl = (searchParams.get("jenis") as Jenis) || "postingan";
    const contentType = req.headers.get("content-type") || "";

    let title = "";
    let description = "";
    let image = "";
    let jenis: Jenis = jenisUrl;
    let kategori: KategoriPostingan = "Informations";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      title = String(formData.get("title") || "");
      description = String(formData.get("description") || "");
      kategori = (formData.get("kategori") as KategoriPostingan) || "Informations";
      const imageFile = formData.get("imageFile") as File | null;
      if (imageFile && imageFile.size > 0) {
        image = await fileToDataUrl(imageFile);
      }
    } else {
      const body = await req.json();
      title = body.title || "";
      description = body.description || "";
      image = body.image || "";
      jenis = (body.jenis as Jenis) || jenisUrl;
      kategori = (body.kategori as KategoriPostingan) || "Informations";
    }

    if (!title || !description) {
      return NextResponse.json(
        { message: "Judul dan deskripsi wajib diisi" },
        { status: 400 }
      );
    }

    const baru = await prisma.konten.create({
      data: {
        title,
        description,
        image,
        jenis,
        kategori,
      },
    });

    return NextResponse.json(baru, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan data" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let id = 0;
    let title = "";
    let description = "";
    let image: string | undefined = undefined;
    let kategori: KategoriPostingan | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      id = Number(formData.get("id"));
      title = String(formData.get("title") || "");
      description = String(formData.get("description") || "");
      const kat = formData.get("kategori") as KategoriPostingan | null;
      if (kat) kategori = kat;

      const imageFile = formData.get("imageFile") as File | null;
      if (imageFile && imageFile.size > 0) {
        image = await fileToDataUrl(imageFile);
      }
    } else {
      const body = await req.json();
      id = Number(body.id);
      title = body.title;
      description = body.description;
      if (body.image !== undefined) image = body.image;
      if (body.kategori) kategori = body.kategori as KategoriPostingan;
    }

    if (!id) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const updated = await prisma.konten.update({
      where: { id },
      data: {
        title,
        description,
        ...(image !== undefined ? { image } : {}),
        ...(kategori !== undefined ? { kategori } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Gagal memperbarui data" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let id = Number(searchParams.get("id"));

    if (!id) {
      const body = await req.json();
      id = Number(body.id);
    }

    if (!id) {
      return NextResponse.json({ message: "ID wajib disertakan" }, { status: 400 });
    }

    await prisma.konten.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Gagal menghapus data" }, { status: 500 });
  }
}