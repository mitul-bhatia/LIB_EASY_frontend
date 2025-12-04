"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/allcategories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!newCategory.trim()) {
      setMessage("Category name is required");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/categories/addcategory", {
        categoryName: newCategory.trim(),
      });
      setMessage("Category added successfully!");
      setCategories([res.data, ...categories]);
      setNewCategory("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Manage Categories</h2>

      {/* Add Category Form */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5">
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md font-medium text-white text-sm transition-colors ${
              isLoading
                ? "bg-zinc-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </form>
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

      {/* Categories List */}
      <div>
        <h3 className="text-base font-medium text-zinc-900 mb-3">All Categories</h3>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-white border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-zinc-900">{category.categoryName}</p>
                <p className="text-sm text-zinc-500 mt-1">
                  {category.books.length} book{category.books.length !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-center py-8 text-sm">
            No categories yet. Add your first category above.
          </p>
        )}
      </div>
    </div>
  );
}
