"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function ManageBooks() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        api.get("/books/allbooks", { params: { limit: 100 } }),
        api.get("/categories/allcategories"),
      ]);
      setBooks(booksRes.data.books || booksRes.data);
      setCategories(categoriesRes.data || categoriesRes);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook({ ...book });
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!editingBook) return;

    try {
      const updateData = {
        bookName: editingBook.bookName,
        author: editingBook.author,
        language: editingBook.language || "",
        publisher: editingBook.publisher || "",
        bookCountAvailable: parseInt(editingBook.bookCountAvailable),
        coverURL: editingBook.coverURL || null,
        categories: editingBook.categories || [],
        isAdmin: user?.isAdmin,
      };

      await api.put(`/books/updatebook/${editingBook.id}`, updateData);
      setMessage("Book updated successfully!");
      setEditingBook(null);
      fetchData();
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.message || "Failed to update book");
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/books/removebook/${bookId}`, {
        data: { isAdmin: user?.isAdmin },
      });
      setMessage("Book deleted successfully!");
      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete book");
    }
  };

  const handleCategoryToggle = (categoryId) => {
    if (!editingBook) return;
    const categories = editingBook.categories || [];
    if (categories.includes(categoryId)) {
      setEditingBook({
        ...editingBook,
        categories: categories.filter((id) => id !== categoryId),
      });
    } else {
      setEditingBook({
        ...editingBook,
        categories: [...categories, categoryId],
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Manage Books</h2>

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

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border border-zinc-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight mb-6">Edit Book</h3>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Book Name</label>
                  <input
                    type="text"
                    value={editingBook.bookName}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, bookName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Author</label>
                  <input
                    type="text"
                    value={editingBook.author}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, author: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Language</label>
                  <input
                    type="text"
                    value={editingBook.language || ""}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, language: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Publisher</label>
                  <input
                    type="text"
                    value={editingBook.publisher || ""}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, publisher: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Available Copies</label>
                <input
                  type="number"
                  value={editingBook.bookCountAvailable}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      bookCountAvailable: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Cover URL</label>
                <input
                  type="url"
                  value={editingBook.coverURL || ""}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, coverURL: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        editingBook.categories?.includes(cat.id)
                          ? "bg-indigo-600 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-zinc-200">
                <button
                  onClick={() => setEditingBook(null)}
                  className="flex-1 px-4 py-2 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm transition-colors"
                >
                  Update Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200">
          <thead>
            <tr className="bg-zinc-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Book Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Author</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Available</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {books.map((book, index) => (
              <tr key={book.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 text-sm text-zinc-500">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium text-zinc-900">{book.bookName}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">{book.author}</td>
                <td className="px-4 py-3 text-sm text-zinc-600">{book.bookCountAvailable}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(book)}
                      className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="Edit book"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete book"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
