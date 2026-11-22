"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // menyimpan data input dan status pendaftaran
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // menjalankan proses pendaftaran saat form dikirim
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // mengirim data pendaftaran ke api register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      // menampilkan pesan jika pendaftaran gagal
      if (!res.ok) {
        setError(data.error);
        return;
      }

      // mengarahkan pengguna ke halaman login setelah berhasil daftar
      router.push("/login");
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      // mengakhiri status loading setelah proses selesai
      setLoading(false);
    }
  }

  return (
    <main className="container py-5 auth-page">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 auth-card">
            <h2 className="text-center mb-2">Register</h2>
            <p className="text-center text-muted mb-4">Buat akun baru</p>

            {/* form untuk memasukkan data akun baru */}
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Nama</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bx ${showPassword ? "bx-hide" : "bx-show"}`}></i>
                  </button>
                </div>
              </div>

              {/* menampilkan pesan error jika ada */}
              {error && <p className="text-danger">{error}</p>}

              <button className="btn btn-danger w-100" disabled={loading}>
                {loading ? "Mendaftar..." : "Daftar"}
              </button>
            </form>

            {/* menyediakan link ke halaman login */}
            <p className="text-center mt-3 mb-0">
              Sudah punya akun? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
