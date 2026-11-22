"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { faqList } from "@/lib/faqData";

export async function kirimFeedbackFaq(faqId: number, membantu: boolean, alasan = "") {
  const faq = faqList.find((f) => f.id === faqId);
  if (!faq) return;

  await prisma.faqFeedback.create({
    data: {
      faqId,
      pertanyaan: faq.tanya,
      membantu,
      alasan: alasan.trim().slice(0, 500),
    },
  });
  revalidatePath("/admin/faq");
}

export async function hapusFeedbackFaq(id: number) {
  await prisma.faqFeedback.delete({ where: { id } });
  revalidatePath("/admin/faq");
}
