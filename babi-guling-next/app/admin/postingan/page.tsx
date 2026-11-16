import AdminCrud from "@/components/AdminCrud";

export default function AdminPostinganPage() {
  return (
    <AdminCrud
      storageKey="postingan"
      apiEndpoint="/api/konten?jenis=postingan"
      title="Kelola Postingan"
      description="Tambah, perbarui, dan kelompokkan artikel atau informasi babi guling sesuai kategori."
      titleLabel="Judul Postingan"
      descriptionLabel="Isi Postingan"
      imageLabel="Gambar Postingan"
      showImage={true}
      uploadImage={true}
      showCategory={true}
    />
  );
}