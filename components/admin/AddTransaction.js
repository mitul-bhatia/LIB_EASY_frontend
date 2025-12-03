"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export default function AddTransaction() {
  const { user } = useAuth();
  const [allMembers, setAllMembers] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [transactionType, setTransactionType] = useState("Issued");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, booksRes, transactionsRes] = await Promise.all([
        api.get("/users/allmembers", { params: { limit: 100 } }),
        api.get("/books/allbooks", { params: { limit: 100 } }),
        api.get("/transactions/all-transactions", { params: { page: 1, limit: 5, sortBy: 'createdAt', sortOrder: 'desc' } }),
      ]);
      setAllMembers(membersRes.data.users || membersRes.data);
      setAllBooks(booksRes.data.books || booksRes.data);
      setRecentTransactions(transactionsRes.data.transactions || transactionsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const calculateFine = (toDate) => {
    const currentDate = new Date();
    const dueDate = new Date(toDate);
    const diffTime = currentDate - dueDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 10 : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (!selectedMember || !selectedBook || !fromDate || !toDate) {
      setMessage("All fields are required");
      setIsLoading(false);
      return;
    }

    if (transactionType === "Issued" && selectedBook.bookCountAvailable <= 0) {
      setMessage("Book not available for issue");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        bookId: selectedBook.id,
        borrowerId: selectedMember.memberId || selectedMember.email,
        bookName: selectedBook.bookName,
        borrowerName: selectedMember.userFullName,
        transactionType,
        fromDate,
        toDate,
        isAdmin: user?.isAdmin || false,
      };

      const res = await api.post("/transactions/add-transaction", payload);
      setMessage("Transaction created successfully");

      setRecentTransactions([res.data, ...recentTransactions.slice(0, 4)]);

      setSelectedMember(null);
      setSelectedBook(null);
      setFromDate("");
      setToDate("");
      setTransactionType("Issued");

      fetchData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create transaction");
    } finally {
      setIsLoading(false);
    }
  };

  const activeTransactions = selectedMember?.activeTransactions?.filter(
    (t) => t && t.transactionStatus === "Active"
  ) || [];

  const issuedCount = activeTransactions.filter(
    (t) => t.transactionType === "Issued"
  ).length;
  const reservedCount = activeTransactions.filter(
    (t) => t.transactionType === "Reserved"
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Add Transaction</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member
          </label>
          <select
            value={selectedMember?.id || ""}
            onChange={(e) => {
              const member = allMembers.find((m) => m.id === e.target.value);
              setSelectedMember(member);
            }}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Select a member --</option>
            {allMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.userFullName} [{member.memberId || member.email}]
              </option>
            ))}
          </select>
        </div>

        {selectedMember && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Member Details</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Issued</p>
                <p className="font-semibold">{issuedCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Reserved</p>
                <p className="font-semibold">{reservedCount}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Active</p>
                <p className="font-semibold">{activeTransactions.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Points</p>
                <p className="font-semibold">{selectedMember.points}</p>
              </div>
            </div>

            {activeTransactions.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Active Transactions</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border rounded text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left">Book</th>
                        <th className="px-2 py-1 text-left">Type</th>
                        <th className="px-2 py-1 text-left">To Date</th>
                        <th className="px-2 py-1 text-left">Fine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTransactions.map((tx) => {
                        const fine = calculateFine(tx.toDate);
                        return (
                          <tr key={tx.id} className={fine > 0 ? "bg-red-50" : ""}>
                            <td className="px-2 py-1">{tx.bookName}</td>
                            <td className="px-2 py-1">{tx.transactionType}</td>
                            <td className="px-2 py-1">{tx.toDate}</td>
                            <td className="px-2 py-1 font-semibold">${fine}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Book
          </label>
          <select
            value={selectedBook?.id || ""}
            onChange={(e) => {
              const book = allBooks.find((b) => b.id === e.target.value);
              setSelectedBook(book);
            }}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Select a book --</option>
            {allBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.bookName} - Available: {book.bookCountAvailable}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="Issued">Issue</option>
            <option value="Reserved">Reserve</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Creating..." : "Create Transaction"}
        </button>
      </form>

      {recentTransactions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    S.No
                  </th>
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
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx, index) => (
                  <tr key={tx.id} className="border-t">
                    <td className="px-4 py-2 text-sm">{index + 1}</td>
                    <td className="px-4 py-2 text-sm">{tx.bookName}</td>
                    <td className="px-4 py-2 text-sm">{tx.borrowerName}</td>
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
                    <td className="px-4 py-2 text-sm">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
