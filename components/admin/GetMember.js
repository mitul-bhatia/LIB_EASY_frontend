"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function GetMember() {
  const [allMembers, setAllMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [memberDetails, setMemberDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllMembers();
  }, []);

  const fetchAllMembers = async () => {
    try {
      const res = await api.get("/users/allmembers");
      setAllMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    }
  };

  const fetchMemberDetails = async (memberId) => {
    if (!memberId) return;
    
    setIsLoading(true);
    try {
      const res = await api.get(`/users/getuser/${memberId}`);
      setMemberDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch member details:", err);
      alert("Failed to fetch member details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberSelect = (e) => {
    const memberId = e.target.value;
    setSelectedMemberId(memberId);
    if (memberId) {
      fetchMemberDetails(memberId);
    } else {
      setMemberDetails(null);
    }
  };

  const calculateFine = (toDate) => {
    const currentDate = new Date();
    const dueDate = new Date(toDate);
    const diffTime = currentDate - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 10 : 0;
  };

  const activeTransactions = memberDetails?.activeTransactions?.filter(
    (t) => t && t.transactionStatus === "Active"
  ) || [];

  const prevTransactions = memberDetails?.prevTransactions?.filter(
    (t) => t && t.transactionStatus === "Completed"
  ) || [];

  const issuedCount = activeTransactions.filter(
    (t) => t.transactionType === "Issued"
  ).length;

  const reservedCount = activeTransactions.filter(
    (t) => t.transactionType === "Reserved"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">View Member Details</h2>

        {/* Member Selection Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member
          </label>
          <select
            value={selectedMemberId}
            onChange={handleMemberSelect}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Select a member --</option>
            {allMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.userFullName} [{member.memberId || member.email}]
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading member details...</p>
          </div>
        )}

        {/* Member Details */}
        {memberDetails && !isLoading && (
          <div className="space-y-6">
            {/* Member Summary Card */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Member Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{memberDetails.userFullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      memberDetails.isAdmin 
                        ? "bg-red-100 text-red-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {memberDetails.isAdmin ? "Admin" : "Student"}
                    </span>
                  </p>
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
                  <p className="font-medium">{memberDetails.points}</p>
                </div>
              </div>

              {/* Transaction Counts */}
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{issuedCount}</p>
                    <p className="text-sm text-gray-600">Active Issued</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{reservedCount}</p>
                    <p className="text-sm text-gray-600">Active Reserved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {activeTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Active</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {prevTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Previous</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Active Transactions</h3>
              {activeTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Book Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          From Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          To Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Fine
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTransactions.map((transaction) => {
                        const fine = calculateFine(transaction.toDate);
                        const isOverdue = fine > 0;
                        return (
                          <tr
                            key={transaction.id}
                            className={`border-t ${isOverdue ? "bg-red-50" : ""}`}
                          >
                            <td className="px-4 py-2 text-sm">{transaction.bookName}</td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  transaction.transactionType === "Issued"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {transaction.transactionType}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">{transaction.fromDate}</td>
                            <td className="px-4 py-2 text-sm">{transaction.toDate}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                                ${fine}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active transactions</p>
              )}
            </div>

            {/* Previous Transactions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Previous Transactions</h3>
              {prevTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Book Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Type
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          From Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          To Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Return Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {prevTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{transaction.bookName}</td>
                          <td className="px-4 py-2 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                transaction.transactionType === "Issued"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {transaction.transactionType}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">{transaction.fromDate}</td>
                          <td className="px-4 py-2 text-sm">{transaction.toDate}</td>
                          <td className="px-4 py-2 text-sm">
                            {transaction.returnDate || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No previous transactions</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
