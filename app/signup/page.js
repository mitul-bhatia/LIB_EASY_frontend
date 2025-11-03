// "use client";
// import { useState } from "react";
// import { useAuth } from "@/context/AuthContext";

// export default function SignupPage() {
//   const { signup } = useAuth();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);
//     try {
//       await signup(form);
//     } catch (err) {
//       setError(err.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50">
//       <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-80">
//         <h2 className="text-xl font-semibold mb-4">Create account</h2>
//         <input placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full p-2 mb-2 border rounded" />
//         <input placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="w-full p-2 mb-2 border rounded" />
//         <input placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} className="w-full p-2 mb-3 border rounded" />
//         {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
//         <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">{loading ? "Creating..." : "Sign up"}</button>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup(form);
    } catch (err) {
      setError(err.message || "Signup failed");
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
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
        >
          {loading ? "Creating..." : "Sign Up"}
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
