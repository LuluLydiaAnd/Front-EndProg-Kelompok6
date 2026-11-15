import AdminCrud from "@/components/AdminCrud";

// nampilin halaman admin untuk mengelola galeri foto
export default function KelolaGaleriPage() {
  return (
    <AdminCrud
      storageKey="babi-guling-galeri"
      title="Kelola Galeri"
      description="Tambah dan atur foto kuliner Bali."
      titleLabel="Nama Foto"
      descriptionLabel="Deskripsi Foto"
      imageLabel="URL Foto"
      showImage
    />
  );
}
