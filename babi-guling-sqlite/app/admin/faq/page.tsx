import { prisma } from "@/lib/prisma";
import { faqList } from "@/lib/faqData";
import FaqFeedbackClient from "./FaqFeedbackClient";

export const instant = false;

export default async function AdminFaqPage() {
  const feedbackList = await prisma.faqFeedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  // rekap jumlah "Ya" dan "Belum" untuk tiap pertanyaan
  const rekap = faqList.map((f) => {
    const milikFaq = feedbackList.filter((fb) => fb.faqId === f.id);
    const ya = milikFaq.filter((fb) => fb.membantu).length;
    const belum = milikFaq.length - ya;
    return { id: f.id, tanya: f.tanya, kategori: f.kategori, ya, belum, total: milikFaq.length };
  });

  return (
    <FaqFeedbackClient
      rekap={rekap}
      feedbackList={feedbackList.map((fb) => ({
        id: fb.id,
        faqId: fb.faqId,
        pertanyaan: fb.pertanyaan,
        membantu: fb.membantu,
        alasan: fb.alasan,
        createdAt: fb.createdAt.toISOString(),
      }))}
    />
  );
}
