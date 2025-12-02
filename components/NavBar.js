
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-library-800 text-2xl">
              <i className="fa-solid fa-book-bookmark"></i>
            </span>
            <Link href="/" className="font-serif font-bold text-xl text-library-900 tracking-tight hover:text-library-800 transition">
              LibEasy
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/books" className="text-gray-600 hover:text-library-800 font-medium text-sm transition">
              Browse Books
            </Link>
            {user && (
              <Link 
                href={user.isAdmin ? "/admin/dashboard" : "/dashboard"} 
                className="text-gray-600 hover:text-library-800 font-medium text-sm transition"
              >
                {user.isAdmin ? "Admin Panel" : "My Loans"}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user === null ? (
              <>
                <Link href="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-library-800 hover:bg-library-900 text-white text-sm font-medium px-4 py-2 rounded-md transition">
                  Join Library
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-red-600 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
