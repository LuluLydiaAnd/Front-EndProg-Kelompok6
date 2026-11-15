import AdminCrud from "@/components/AdminCrud";

export default function KelolaPostinganPage() {
  return (
    <AdminCrud
      storageKey="babi-guling-postingan"
      apiEndpoint="/api/konten"
      title="Kelola Postingan"
      description="Kelola artikel dan informasi kuliner Bali."
      titleLabel="Judul Artikel"
      descriptionLabel="Isi Artikel"
      showImage={true}
      uploadImage={true}
      imageLabel="Foto Postingan"
    />
  );
}