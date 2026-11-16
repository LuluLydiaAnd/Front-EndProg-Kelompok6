"use client";

import { useEffect, useState } from "react";
import { getProfilUser } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type Profil = {
  name: string | null;
  email: string;
  createdAt: Date;
  _count: { likes: number; komentar: number; favorit: number };
};

export default function ProfilPage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [profil, setProfil] = useState<Profil | null>(null);

  useEffect(() => {
    if (!userId) return;
    let aktif = true;

    getProfilUser(userId).then((data) => {
      if (aktif) setProfil(data);
    });

    return () => {
      aktif = false;
    };
  }, [userId]);

  if (!user) return null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Akun kamu</p>
          <h1 className={styles.title}>Profil Saya</h1>
          <p className={styles.subtitle}>Informasi akun yang terdaftar.</p>
        </div>
      </header>

      <section className={styles.panel}>
        {!profil ? (
          <div className={styles.empty}>
            <i className="bx bx-user"></i>
            <p>Memuat profil...</p>
          </div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              <i className="bx bx-user"></i>
            </div>

            <div className={styles.profileInfo}>
              <h2>{profil.name}</h2>
              <span>@{profil.email.split("@")[0]}</span>

              <dl className={styles.profileList}>
                <div>
                  <dt>Email</dt>
                  <dd>{profil.email}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Member</dd>
                </div>
                <div>
                  <dt>Bergabung</dt>
                  <dd>
                    {new Date(profil.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt>Aktivitas</dt>
                  <dd>
                    {profil._count.likes} suka · {profil._count.komentar} komentar ·{" "}
                    {profil._count.favorit} favorit
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </section>
    </>
  );
}