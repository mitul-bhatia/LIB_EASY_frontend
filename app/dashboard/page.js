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

  const issuedTransactions =
    memberDetails?.activeTransactions?.filter(
      (t) => t && t.transactionType === "Issued" && t.transactionStatus === "Active"
    ) || [];

  const reservedTransactions =
    memberDetails?.activeTransactions?.filter(
      (t) => t && t.transactionType === "Reserved" && t.transactionStatus === "Active"
    ) || [];

  const previousTransactions = memberDetails?.prevTransactions || [];

  if (!user || user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Member Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user.userFullName}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
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
                onClick={() => setActiveTab("reserved")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reserved"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Reserved Books
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
                      <p className="text-sm text-gray-600">User Type</p>
                      <p className="font-medium">{memberDetails.userType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ID</p>
                      <p className="font-medium">
                        {memberDetails.admissionId || memberDetails.employeeId}
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
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {issuedTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Active Issued</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {reservedTransactions.length}
                    </p>
                    <p className="text-sm text-gray-600">Active Reserved</p>
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

            {activeTab === "reserved" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Reserved Books</h2>
                {reservedTransactions.length > 0 ? (
                  <table className="min-w-full bg-white border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">S.No</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Book Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">From Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">To Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservedTransactions.map((tx, index) => (
                        <tr key={tx.id} className="border-t">
                          <td className="px-4 py-2 text-sm">{index + 1}</td>
                          <td className="px-4 py-2 text-sm">{tx.bookName}</td>
                          <td className="px-4 py-2 text-sm">{tx.fromDate}</td>
                          <td className="px-4 py-2 text-sm">{tx.toDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reserved books</p>
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
