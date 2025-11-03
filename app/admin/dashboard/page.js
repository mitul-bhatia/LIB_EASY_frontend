"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", author: "", isbn: "", categories: "", coverURL: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) router.push("/signin");
    if (user && user.role !== "ADMIN") router.push("/dashboard"); // non-admins redirected
  }, [user]);

  const addBook = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      // categories is an array; split by comma
      const payload = { ...form, categories: form.categories.split(",").map(s => s.trim()) };
      await api.post("/books/add", payload); // will fail if backend not implemented yet, but this is correct endpoint
      setMsg("Book added (if backend is implemented)");
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to add book");
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin — Add Book</h1>
        <form onSubmit={addBook} className="space-y-3">
          <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="w-full border p-2 rounded"/>
          <input value={form.author} onChange={e=>setForm({...form, author:e.target.value})} placeholder="Author" className="w-full border p-2 rounded"/>
          <input value={form.isbn} onChange={e=>setForm({...form, isbn:e.target.value})} placeholder="ISBN" className="w-full border p-2 rounded"/>
          <input value={form.categories} onChange={e=>setForm({...form, categories:e.target.value})} placeholder="Categories (comma separated)" className="w-full border p-2 rounded"/>
          <input value={form.coverURL} onChange={e=>setForm({...form, coverURL:e.target.value})} placeholder="Cover URL" className="w-full border p-2 rounded"/>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Add Book</button>
        </form>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </div>
  );
}
