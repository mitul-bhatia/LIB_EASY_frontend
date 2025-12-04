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
          <div className="border-b border-zinc-200">
            <nav className="flex gap-1 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                  activeTab === "pending"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Pending Requests
                {pendingTransactions.length > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded font-semibold">
                    {pendingTransactions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("issued")}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "issued"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Issued Books
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "history"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "profile" && memberDetails && (
              <div className="space-y-6">
                {/* ID Card Style Profile */}
                <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
                        {memberDetails.userFullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                          {memberDetails.userFullName}
                        </h2>
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          Member
                        </span>
                        {memberDetails.memberId && (
                          <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-700 text-xs font-medium rounded-full">
                            {memberDetails.memberId}
                          </span>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-zinc-600">{memberDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-zinc-600">{memberDetails.mobileNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          <span className="text-zinc-900 font-semibold">{memberDetails.points} Points</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-orange-400">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">
                          {pendingTransactions.length}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">Pending Requests</p>
                      </div>
               
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-blue-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">
                          {issuedTransactions.length}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">Issued Books</p>
                      </div>
                
                    </div>
                  </div>

                  <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-green-500">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">
                          {previousTransactions.length}
                        </p>
                        <p className="text-sm text-zinc-500 mt-1">Completed</p>
                      </div>
                  
                    </div>
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
