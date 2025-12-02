"use client";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [memberDetails, setMemberDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else if (user.isAdmin) {
      router.push("/admin/dashboard");
    } else {
      fetchMemberDetails();
    }
  }, [user, router]);

  const fetchMemberDetails = async () => {
    try {
      const res = await api.get(`/users/getuser/${user.id}`);
      setMemberDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch member details:", err);
    }
  };

  const calculateFine = (toDate) => {
    const currentDate = new Date();
    const dueDate = new Date(toDate);
    const diffTime = currentDate - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 10 : 0;
  };

  const pendingTransactions =
    memberDetails?.activeTransactions?.filter(
      (t) => t && t.transactionStatus === "Pending"
    ) || [];

  const issuedTransactions =
    memberDetails?.activeTransactions?.filter(
      (t) => t && t.transactionType === "Issued" && t.transactionStatus === "Active"
    ) || [];

  const previousTransactions = memberDetails?.prevTransactions || [];

  const [cancelMessage, setCancelMessage] = useState("");

  const handleCancelRequest = async (transactionId) => {
    setCancelMessage("");
    try {
      await api.post(`/transactions/cancel/${transactionId}`, {
        userId: user.id,
      });
      setCancelMessage("Request cancelled successfully");
      fetchMemberDetails();
      // Clear message after 3 seconds
      setTimeout(() => setCancelMessage(""), 3000);
    } catch (err) {
      setCancelMessage(err.response?.data?.message || "Failed to cancel request");
      setTimeout(() => setCancelMessage(""), 3000);
    }
  };

  if (!user || user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">View your books and manage requests</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                  activeTab === "pending"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Pending Requests
                {pendingTransactions.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                    {pendingTransactions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("issued")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "issued"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Issued Books
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "profile" && memberDetails && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{memberDetails.userFullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium">{memberDetails.isAdmin ? "Admin" : "Student"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member ID</p>
                      <p className="font-medium">
                        {memberDetails.memberId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{memberDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium">{memberDetails.mobileNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Points</p>
                      <p className="font-medium text-blue-600 text-xl">
                        {memberDetails.points}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-yellow-600">
                      {pendingTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {issuedTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Issued</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {previousTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pending" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
                <p className="text-sm text-gray-600 mb-4">
                  These are your book requests waiting for admin approval.
                </p>
                
                {cancelMessage && (
                  <div className={`p-3 rounded-lg mb-4 ${
                    cancelMessage.includes("success") 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {cancelMessage}
                  </div>
                )}

                {pendingTransactions.length > 0 ? (
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">S.No</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Book Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">From Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">To Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Requested On</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingTransactions.map((tx, index) => (
                        <tr key={tx.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{index + 1}</td>
                          <td className="px-4 py-2 text-sm font-medium">{tx.bookName}</td>
                          <td className="px-4 py-2 text-sm">{tx.fromDate}</td>
                          <td className="px-4 py-2 text-sm">{tx.toDate}</td>
                          <td className="px-4 py-2 text-sm">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                              Pending Approval
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <button
                              onClick={() => handleCancelRequest(tx.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No pending requests</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Browse books and click "Request Book" to get started
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "issued" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Issued Books</h2>
                {issuedTransactions.length > 0 ? (
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">S.No</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Book Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">From Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">To Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Fine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issuedTransactions.map((tx, index) => {
                        const fine = calculateFine(tx.toDate);
                        return (
                          <tr key={tx.id} className={`border-t ${fine > 0 ? "bg-red-50" : ""}`}>
                            <td className="px-4 py-2 text-sm">{index + 1}</td>
                            <td className="px-4 py-2 text-sm">{tx.bookName}</td>
                            <td className="px-4 py-2 text-sm">{tx.fromDate}</td>
                            <td className="px-4 py-2 text-sm">{tx.toDate}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={fine > 0 ? "text-red-600 font-semibold" : ""}>
                                ${fine}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-8">No issued books</p>
                )}
              </div>
            )}



            {activeTab === "history" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                {previousTransactions.length > 0 ? (
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">S.No</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Book Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">From Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">To Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Return Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousTransactions.map((tx, index) => (
                        <tr key={tx.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{index + 1}</td>
                          <td className="px-4 py-2 text-sm">{tx.bookName}</td>
                          <td className="px-4 py-2 text-sm">{tx.fromDate}</td>
                          <td className="px-4 py-2 text-sm">{tx.toDate}</td>
                          <td className="px-4 py-2 text-sm">{tx.returnDate || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-8">No transaction history</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
