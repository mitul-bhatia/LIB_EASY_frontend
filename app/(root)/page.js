"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ books: 0, members: 0, loans: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  async function loadData() {
    try {
      const [books, members, transactions] = await Promise.all([
        api.get("/books/allbooks"),
        api.get("/users/allmembers"),
        api.get("/transactions/all-transactions"),
      ]);

      const booksList = books.data.books || books.data;
      const membersList = members.data.users || members.data;
      const transactionsList = transactions.data.transactions || transactions.data;

      setStats({
        books: books.data.pagination?.totalBooks || booksList.length,
        members: members.data.pagination?.totalUsers || membersList.length,
        loans: transactionsList.filter(t => t.transactionStatus === "Active").length,
      });
      
      setRecentBooks(booksList.slice(0, 6));
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-5xl mx-auto px-6 py-24">
          <h1 className="text-5xl font-bold mb-4">
            Find your next<br />great read
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl">
            Browse thousands of books, request loans online, and track everything from your dashboard.
          </p>
          
          {!mounted ? (
            <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse"></div>
          ) : user ? (
            <Link
              href={user.isAdmin ? "/admin/dashboard" : "/dashboard"}
              className="inline-block px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
              <Link
                href="/books"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition backdrop-blur"
              >
                Browse Books
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="relative max-w-5xl mx-auto px-6 -mt-16 z-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-slate-900">
              {loading ? "—" : stats.books}
            </div>
            <div className="text-sm text-slate-600 mt-1">Books</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-slate-900">
              {loading ? "—" : stats.members}
            </div>
            <div className="text-sm text-slate-600 mt-1">Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-slate-900">
              {loading ? "—" : stats.loans}
            </div>
            <div className="text-sm text-slate-600 mt-1">Issued Books</div>
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recently Added</h2>
          <Link href="/books" className="text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {recentBooks.map((book) => (
            <div key={book.id} className="group">
              <div className="bg-slate-100 rounded-lg aspect-[2/3] mb-2 overflow-hidden group-hover:shadow-lg transition">
                {book.coverURL ? (
                  <img 
                    src={book.coverURL} 
                    alt={book.bookName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-sm line-clamp-2 text-slate-900">
                {book.bookName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{book.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Start reading today
          </h2>
          <p className="text-slate-600 mb-6">
            Join our library and get instant access to thousands of books
          </p>
          <Link
            href="/books"
            className="inline-block px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            Browse Library
          </Link>
        </div>
      </section>
    </div>
  );
}
