import AdminCrud from "@/components/AdminCRUD";

export default function KelolaPostinganPage() {
  return (
    <AdminCrud
      storageKey="babi-guling-postingan"
      title="Kelola Postingan"
      description="Kelola artikel dan informasi kuliner Bali."
      titleLabel="Judul Artikel"
      descriptionLabel="Isi Artikel"
    />
  );
}
