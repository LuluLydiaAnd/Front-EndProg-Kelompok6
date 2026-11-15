"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // menyimpan data input dan status login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // menjalankan proses login saat form dikirim
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    // mengecek login admin dengan akun khusus
    if (email === "admin@babiguling.com" && password === "admin123") {
      sessionStorage.setItem(
        "user",
        JSON.stringify({ name: "Admin", email, role: "admin" })
      );
      router.push("/admin");
      return;
    }

    setLoading(true);
    try {
      // mengirim email dan password ke api login
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // menampilkan pesan jika login gagal
      if (!res.ok) {
        setError(data.error);
        return;
      }

      // menyimpan data pengguna dan mengarahkan sesuai role
      sessionStorage.setItem("user", JSON.stringify(data));
      router.push(data.role === "admin" ? "/admin" : "/user/dashboard");
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
            <h2 className="text-center mb-2">Login</h2>
            <p className="text-center text-muted mb-4">
              Masuk ke akun Babi Guling
            </p>

            {/* form untuk memasukkan email dan password */}
            <form onSubmit={handleLogin}>
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
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* menampilkan pesan error jika ada */}
              {error && <p className="text-danger">{error}</p>}

              <button className="btn btn-danger w-100" disabled={loading}>
                {loading ? "Memproses..." : "Login"}
              </button>
            </form>

            {/* menyediakan link ke halaman pendaftaran */}
            <p className="text-center mt-3 mb-0">
              Belum punya akun?{" "}
              <Link href="/register">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}