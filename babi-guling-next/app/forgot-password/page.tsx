"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // menjalankan proses pengiriman link reset password
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengirim permintaan.");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-5 auth-page">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 auth-card">
            <h2 className="text-center mb-2">Lupa Password?</h2>

            <p className="text-center text-muted mb-4">
              Masukkan email yang terdaftar. Kami akan mengirimkan link untuk
              mengatur ulang password kamu.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu"
                  required
                />
              </div>

              {message && (
                <p className="text-success">{message}</p>
              )}

              {error && (
                <p className="text-danger">{error}</p>
              )}

              <button
                type="submit"
                className="btn btn-danger w-100"
                disabled={loading}
              >
                {loading ? "Mengirim..." : "Kirim Link Reset Password"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              <Link href="/login">Kembali ke Login</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}