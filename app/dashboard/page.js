"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
      return;
    }
    // fetch books if backend exposes /api/books
    api.get("/books")
      .then(r => setBooks(r.data || []))
      .catch(() => setBooks([]));
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name || user.email}</h1>
        <p className="mb-6">This is your user dashboard (dark mode).</p>

        <section>
          <h2 className="text-xl font-semibold mb-3">Available books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {books.length === 0 ? (
              <div className="text-slate-300">No books to display (or backend not implemented yet)</div>
            ) : (
              books.map(b => (
                <div key={b.id} className="bg-slate-800 p-4 rounded">
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="text-sm text-slate-400">{b.author}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
