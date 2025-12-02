"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddMember from "@/components/admin/AddMember";
import GetMember from "@/components/admin/GetMember";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("addmember");

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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {user.userFullName}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("addmember")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "addmember"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Add Member
              </button>
              <button
                onClick={() => setActiveTab("getmember")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "getmember"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                View Members
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "addmember" && <AddMember />}
            {activeTab === "getmember" && <GetMember />}
          </div>
        </div>
      </div>
    </div>
  );
}
