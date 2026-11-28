import AdminCrud from "@/components/AdminCrud";

// nampilin halaman admin untuk mengelola postingan artikel
export default function KelolaPostinganPage() {
  return (
    <AdminCrud
      storageKey="babi-guling-postingan"
      apiEndpoint="/api/konten"
      title="Kelola Postingan"
      description="Kelola artikel dan informasi kuliner Bali."
      titleLabel="Judul Postingan"
      descriptionLabel="Isi Postingan"
      showImage={true}
      uploadImage={true}
      imageLabel="Foto Postingan"
      showCategory={true}
    />
  );
}
