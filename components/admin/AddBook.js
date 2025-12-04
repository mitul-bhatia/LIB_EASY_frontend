"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AddBook() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bookName: "",
    alternateTitle: "",
    author: "",
    bookCountAvailable: "",
    language: "",
    publisher: "",
    coverURL: "",
  });
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchRecentBooks();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/allcategories");
      setAllCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchRecentBooks = async () => {
    try {
      const res = await api.get("/books/allbooks", {
        params: { page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }
      });
      const books = res.data.books || res.data;
      setRecentBooks(books);
    } catch (err) {
      console.error("Failed to fetch recent books:", err);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Validate required fields
    if (!form.bookName || !form.author || !form.bookCountAvailable) {
      setMessage("Book name, author, and available copies are required");
      setIsLoading(false);
      return;
    }

    if (parseInt(form.bookCountAvailable) < 0) {
      setMessage("Available copies cannot be negative");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        bookCountAvailable: parseInt(form.bookCountAvailable),
        categories: selectedCategories,
        isAdmin: user?.isAdmin || false,
      };

      const res = await api.post("/books/addbook", payload);
      setMessage("Book added successfully! 🎉");

      // Update recent books
      setRecentBooks([res.data, ...recentBooks.slice(0, 4)]);

      // Clear form
      setForm({
        bookName: "",
        alternateTitle: "",
        author: "",
        bookCountAvailable: "",
        language: "",
        publisher: "",
        coverURL: "",
      });
      setSelectedCategories([]);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Add New Book</h2>

      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Book Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Book Name *
            </label>
            <input
              type="text"
              value={form.bookName}
              onChange={(e) => setForm({ ...form, bookName: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Alternate Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Alternate Title
            </label>
            <input
              type="text"
              value={form.alternateTitle}
              onChange={(e) => setForm({ ...form, alternateTitle: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Author Name *
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>

          {/* Language and Publisher */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Language
              </label>
              <input
                type="text"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Publisher
              </label>
              <input
                type="text"
                value={form.publisher}
                onChange={(e) => setForm({ ...form, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Available Copies */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              No. of Copies Available *
            </label>
            <input
              type="number"
              value={form.bookCountAvailable}
              onChange={(e) =>
                setForm({ ...form, bookCountAvailable: e.target.value })
              }
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              min="0"
              required
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Cover Image URL
            </label>
            <input
              type="url"
              value={form.coverURL}
              onChange={(e) => setForm({ ...form, coverURL: e.target.value })}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            <p className="text-xs text-zinc-500 mt-1.5">
              Optional: Add a URL to the book cover image
            </p>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Categories *
            </label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
            {allCategories.length === 0 && (
              <p className="text-sm text-zinc-500 mt-2">
                No categories available. Add categories first.
              </p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`px-4 py-3 rounded-md border text-sm ${
                message.includes("success")
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-md font-medium text-white text-sm transition-colors ${
              isLoading
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>

      {/* Recently Added Books */}
      {recentBooks.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-zinc-900 mb-3">Recently Added Books</h3>
          <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead>
                <tr className="bg-zinc-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Book Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Added Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentBooks.map((book, index) => (
                  <tr key={book.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-zinc-500">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{book.bookName}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{book.author}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
