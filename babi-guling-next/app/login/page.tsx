"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      email === "admin@babiguling.com" &&
      password === "admin123"
    ) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: "Admin",
          email,
          role: "admin",
        })
      );

      router.push("/admin");
      return;
    }

    const accounts = JSON.parse(
      localStorage.getItem("accounts") || "[]"
    );

    const account = accounts.find(
      (item: { email: string; password: string }) =>
        item.email === email && item.password === password
    );

    if (account) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          name: account.name,
          email: account.email,
          role: "user",
        })
      );

      router.push("/");
    } else {
      setError("Email atau password salah.");
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

              {error && (
                <p className="text-danger">{error}</p>
              )}

              <button className="btn btn-danger w-100">
                Login
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Belum punya akun?{" "}
              <Link href="/register">Daftar</Link>
            </p>

            <hr />

            <small className="text-muted">
              Demo admin: admin@babiguling.com
              <br />
              Password: admin123
            </small>
          </div>
        </div>
      </div>
    </main>
  );
}
