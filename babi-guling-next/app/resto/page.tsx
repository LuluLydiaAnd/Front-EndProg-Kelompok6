import { prisma } from "@/lib/prisma";
import InteractionButtons from "@/components/InteractionButtons";
import styles from "./Resto.module.css";

export const instant = false;

export default async function RestoPage() {
  // Jumlah like & komentar dihitung dari akun yang benar-benar berinteraksi
  const restoranList = await prisma.restoran.findMany({
    include: { _count: { select: { komentar: true, likes: true } } },
    orderBy: [{ likes: { _count: "desc" } }, { rating: "desc" }],
  });

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Rekomendasi Resto Babi Guling</h1>
        <p className={styles.subtitle}>
          Eksplorasi cita rasa autentik dari berbagai daerah di Bali.
        </p>

        <div className={styles.grid}>
          {restoranList.map((resto) => (
            <div key={resto.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.restoName}>{resto.nama}</h2>
                <span className={styles.ratingBadge}>★ {resto.rating.toFixed(1)}</span>
              </div>

              <div className={styles.location}>{resto.alamat}</div>

              <hr className={styles.divider} />

              {/* Suka, Komentar, Favorit: wajib login, 1 akun = 1 like */}
              <InteractionButtons
                target={{ restoranId: resto.id }}
                likeCount={resto._count.likes}
                commentCount={resto._count.komentar}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}