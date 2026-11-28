"use client";

import { useEffect, useState } from "react";
import { getUserProfile } from "@/app/actions/user";
import { useSessionUser } from "@/lib/useSessionUser";
import styles from "../user.module.css";

type Profile = {
  name: string | null;
  email: string;
  createdAt: Date;
  _count: { likes: number; komentar: number; favorit: number };
};

export default function UserProfilePage() {
  const user = useSessionUser();
  const userId = user?.id;
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUserProfile(userId).then((data) => {
      if (active) setProfile(data);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  if (!user) return null;

  return (
    <>
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Akun</p>
          <h1 className={styles.title}>Profil Saya</h1>
          <p className={styles.subtitle}>Informasi akun yang terdaftar.</p>
        </div>
      </header>

      <section className={styles.panel}>
        {!profile ? (
          <div className={styles.empty}>
            <i className="bx bx-user"></i>
            <p>Memuat...</p>
          </div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileAvatar}>
              <i className="bx bx-user"></i>
            </div>

            <div className={styles.profileInfo}>
              <h2>{profile.name}</h2>
              <span>@{profile.email.split("@")[0]}</span>

              <dl className={styles.profileList}>
                <div>
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>Member</dd>
                </div>
                <div>
                  <dt>Bergabung</dt>
                  <dd>
                    {new Date(profile.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt>Aktivitas</dt>
                  <dd>
                    {profile._count.likes} suka, {profile._count.komentar} komentar,{" "}
                    {profile._count.favorit} favorit
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
