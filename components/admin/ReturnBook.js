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
      const res = await api.get("/transactions/all-transactions", {
        params: { status: "Active", limit: 100 }
      });
      const transactions = res.data.transactions || res.data;
      setActiveTransactions(transactions);
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
    <div className="space-y-5">
      <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Return Book</h2>

      <input
        type="text"
        placeholder="Search by book name, borrower name, or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />

      {message && (
        <div
          className={`px-4 py-3 rounded-md border text-sm ${
            message.includes("success")
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      {filteredTransactions.length > 0 ? (
        <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead>
              <tr className="bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Book Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Borrower
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  From Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  To Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredTransactions.map((tx) => {
                const fine = calculateFine(tx.toDate);
                const isOverdue = fine > 0;
                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${isOverdue ? "bg-red-50 hover:bg-red-100" : "hover:bg-zinc-50"}`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900">{tx.bookName}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-zinc-900">{tx.borrowerName}</div>
                      <div className="text-xs text-zinc-500">{tx.borrowerId}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${
                          tx.transactionType === "Issued"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{tx.fromDate}</td>
                    <td className="px-4 py-3 text-sm text-zinc-600">{tx.toDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`font-mono font-semibold ${
                          isOverdue ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        ${fine}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleReturn(tx)}
                        disabled={isLoading}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isLoading
                            ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
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
        <div className="text-center py-12 bg-zinc-50 rounded-lg border border-zinc-200">
          <p className="text-zinc-500 text-sm">
            {searchTerm
              ? "No transactions found matching your search"
              : "No active transactions"}
          </p>
        </div>
      )}
    </div>
  );
}
