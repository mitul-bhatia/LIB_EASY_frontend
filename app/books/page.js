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
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">Browse Books</h1>
          <p className="text-zinc-600">{pagination?.totalBooks || books.length} books available</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search books by name or author..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 border border-zinc-300 rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => filterByCategory("All")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === "All"
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => filterByCategory(cat.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === cat.categoryName
                  ? "bg-zinc-900 text-white"
                  : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        {books.length > 0 ? (
          <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {books.map((book) => (
              <div key={book.id} className="group bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Book Cover */}
                <div className="bg-zinc-100 aspect-[2/3] overflow-hidden">
                  {book.coverURL ? (
                    <img 
                      src={book.coverURL} 
                      alt={book.bookName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">📚</span>
                    </div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-2 text-zinc-900 mb-1">
                    {book.bookName}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-3">{book.author}</p>

                  {/* Availability */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className={`font-medium ${
                      book.bookCountAvailable > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {book.bookCountAvailable > 0 ? "Available" : "Unavailable"}
                    </span>
                    <span className="text-zinc-500 font-mono">{book.bookCountAvailable} left</span>
                  </div>

                  {/* Action Button */}
                  {user && !user.isAdmin && (
                    <button
                      onClick={() => handleRequestBook(book)}
                      className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Request
                    </button>
                  )}

                  {!user && (
                    <button
                      onClick={() => router.push("/signin")}
                      className="w-full py-2 bg-zinc-100 text-zinc-700 text-sm font-medium rounded-md hover:bg-zinc-200 transition-colors"
                    >
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-zinc-600">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-16 bg-white border border-zinc-200 rounded-lg">
            <p className="text-zinc-500 text-sm">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
