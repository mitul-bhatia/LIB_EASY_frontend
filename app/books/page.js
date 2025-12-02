"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function AllBooksPage() {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Library Catalog</h1>
          <p className="text-gray-600 mt-1">
            Browse our collection of {allBooks.length} books
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => filterByCategory("All")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border hover:bg-gray-50"
              }`}
            >
              All Categories ({allBooks.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => filterByCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category.categoryName
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border hover:bg-gray-50"
                }`}
              >
                {category.categoryName} ({category.books.length})
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                {/* Book Cover Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>

                {/* Book Info */}
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {book.bookName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                {book.alternateTitle && (
                  <p className="text-xs text-gray-500 mb-2 italic">
                    {book.alternateTitle}
                  </p>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getBookStatus(book) === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {getBookStatus(book)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {book.bookCountAvailable} copies
                  </span>
                </div>

                {/* Additional Info */}
                {(book.language || book.publisher) && (
                  <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                    {book.language && <p>Language: {book.language}</p>}
                    {book.publisher && <p>Publisher: {book.publisher}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No books found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
