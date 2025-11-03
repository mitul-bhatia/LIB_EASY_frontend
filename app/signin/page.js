// "use client";
// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function SigninPage() {
//   const { signin } = useAuth();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await signin(form);
//     } catch (err) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-80">
//         <h2 className="text-xl font-semibold mb-4">Sign in</h2>
//         <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full p-2 mb-2 border rounded" />
//         <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full p-2 mb-3 border rounded" />
//         {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
//         <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading ? "Signing..." : "Sign in"}</button>
//       </form>
//     </div>
//   );
// }
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
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-3"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <p className="text-sm text-center text-gray-500">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
