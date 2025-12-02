"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SigninPage() {
  const { signin } = useAuth();
  const [isStudent, setIsStudent] = useState(true);
  const [form, setForm] = useState({ admissionId: "", employeeId: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = isStudent 
        ? { admissionId: form.admissionId, password: form.password }
        : { employeeId: form.employeeId, password: form.password };
      await signin(payload);
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

        {/* Toggle between Student and Staff */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <span className={`text-sm font-medium ${isStudent ? 'text-green-600' : 'text-gray-400'}`}>
            Student
          </span>
          <button
            type="button"
            onClick={() => setIsStudent(!isStudent)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isStudent ? 'bg-green-600' : 'bg-blue-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isStudent ? 'translate-x-1' : 'translate-x-6'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${!isStudent ? 'text-blue-600' : 'text-gray-400'}`}>
            Staff
          </span>
        </div>

        {isStudent ? (
          <input
            placeholder="Admission ID"
            value={form.admissionId}
            onChange={(e) => setForm({ ...form, admissionId: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            required
          />
        ) : (
          <input
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        )}

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
          required
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className={`w-full ${isStudent ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded-lg font-medium transition`}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <Link href="/signup" className={`${isStudent ? 'text-green-600' : 'text-blue-600'} hover:underline`}>
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
