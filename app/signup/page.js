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
  const [userType, setUserType] = useState("Student");
  const [form, setForm] = useState({
    userFullName: "",
    admissionId: "",
    employeeId: "",
    mobileNumber: "",
    email: "",
    password: "",
    isAdmin: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        userType,
        userFullName: form.userFullName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
        isAdmin: form.isAdmin,
      };

      if (userType === "Student") {
        payload.admissionId = form.admissionId;
      } else {
        payload.employeeId = form.employeeId;
      }

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
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-3"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        {/* User Type Selection */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setUserType("Student")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              userType === "Student"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setUserType("Staff")}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              userType === "Staff"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Staff
          </button>
        </div>

        <input
          placeholder="Full Name"
          value={form.userFullName}
          onChange={(e) => setForm({ ...form, userFullName: e.target.value })}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />

        {userType === "Student" ? (
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

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.isAdmin}
            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Register as Admin</span>
        </label>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Error:</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          disabled={loading}
          className={`w-full ${
            userType === "Student" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded-lg font-medium transition`}
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
