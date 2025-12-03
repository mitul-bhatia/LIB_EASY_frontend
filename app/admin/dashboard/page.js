"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GetMember from "@/components/admin/GetMember";
import AddBook from "@/components/admin/AddBook";
import ManageBooks from "@/components/admin/ManageBooks";
import ManageCategories from "@/components/admin/ManageCategories";
import AddTransaction from "@/components/admin/AddTransaction";
import ReturnBook from "@/components/admin/ReturnBook";
import ApproveRequests from "@/components/admin/ApproveRequests";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("requests");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (!user.isAdmin) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage books, members, and transactions</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "requests"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📋 Pending Requests
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "categories"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab("addbook")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "addbook"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Book
              </button>
              <button
                onClick={() => setActiveTab("managebooks")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "managebooks"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Manage Books
              </button>
              <button
                onClick={() => setActiveTab("getmember")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "getmember"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                View Members
              </button>
              <button
                onClick={() => setActiveTab("addtransaction")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "addtransaction"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Issue/Reserve
              </button>
              <button
                onClick={() => setActiveTab("return")}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === "return"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Return Book
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "requests" && <ApproveRequests />}
            {activeTab === "categories" && <ManageCategories />}
            {activeTab === "addbook" && <AddBook />}
            {activeTab === "managebooks" && <ManageBooks />}
            {activeTab === "getmember" && <GetMember />}
            {activeTab === "addtransaction" && <AddTransaction />}
            {activeTab === "return" && <ReturnBook />}
          </div>
        </div>
      </div>
    </div>
  );
}
