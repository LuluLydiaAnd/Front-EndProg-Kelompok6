-- CreateTable
CREATE TABLE "FaqFeedback" (
    "id" SERIAL NOT NULL,
    "faqId" INTEGER NOT NULL,
    "pertanyaan" TEXT NOT NULL,
    "membantu" BOOLEAN NOT NULL,
    "alasan" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FaqFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FaqFeedback_faqId_idx" ON "FaqFeedback"("faqId");
