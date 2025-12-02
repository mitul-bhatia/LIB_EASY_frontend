"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SigninPage() {
  const { signin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signin(form);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>
        <p className="text-sm text-center text-gray-600 mb-6">Sign in to your library account</p>

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
