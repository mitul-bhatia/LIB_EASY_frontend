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
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage books, members, and transactions</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
          <div className="border-b border-zinc-200">
            <nav className="flex gap-1 px-6 overflow-x-auto" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("requests")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "requests"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Pending Requests
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "categories"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Categories
              </button>
              <button
                onClick={() => setActiveTab("addbook")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "addbook"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Add Book
              </button>
              <button
                onClick={() => setActiveTab("managebooks")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "managebooks"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Manage Books
              </button>
              <button
                onClick={() => setActiveTab("getmember")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "getmember"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                View Members
              </button>
              <button
                onClick={() => setActiveTab("addtransaction")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "addtransaction"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Issue/Reserve
              </button>
              <button
                onClick={() => setActiveTab("return")}
                className={`py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === "return"
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
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
