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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Manage Books</h2>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Book</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Book Name</label>
                <input
                  type="text"
                  value={editingBook.bookName}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, bookName: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  value={editingBook.author}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, author: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <input
                    type="text"
                    value={editingBook.language || ""}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, language: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Publisher</label>
                  <input
                    type="text"
                    value={editingBook.publisher || ""}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, publisher: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Available Copies</label>
                <input
                  type="number"
                  value={editingBook.bookCountAvailable}
                  onChange={(e) =>
                    setEditingBook({
                      ...editingBook,
                      bookCountAvailable: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-2 border rounded-lg"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cover URL</label>
                <input
                  type="url"
                  value={editingBook.coverURL || ""}
                  onChange={(e) =>
                    setEditingBook({ ...editingBook, coverURL: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        editingBook.categories?.includes(cat.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingBook(null)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium">S.No</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Book Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Author</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Available</th>
              <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={book.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{index + 1}</td>
                <td className="px-4 py-2 text-sm font-medium">{book.bookName}</td>
                <td className="px-4 py-2 text-sm">{book.author}</td>
                <td className="px-4 py-2 text-sm">{book.bookCountAvailable}</td>
                <td className="px-4 py-2 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    >
                      Delete
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
