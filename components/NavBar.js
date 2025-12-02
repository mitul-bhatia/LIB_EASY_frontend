
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
            <Link href="/signup" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
          </>
        ) : (
          <>
            <Link 
              href={user.isAdmin ? "/admin/dashboard" : "/dashboard"} 
              className="text-sm text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
