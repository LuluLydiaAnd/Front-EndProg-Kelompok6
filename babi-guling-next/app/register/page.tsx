"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const accounts = JSON.parse(
      localStorage.getItem("accounts") || "[]"
    );

    if (email.toLowerCase() === "admin@babiguling.com") {
      setError("Email tersebut tidak bisa digunakan.");
      return;
    }

    if (
      accounts.some(
        (account: { email: string }) =>
          account.email.toLowerCase() === email.toLowerCase()
      )
    ) {
      setError("Email sudah terdaftar.");
      return;
    }

    accounts.push({ name, email, password });

    localStorage.setItem("accounts", JSON.stringify(accounts));

    router.push("/login");
  }

  return (
    <main className="container py-5 auth-page">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 auth-card">
            <h2 className="text-center mb-2">Register</h2>
            <p className="text-center text-muted mb-4">
              Buat akun baru
            </p>

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
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <p className="text-danger">{error}</p>
              )}

              <button className="btn btn-danger w-100">
                Daftar
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Sudah punya akun?{" "}
              <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
