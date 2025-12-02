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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Categories List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">All Categories</h3>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-3 bg-gray-50 border rounded-lg"
                >
                  <p className="font-medium">{category.categoryName}</p>
                  <p className="text-sm text-gray-600">
                    {category.books.length} book{category.books.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No categories yet. Add your first category above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
