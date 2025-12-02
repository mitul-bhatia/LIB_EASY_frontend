"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({
    userFullName: "",
    memberId: "",
    mobileNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        userFullName: form.userFullName,
        memberId: form.memberId || undefined,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
        isAdmin: isAdmin,
      };

      await signup(payload);
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 py-8">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
        <p className="text-sm text-center text-gray-600 mb-4">Join our library community</p>

        {/* Role Selection Toggle */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              !isAdmin
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              isAdmin
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Admin
          </button>
        </div>

        <input
          placeholder="Full Name"
          value={form.userFullName}
          onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          placeholder="Member ID (Optional)"
          value={form.memberId}
          onChange={(e) => setForm({ ...form, memberId: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          placeholder="Password (min 6 characters)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
          minLength={6}
        />

        <input
          placeholder="Mobile Number"
          type="tel"
          value={form.mobileNumber}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Error:</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          disabled={loading}
          className={`w-full ${
            isAdmin ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded-lg font-medium transition`}
        >
          {loading ? "Creating..." : `Sign Up as ${isAdmin ? "Admin" : "Student"}`}
        </button>

        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
