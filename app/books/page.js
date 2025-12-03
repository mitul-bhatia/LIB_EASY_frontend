"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AllBooksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [page, selectedCategory, debouncedSearch]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 15 };
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      const [booksRes, categoriesRes] = await Promise.all([
        api.get("/books/allbooks", { params }),
        api.get("/categories/allcategories"),
      ]);
      
      setBooks(booksRes.data.books || booksRes.data);
      setPagination(booksRes.data.pagination);
      setCategories(categoriesRes.data || categoriesRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
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
          <p className="text-slate-600">{pagination?.totalBooks || books.length} books available</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by name or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none"
          />
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
        {books.length > 0 ? (
          <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <div key={book.id} className="group">
                {/* Book Cover */}
                <div className="bg-slate-100 rounded-lg aspect-[2/3] mb-3 overflow-hidden group-hover:shadow-lg transition">
                  {book.coverURL ? (
                    <img 
                      src={book.coverURL} 
                      alt={book.bookName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📚</span>
                    </div>
                  )}
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
