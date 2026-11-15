import prisma from '@/lib/prisma';
import { likeRestoran } from '@/app/actions/resto';
import styles from './Resto.module.css';

export const instant = false;

export default async function RestoPage() {
  const restoranList = await prisma.restoran.findMany({
    include: { _count: { select: { komentar: true } } },
    orderBy: [
      { likesCount: 'desc' },
      { rating: 'desc' },
    ],
  });

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Rekomendasi Resto Babi Guling</h1>
        <p className={styles.subtitle}>Eksplorasi cita rasa autentik dari berbagai daerah di Bali.</p>
        
        <div className={styles.grid}>
          {restoranList.map((resto) => (
            <div key={resto.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.restoName}>{resto.nama}</h2>
                <span className={styles.ratingBadge}>★ {resto.rating.toFixed(1)}</span>
              </div>
              
              <div className={styles.location}>
                {resto.alamat}
              </div>
              
              <hr className={styles.divider} />
              
              <form className={styles.actions}>
                <button
                  formAction={async () => {
                    "use server";
                    await likeRestoran(resto.id);
                  }}
                  className={styles.likeBtn}
                >
                  {resto.likesCount} Suka
                </button>
                <button type="button" className={styles.commentBtn}>
                  {resto._count.komentar} Komentar
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}