import AdminCrud from "@/components/AdminCRUD";

export default function KelolaRestoPage() {
  return (
    <AdminCrud
      storageKey="babi-guling-resto"
      title="Kelola Resto"
      description="Tambah dan atur rekomendasi restoran."
      titleLabel="Nama Restoran"
      descriptionLabel="Deskripsi Restoran"
      imageLabel="URL Foto Restoran"
      showImage
    />
  );
}
