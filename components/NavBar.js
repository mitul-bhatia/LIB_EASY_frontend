
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm p-4 flex justify-between items-center z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold text-blue-700">LIB_EASY</Link>
        <Link href="/books" className="text-sm text-gray-600 hover:text-blue-600">Books</Link>
      </div>

      <div className="flex items-center gap-4">
        {user === null ? (
          <>
            <Link href="/signin" className="text-sm text-gray-700 hover:text-blue-600">Sign In</Link>
            <Link href="/signup" className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Sign Up</Link>
          </>
        ) : (
          <>
            <span className="text-sm mr-2 text-gray-700">
              Hi, {user.name || user.email} ({user.role})
            </span>

            {user.role === "ADMIN" && (
              <Link href="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
                Admin
              </Link>
            )}

            <Link href="/" className="text-sm text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
