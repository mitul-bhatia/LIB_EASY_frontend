"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AllBooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        api.get("/books/allbooks"),
        api.get("/categories/allcategories"),
      ]);
      setAllBooks(booksRes.data);
      setFilteredBooks(booksRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = (categoryId) => {
    if (categoryId === "All") {
      setFilteredBooks(allBooks);
      setSelectedCategory("All");
    } else {
      const filtered = allBooks.filter((book) =>
        book.categories.includes(categoryId)
      );
      setFilteredBooks(filtered);
      const category = categories.find((c) => c.id === categoryId);
      setSelectedCategory(category?.categoryName || "All");
    }
  };

  const getBookStatus = (book) => {
    return book.bookCountAvailable > 0 ? "Available" : "Unavailable";
  };

  const handleRequestBook = (book) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    if (user.isAdmin) {
      // Admins should use admin dashboard, just redirect
      router.push("/admin/dashboard");
      return;
    }

    // Navigate to request page
    router.push(`/books/request/${book.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Books</h1>
          <p className="text-slate-600">{allBooks.length} books available</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => filterByCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedCategory === "All"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => filterByCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.categoryName
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div key={book.id} className="group">
                {/* Book Cover */}
                <div className="bg-slate-100 rounded-lg aspect-[2/3] mb-3 flex items-center justify-center group-hover:bg-slate-200 transition">
                  <span className="text-5xl">📚</span>
                </div>

                {/* Book Info */}
                <h3 className="font-semibold text-sm line-clamp-2 text-slate-900 mb-1">
                  {book.bookName}
                </h3>
                <p className="text-xs text-slate-500 mb-2">{book.author}</p>

                {/* Availability */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className={`font-medium ${
                    book.bookCountAvailable > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {book.bookCountAvailable > 0 ? "Available" : "Unavailable"}
                  </span>
                  <span className="text-slate-500">{book.bookCountAvailable} left</span>
                </div>

                {/* Action Button */}
                {user && !user.isAdmin && (
                  <button
                    onClick={() => handleRequestBook(book)}
                    className="w-full py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
                  >
                    Request
                  </button>
                )}

                {!user && (
                  <button
                    onClick={() => router.push("/signin")}
                    className="w-full py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
                  >
                    Sign in
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No books in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
