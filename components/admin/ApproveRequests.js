"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function ApproveRequests() {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await api.get("/transactions/all-transactions", {
        params: { status: "Pending", limit: 100 }
      });
      const transactions = res.data.transactions || res.data;
      // Sort by creation date (newest first)
      transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPendingRequests(transactions);
    } catch (err) {
      console.error("Failed to fetch pending requests:", err);
    }
  };

  const handleApprove = async (transactionId) => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post(`/transactions/approve/${transactionId}`, {
        isAdmin: user?.isAdmin || false,
      });
      setMessage(res.data.message || "Request approved and book issued successfully!");
      fetchPendingRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to approve request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (transactionId) => {
    setIsLoading(true);
    setMessage("");
    try {
      const res = await api.post(`/transactions/reject/${transactionId}`, {
        isAdmin: user?.isAdmin || false,
      });
      setMessage(res.data.message || "Request rejected successfully");
      fetchPendingRequests();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reject request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Pending Book Requests</h2>
        <p className="text-sm text-gray-600 mb-4">
          Review and approve or reject student book requests.
        </p>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              message.includes("success") || message.includes("approved")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {pendingRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    S.No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Student Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Student ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Book Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    From Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    To Date
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Duration
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Requested On
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request, index) => (
                  <tr key={request.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm font-medium">
                      {request.borrowerName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {request.borrowerId}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      {request.bookName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {request.fromDate}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {request.toDate}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {Math.ceil((new Date(request.toDate) - new Date(request.fromDate)) / (1000 * 60 * 60 * 24))} days
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded font-medium text-sm ${
                            isLoading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded font-medium text-sm ${
                            isLoading
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No pending requests</p>
            <p className="text-sm text-gray-400 mt-2">
              All book requests have been processed
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-orange-400">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">
                {pendingRequests.length}
              </p>
              <p className="text-sm text-zinc-500 mt-1">Pending Requests</p>
            </div>
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">
                {pendingRequests.filter((r) => 
                  new Date(r.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
              <p className="text-sm text-zinc-500 mt-1">Today's Requests</p>
            </div>
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-5 border-t-4 border-t-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-3xl font-mono font-bold text-zinc-900 tracking-tighter">
                {new Set(pendingRequests.map((r) => r.borrowerId)).size}
              </p>
              <p className="text-sm text-zinc-500 mt-1">Unique Students</p>
            </div>
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
