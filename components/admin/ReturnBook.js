"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function ReturnBook() {
  const { user } = useAuth();
  const [activeTransactions, setActiveTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchActiveTransactions();
  }, []);

  const fetchActiveTransactions = async () => {
    try {
      const res = await api.get("/transactions/all-transactions");
      const active = res.data.filter((tx) => tx.transactionStatus === "Active");
      setActiveTransactions(active);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  const calculateFine = (toDate) => {
    const currentDate = new Date();
    const dueDate = new Date(toDate);
    const diffTime = currentDate - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 10 : 0;
  };

  const handleReturn = async (transaction) => {
    setIsLoading(true);
    setMessage("");

    try {
      const res = await api.post(`/transactions/return/${transaction.id}`, {
        isAdmin: user?.isAdmin || false,
      });

      const fine = res.data.fine;
      setMessage(
        `Book returned successfully. Fine: $${fine}${
          fine > 0 ? " (Overdue)" : ""
        }`
      );

      fetchActiveTransactions();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to process return");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = activeTransactions.filter(
    (tx) =>
      tx.bookName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.borrowerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Return Book</h2>

        <input
          type="text"
          placeholder="Search by book name, borrower name, or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-4"
        />

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

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Book Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Borrower
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
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const fine = calculateFine(tx.toDate);
                  const isOverdue = fine > 0;
                  return (
                    <tr
                      key={tx.id}
                      className={`border-t ${isOverdue ? "bg-red-50" : ""}`}
                    >
                      <td className="px-4 py-2 text-sm">{tx.bookName}</td>
                      <td className="px-4 py-2 text-sm">
                        {tx.borrowerName}
                        <br />
                        <span className="text-xs text-gray-500">
                          {tx.borrowerId}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            tx.transactionType === "Issued"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">{tx.fromDate}</td>
                      <td className="px-4 py-2 text-sm">{tx.toDate}</td>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`font-semibold ${
                            isOverdue ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          ${fine}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleReturn(tx)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            isLoading
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {searchTerm
                ? "No transactions found matching your search"
                : "No active transactions"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
