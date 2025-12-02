"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Link from "next/link";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalReservations: 0,
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch all data in parallel
      const [booksRes, membersRes, transactionsRes] = await Promise.all([
        api.get("/books/allbooks"),
        api.get("/users/allmembers"),
        api.get("/transactions/all-transactions"),
      ]);

      // Calculate stats
      const totalBooks = booksRes.data.length;
      const totalMembers = membersRes.data.length;
      const activeReservations = transactionsRes.data.filter(
        (tx) =>
          tx.transactionType === "Reserved" && tx.transactionStatus === "Active"
      ).length;

      setStats({
        totalBooks,
        totalMembers,
        totalReservations: activeReservations,
      });

      // Get 5 most recent books (already sorted by createdAt desc)
      setRecentBooks(booksRes.data.slice(0, 5));

      // Sort books by transaction count for popular books
      const sortedByPopularity = [...booksRes.data].sort((a, b) => {
        const aCount = a.transactions?.length || 0;
        const bCount = b.transactions?.length || 0;
        return bCount - aCount;
      });
      setPopularBooks(sortedByPopularity.slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch home data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to Library Management System
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover, borrow, and explore thousands of books
          </p>
          {!user && (
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/signin")}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 transition border-2 border-white"
              >
                Sign Up
              </button>
            </div>
          )}
          {user && (
            <div className="flex gap-4 items-center">
              <p className="text-xl">Welcome back, {user.userFullName}!</p>
              <Link
                href={user.isAdmin ? "/admin/dashboard" : "/dashboard"}
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {isLoading ? "..." : stats.totalBooks}
            </p>
            <p className="text-gray-600 font-medium">Total Books</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-4xl font-bold text-green-600 mb-2">
              {isLoading ? "..." : stats.totalMembers}
            </p>
            <p className="text-gray-600 font-medium">Total Members</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {isLoading ? "..." : stats.totalReservations}
            </p>
            <p className="text-gray-600 font-medium">Active Reservations</p>
          </div>
        </div>
      </div>

      {/* Recent Books Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Recently Added</h2>
          <Link
            href="/books"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {recentBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
            >
              <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">📕</span>
              </div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {book.bookName}
              </h3>
              <p className="text-xs text-gray-600">by {book.author}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Books Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Popular Books</h2>
            <Link
              href="/books"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex gap-4"
              >
                <div className="w-24 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">📘</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {book.bookName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {book.transactions?.length || 0} borrows
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        book.bookCountAvailable > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {book.bookCountAvailable > 0 ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Start Your Reading Journey</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community and get access to thousands of books
          </p>
          <Link
            href="/books"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
